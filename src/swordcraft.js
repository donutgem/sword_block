import * as THREE from 'three';

const shardTypes = ['blade', 'guard', 'pommel'];
const boardWidth = 7;
const boardHeight = 5;
const advancedShardCraftLevel = 15;

export function createStarterSword() {
  return {
    id: 'starter',
    name: 'Starter Sword',
    kind: 'sword',
    components: ['blade', 'guard', 'pommel'],
    isStarter: true,
    stats: {
      damageBonus: 4,
      bladeLength: 1.9,
      bladeAngle: 0,
      guardWidth: 0.78,
      guardAngle: 0,
      handleLength: 0.9,
      handleAngle: 0,
      pommelSize: 0.13
    }
  };
}

export function createCraftingBoard() {
  return {
    cursor: { x: 3, y: 2 },
    selectedType: 'blade',
    placed: []
  };
}

export function getEquippedSword(state) {
  return state.inventory.swords.find((sword) => sword.id === state.player.equippedSwordId)
    || state.inventory.swords[0]
    || createStarterSword();
}

export function equipSword(state, swordId) {
  const sword = state.inventory.swords.find((candidate) => candidate.id === swordId);

  if (!sword) {
    return false;
  }

  state.player.equippedSwordId = sword.id;
  state.player.swordVersion += 1;
  setCraftMessage(state, `${sword.name} equipped.`, 2);
  return true;
}

export function getSwordDamageBonus(state) {
  return Math.round(getEquippedSword(state).stats.damageBonus);
}

export function getSwordBladeLength(state) {
  return getEquippedSword(state).stats.bladeLength;
}

export function getAvailableShardCount(state, type) {
  const placedCount = state.forge.board.placed
    .filter((shard) => shard.type === type)
    .length;

  return Math.max(state.inventory[type] - placedCount, 0);
}

export function selectShardType(state, type) {
  if (!shardTypes.includes(type)) {
    return;
  }

  state.forge.board.selectedType = type;
  setCraftMessage(state, `Selected ${type} shards.`, 1.5);
}

export function moveCraftCursor(state, dx, dy) {
  const cursor = state.forge.board.cursor;
  cursor.x = THREE.MathUtils.clamp(cursor.x + dx, 0, boardWidth - 1);
  cursor.y = THREE.MathUtils.clamp(cursor.y + dy, 0, boardHeight - 1);
}

export function placeSelectedShard(state) {
  const type = state.forge.board.selectedType;
  const cursor = state.forge.board.cursor;

  if (getAvailableShardCount(state, type) <= 0) {
    setCraftMessage(state, `No ${type} shards left to place.`, 2);
    return false;
  }

  if (isCraftCellOccupied(state.forge.board, cursor.x, cursor.y)) {
    setCraftMessage(state, 'That square already has a shard. Move to an empty square.', 2);
    return false;
  }

  state.forge.board.placed.push({ type, x: cursor.x, y: cursor.y });
  setCraftMessage(state, `Placed a ${type} shard.`, 1.5);
  return true;
}

export function undoPlacedShard(state) {
  if (state.forge.board.placed.length === 0) {
    setCraftMessage(state, 'No placed shards to remove.', 2);
    return false;
  }

  const shard = state.forge.board.placed.pop();
  setCraftMessage(state, `Removed a ${shard.type} shard.`, 1.5);
  return true;
}

export function canConfirmSword(state) {
  return getCraftBlockReason(state) === '';
}

export function getCraftStatusText(state) {
  const blockReason = getCraftBlockReason(state);

  if (blockReason) {
    return blockReason;
  }

  return 'Ready to form a weapon.';
}

export function confirmShardSword(state) {
  const blockReason = getCraftBlockReason(state);

  if (blockReason) {
    setCraftMessage(state, blockReason, 3);
    return false;
  }

  for (const shard of state.forge.board.placed) {
    state.inventory[shard.type] -= 1;
  }

  const sword = createSwordFromLayout(state);
  removeStarterSword(state);
  state.inventory.swords.push(sword);
  state.player.equippedSwordId = sword.id;
  state.player.swordVersion += 1;
  state.forge.board = createCraftingBoard();

  setCraftMessage(state, `${sword.name} formed from your shard layout.`, 4);
  return true;
}

export function canMergeNewestSwords(state) {
  return getMergeCandidates(state).length >= 2;
}

