import * as THREE from 'three';
import { setMessage } from './state.js';

export function getSwordBonus(level) {
  return 4 * 2 ** Math.max(level - 1, 0);
}

export function handleEnemyDefeat(state, scene, position) {
  state.player.level += 1;
  state.player.baseDamage += 1;

  const shardType =
    state.shardCycle[state.shardCycleIndex % state.shardCycle.length];

  state.shardCycleIndex += 1;
  const pickup = createShardPickup(state, shardType, position);
  state.pickups.push(pickup);
  scene.add(pickup.mesh);

  setMessage(
    state,
    `Block defeated. Level ${state.player.level} reached. A ${shardType} shard dropped.`,
    4
  );
}

export function updatePickups(state, scene, delta, elapsedTime) {
  const remainingPickups = [];

  for (const pickup of state.pickups) {
    pickup.mesh.rotation.y += delta * 2.8;
    pickup.mesh.position.y = pickup.baseY + Math.sin(elapsedTime * 3 + pickup.id) * 0.16;

    if (pickup.mesh.position.distanceTo(state.player.position) < 1.35) {
      scene.remove(pickup.mesh);
      collectShard(state, pickup.type);
      continue;
    }

    remainingPickups.push(pickup);
  }

  state.pickups = remainingPickups;
}

export function isNearForge(state) {
  return horizontalDistance(state.player.position, state.forge.position) <= state.forge.radius;
}

export function getForgeState(state) {
  const highestCombinableLevel = getHighestCombinableLevel(state);

  return {
    canCraft: canCraftSword(state),
    canCombine: highestCombinableLevel > 0,
    combineLevel: highestCombinableLevel
  };
}

export function getForgePrompt(state) {
  const action = getNextForgeAction(state);

  if (!action) {
    return 'Forge: walk into the glowing ring, then press E to open crafting.';
  }

  if (action.type === 'combine') {
    return 'Forge nearby. Press E to open sword crafting.';
  }

  return 'Forge nearby. Press E to open sword crafting.';
}

export function openForge(state) {
  state.mode = 'forge';
  state.ui.forgeOpen = true;
  setMessage(state, 'Forge opened. Press 1 to craft, 2 to combine, or E to close.', 4);
}

export function closeForge(state) {
  state.mode = 'playing';
  state.ui.forgeOpen = false;
}

export function handleForgeInput(state, input) {
  if (input.consumePress('Escape') || input.consumePress('KeyE')) {
    closeForge(state);
    setMessage(state, 'Forge closed.', 2);
    return;
  }

  if (input.consumePress('Digit1')) {
    if (tryCraftSword(state)) {
      return;
    }

    setMessage(state, 'Need 1 blade, 1 guard, and 1 pommel to craft a sword.', 3);
    return;
  }

  if (input.consumePress('Digit2')) {
    if (tryCombineSwords(state)) {
      return;
    }

    setMessage(state, 'Need two swords of the same level to combine them.', 3);
  }
}

export function tryCraftSword(state) {
  if (!canCraftSword(state)) {
    return false;
  }

  state.inventory.blade -= 1;
  state.inventory.guard -= 1;
  state.inventory.pommel -= 1;
  state.inventory.swordsByLevel[1] += 1;
  refreshEquippedSword(state);
  setMessage(state, 'Crafted a new level 1 sword.', 3);
  return true;
}

export function tryCombineSwords(state) {
  const level = getHighestCombinableLevel(state);

  if (!level) {
    return false;
  }

  state.inventory.swordsByLevel[level] -= 2;
  state.inventory.swordsByLevel[level + 1] += 1;
  refreshEquippedSword(state);
  setMessage(state, `Combined two level ${level} swords into level ${level + 1}.`, 4);
  return true;
}

function canCraftSword(state) {
  return (
    state.inventory.blade >= 1 &&
    state.inventory.guard >= 1 &&
    state.inventory.pommel >= 1
  );
}

function getNextForgeAction(state) {
  const highestCombinableLevel = getHighestCombinableLevel(state);

  if (highestCombinableLevel) {
    return { type: 'combine', level: highestCombinableLevel };
  }

  if (canCraftSword(state)) {
    return { type: 'craft' };
  }

  return null;
}

function getHighestCombinableLevel(state) {
  for (let level = 3; level >= 1; level -= 1) {
    if (state.inventory.swordsByLevel[level] >= 2) {
      return level;
    }
  }

  return 0;
}

function refreshEquippedSword(state) {
  for (let level = 4; level >= 1; level -= 1) {
    if (state.inventory.swordsByLevel[level] > 0) {
      state.player.swordLevel = level;
      return;
    }
  }

  state.player.swordLevel = 1;
  state.inventory.swordsByLevel[1] = 1;
}

function collectShard(state, shardType) {
  state.inventory[shardType] += 1;
  setMessage(state, `Collected a ${shardType} shard.`, 2.5);
}

function createShardPickup(state, shardType, position) {
  const materialMap = {
    blade: new THREE.MeshStandardMaterial({ color: '#dde7f4' }),
    guard: new THREE.MeshStandardMaterial({ color: '#efb75f' }),
    pommel: new THREE.MeshStandardMaterial({ color: '#8fc3f0' })
  };

  const geometryMap = {
    blade: new THREE.BoxGeometry(0.65, 0.1, 0.18),
    guard: new THREE.BoxGeometry(0.22, 0.6, 0.18),
    pommel: new THREE.IcosahedronGeometry(0.2, 0)
  };

  const mesh = new THREE.Mesh(geometryMap[shardType], materialMap[shardType]);
  mesh.position.copy(position);
  mesh.position.y = 0.85;

  return {
    id: state.nextIds.pickup++,
    type: shardType,
    mesh,
    baseY: 0.85
  };
}

function horizontalDistance(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.hypot(dx, dz);
}
