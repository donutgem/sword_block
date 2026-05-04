import * as THREE from 'three';

const shardTypes = ['blade', 'guard', 'pommel'];
const boardWidth = 7;
const boardHeight = 5;

export function createStarterSword() {
  return {
    id: 'starter',
    name: 'Starter Sword',
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

  if (getAvailableShardCount(state, type) <= 0) {
    setCraftMessage(state, `No ${type} shards left to place.`, 2);
    return false;
  }

  const cursor = state.forge.board.cursor;
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
  return shardTypes.every((type) =>
    state.forge.board.placed.some((shard) => shard.type === type)
  );
}

export function confirmShardSword(state) {
  if (!canConfirmSword(state)) {
    setCraftMessage(state, 'Place at least 1 blade, 1 guard, and 1 pommel shard.', 3);
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
    setCraftMessage(state, 'Craft two shard swords before merging.', 3);
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
  return `${stats.bladeLength.toFixed(1)} reach, ${Math.round(stats.damageBonus)} bonus`;
}

function createSwordFromLayout(state) {
  const placed = state.forge.board.placed.map((shard) => ({ ...shard }));
  const stats = buildStatsFromLayout(placed);

  return {
    id: `sword-${state.nextIds.sword++}`,
    name: `Shard Sword ${state.nextIds.sword - 1}`,
    isStarter: false,
    layout: placed,
    stats
  };
}

function createMergedSword(state, first, second) {
  return {
    id: `sword-${state.nextIds.sword++}`,
    name: `Merged Sword ${state.nextIds.sword - 1}`,
    isStarter: false,
    layout: [],
    stats: {
      damageBonus: first.stats.damageBonus + second.stats.damageBonus * 0.8,
      bladeLength: mergeSize(first.stats.bladeLength, second.stats.bladeLength, 0.75),
      bladeAngle: averageAngle(first.stats.bladeAngle, second.stats.bladeAngle),
      guardWidth: mergeSize(first.stats.guardWidth, second.stats.guardWidth, 0.65),
      guardAngle: averageAngle(first.stats.guardAngle, second.stats.guardAngle),
      handleLength: mergeSize(first.stats.handleLength, second.stats.handleLength, 0.55),
      handleAngle: averageAngle(first.stats.handleAngle, second.stats.handleAngle),
      pommelSize: mergeSize(first.stats.pommelSize, second.stats.pommelSize, 0.45)
    }
  };
}

function buildStatsFromLayout(layout) {
  const blade = analyzePart(layout, 'blade');
  const guard = analyzePart(layout, 'guard');
  const pommel = analyzePart(layout, 'pommel');
  const bladeDropAngle = getBladeDropAngle(blade.count);

  return {
    damageBonus: 3 + blade.count * 2 + guard.count + pommel.count,
    bladeLength: 0.9 + blade.count * 0.22 + blade.span * 0.18,
    bladeAngle: THREE.MathUtils.clamp(blade.angle - bladeDropAngle, -0.8, 0.8),
    guardWidth: 0.45 + guard.count * 0.1 + guard.span * 0.16,
    guardAngle: guard.angle,
    handleLength: 0.55 + guard.count * 0.06 + pommel.count * 0.08,
    handleAngle: averageAngle(guard.angle, pommel.angle),
    pommelSize: 0.12 + pommel.count * 0.035 + pommel.span * 0.025
  };
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
  state.inventory.swords = state.inventory.swords.filter((sword) => !sword.isStarter);
}

function getMergeCandidates(state) {
  return state.inventory.swords.filter((sword) => !sword.isStarter);
}

function setCraftMessage(state, text, duration) {
  state.ui.message = text;
  state.ui.messageTimer = duration;
}