export function mergeNewestSwords(state) {
  const candidates = getMergeCandidates(state);

  if (candidates.length < 2) {
    setCraftMessage(state, 'Craft two shard weapons before merging.', 3);
    return false;
  }

  const second = candidates[candidates.length - 1];
  const first = candidates[candidates.length - 2];
  const merged = createMergedSword(state, first, second);
  state.inventory.swords = state.inventory.swords
    .filter((sword) => sword.id !== first.id && sword.id !== second.id);
  state.inventory.swords.push(merged);
  state.player.equippedSwordId = merged.id;
  state.player.swordVersion += 1;

  setCraftMessage(state, `Merged ${first.name} and ${second.name} into ${merged.name}.`, 4);
  return true;
}

export function renderCraftBoard(state) {
  const board = state.forge.board;
  const cells = [];

  for (let y = 0; y < boardHeight; y += 1) {
    for (let x = 0; x < boardWidth; x += 1) {
      const shards = board.placed.filter((shard) => shard.x === x && shard.y === y);
      const cursorClass = board.cursor.x === x && board.cursor.y === y ? ' is-cursor' : '';
      const content = shards.map((shard) => shard.type[0].toUpperCase()).join('');
      cells.push(`<span class="craft-cell${cursorClass}">${content}</span>`);
    }
  }

  return cells.join('');
}

export function describeSword(sword) {
  const stats = sword.stats;
  return `${getWeaponKindLabel(sword)}: ${stats.bladeLength.toFixed(1)} reach, ${Math.round(stats.damageBonus)} bonus`;
}

function createSwordFromLayout(state) {
  const placed = state.forge.board.placed.map((shard) => ({ ...shard }));
  const stats = buildStatsFromLayout(placed);
  const components = getUsedShardTypes(placed);

  return {
    id: `sword-${state.nextIds.sword++}`,
    name: `${getWeaponName(components)} ${state.nextIds.sword - 1}`,
    kind: components.length === 3 ? 'sword' : 'custom',
    components,
    isStarter: false,
    layout: placed,
    stats
  };
}

function createMergedSword(state, first, second) {
  const components = mergeComponents(first.components, second.components);

  return {
    id: `sword-${state.nextIds.sword++}`,
    name: `Merged Sword ${state.nextIds.sword - 1}`,
    kind: 'merged',
    components,
    isStarter: false,
    layout: [],
    stats: {
      damageBonus: first.stats.damageBonus + second.stats.damageBonus * 0.8,
      bladeLength: mergeSize(first.stats.bladeLength, second.stats.bladeLength, 0.75),
      bladeAngle: getAttackReadyAngle(
        averageAngle(first.stats.bladeAngle, second.stats.bladeAngle),
        components
      ),
      guardWidth: mergeSize(first.stats.guardWidth, second.stats.guardWidth, 0.65),
      guardAngle: getAttackReadyAngle(
        averageAngle(first.stats.guardAngle, second.stats.guardAngle),
        components
      ),
      handleLength: mergeSize(first.stats.handleLength, second.stats.handleLength, 0.55),
      handleAngle: getAttackReadyAngle(
        averageAngle(first.stats.handleAngle, second.stats.handleAngle),
        components
      ),
      pommelSize: mergeSize(first.stats.pommelSize, second.stats.pommelSize, 0.45)
    }
  };
}

function buildStatsFromLayout(layout) {
  const blade = analyzePart(layout, 'blade');
  const guard = analyzePart(layout, 'guard');
  const pommel = analyzePart(layout, 'pommel');
  const components = getUsedShardTypes(layout);
  const bladeDropAngle = getBladeDropAngle(blade.count);
  const isBladeOnly = components.length === 1 && components[0] === 'blade';
  const isGuardOnly = components.length === 1 && components[0] === 'guard';
  const isPommelOnly = components.length === 1 && components[0] === 'pommel';

  const bladeAngle = THREE.MathUtils.clamp(blade.angle - bladeDropAngle, -0.8, 0.8);

  return {
    damageBonus: 3 + blade.count * 2 + guard.count * 1.5 + pommel.count * 1.7,
    bladeLength: getWeaponReach(blade, guard, pommel, {
      isBladeOnly,
      isGuardOnly,
      isPommelOnly
    }),
    bladeAngle: getAttackReadyAngle(bladeAngle, components),
    guardWidth: 0.45 + guard.count * 0.1 + guard.span * 0.16,
    guardAngle: getAttackReadyAngle(guard.angle, components),
    handleLength: 0.55 + guard.count * 0.06 + pommel.count * 0.08,
    handleAngle: getAttackReadyAngle(averageAngle(guard.angle, pommel.angle), components),
    pommelSize: 0.12 + pommel.count * 0.035 + pommel.span * 0.025
  };
}

