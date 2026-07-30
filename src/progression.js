import * as THREE from 'three';
import { setMessage } from './state.js';
import {
  canConfirmSword,
  canMergeNewestSwords,
  confirmShardSword,
  getCraftStatusText,
  getSwordDamageBonus,
  mergeNewestSwords,
  moveCraftCursor,
  placeSelectedShard,
  selectShardType,
  undoPlacedShard
} from './swordcraft.js';

export function getSwordBonus(state) {
  return getSwordDamageBonus(state);
}

export function handleEnemyDefeat(state, scene, position) {
  state.player.level += 1;
  state.player.baseDamage += 1;
  state.score.blocksDefeated += 1;

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
  return {
    canCraft: canConfirmSword(state),
    canCombine: canMergeNewestSwords(state),
    craftStatusText: getCraftStatusText(state)
  };
}

export function getForgePrompt(state) {
  return 'Forge nearby. Press E to open weapon crafting.';
}

export function openForge(state) {
  state.mode = 'forge';
  state.ui.forgeOpen = true;
  const message = canMergeNewestSwords(state)
    ? 'You have two weapons ready. Press M to merge them for extra power.'
    : 'Forge opened. Move with WASD, place shards with B/G/P, and press C.';
  setMessage(state, message, 4);
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

  if (placeShardFromShortcut(state, input)) {
    return;
  }

  if (input.consumePress('Digit1')) {
    selectShardType(state, 'blade');
    return;
  }

  if (input.consumePress('Digit2')) {
    selectShardType(state, 'guard');
    return;
  }

  if (input.consumePress('Digit3')) {
    selectShardType(state, 'pommel');
    return;
  }

  if (input.consumePress('KeyA')) {
    moveCraftCursor(state, -1, 0);
    return;
  }

  if (input.consumePress('KeyD')) {
    moveCraftCursor(state, 1, 0);
    return;
  }

  if (input.consumePress('KeyW')) {
    moveCraftCursor(state, 0, -1);
    return;
  }

  if (input.consumePress('KeyS')) {
    moveCraftCursor(state, 0, 1);
    return;
  }

  if (input.consumePress('Enter') || input.consumePress('Space')) {
    placeSelectedShard(state);
    return;
  }

  if (input.consumePress('Backspace')) {
    undoPlacedShard(state);
    return;
  }

  if (input.consumePress('KeyC')) {
    confirmShardSword(state);
    return;
  }

  if (input.consumePress('KeyM')) {
    mergeNewestSwords(state);
  }
}

function placeShardFromShortcut(state, input) {
  const shortcuts = [
    ['KeyB', 'blade'],
    ['KeyG', 'guard'],
    ['KeyP', 'pommel']
  ];

  for (const [key, type] of shortcuts) {
    if (input.consumePress(key)) {
      selectShardType(state, type);
      placeSelectedShard(state);
      return true;
    }
  }

  return false;
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