function getAttackReadyAngle(angle, components) {
  if (components.length === shardTypes.length) {
    return THREE.MathUtils.clamp(angle, -0.18, 0.18);
  }

  return angle;
}

function getUsedShardTypes(layout) {
  return shardTypes.filter((type) => layout.some((shard) => shard.type === type));
}

function getCraftBlockReason(state) {
  const placed = state.forge.board.placed;

  if (placed.length === 0) {
    return 'Place at least 1 shard before crafting.';
  }

  if (getUsedShardTypes(placed).length < shardTypes.length && state.player.level < advancedShardCraftLevel) {
    return `One-type and two-type weapons unlock at level ${advancedShardCraftLevel}.`;
  }

  return '';
}

function isCraftCellOccupied(board, x, y) {
  return board.placed.some((shard) => shard.x === x && shard.y === y);
}

function getWeaponName(components) {
  if (components.length === 1) {
    return getComponentWeaponName(components[0]);
  }

  if (components.length === 2) {
    return components.map(getComponentWeaponName).join(' + ');
  }

  return 'Shard Sword';
}

function getWeaponKindLabel(sword) {
  if (sword.components?.length > 0) {
    return getWeaponName(sword.components);
  }

  return sword.name;
}

function getComponentWeaponName(type) {
  if (type === 'blade') {
    return 'Ninja Star';
  }

  if (type === 'guard') {
    return 'Staff';
  }

  return 'Weighted Balls';
}

function getWeaponReach(blade, guard, pommel, flags) {
  if (flags.isBladeOnly) {
    return 1.15 + blade.count * 0.08 + blade.span * 0.1;
  }

  if (flags.isGuardOnly) {
    return 2.1 + guard.count * 0.18 + guard.span * 0.16;
  }

  if (flags.isPommelOnly) {
    return 1.45 + pommel.count * 0.12 + pommel.span * 0.12;
  }

  return 1 + blade.count * 0.18 + guard.count * 0.12 + pommel.count * 0.1
    + (blade.span + guard.span + pommel.span) * 0.08;
}

function mergeComponents(firstComponents = [], secondComponents = []) {
  return shardTypes.filter((type) =>
    firstComponents.includes(type) || secondComponents.includes(type)
  );
}

function getBladeDropAngle(bladeShardCount) {
  const longBladeShards = Math.max(bladeShardCount - 4, 0);
  return THREE.MathUtils.degToRad(Math.min(longBladeShards * 2, 6));
}

function analyzePart(layout, type) {
  const shards = layout.filter((shard) => shard.type === type);

  if (shards.length === 0) {
    return { count: 0, span: 0, angle: 0 };
  }

  const minX = Math.min(...shards.map((shard) => shard.x));
  const maxX = Math.max(...shards.map((shard) => shard.x));
  const minY = Math.min(...shards.map((shard) => shard.y));
  const maxY = Math.max(...shards.map((shard) => shard.y));
  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const angle = Math.atan2(spanY, Math.max(spanX, 0.25)) * (minY < 2 ? 1 : -1);

  return {
    count: shards.length,
    span: Math.hypot(spanX, spanY),
    angle: THREE.MathUtils.clamp(angle, -0.8, 0.8)
  };
}

function averageAngle(a, b) {
  return Math.atan2(Math.sin(a) + Math.sin(b), Math.cos(a) + Math.cos(b));
}

function mergeSize(a, b, scale) {
  return (a + b) * scale;
}

function removeStarterSword(state) {
  const hadStarterSword = state.inventory.swords.some((sword) => sword.isStarter);
  state.inventory.swords = state.inventory.swords.filter((sword) => !sword.isStarter);
  return hadStarterSword;
}

function getMergeCandidates(state) {
  return state.inventory.swords.filter((sword) => !sword.isStarter);
}

function setCraftMessage(state, text, duration) {
  state.ui.message = text;
  state.ui.messageTimer = duration;
}
