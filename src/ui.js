import { getSelectedPants, getSelectedTop, pantsOptions, topOptions } from './outfit.js';
import { getForgePrompt, getForgeState, getSwordBonus, isNearForge } from './progression.js';
import {
  describeSword,
  getAvailableShardCount,
  getEquippedSword,
  renderCraftBoard
} from './swordcraft.js';

export function renderHud(state) {
  const hud = document.querySelector('#hud');
  let markup = '';

  if (state.mode === 'customize') {
    markup = renderOutfitPicker(state);
  } else {
    const forgeState = getForgeState(state);
    const forgeText = isNearForge(state)
      ? getForgePrompt(state)
      : 'Visit the forge to craft with shards or combine swords.';
    const healthRatio = state.player.maxHealth > 0
      ? state.player.health / state.player.maxHealth
      : 0;
    const healthPercent = Math.max(healthRatio, 0) * 100;

    const equippedSword = getEquippedSword(state);
    const ownedSwords = state.inventory.swords
      .map((sword) => sword.id === equippedSword.id ? `${sword.name} equipped` : sword.name)
      .join(' | ');
    const spinReady = state.timers.spinCooldown <= 0;
    const spinLabel = spinReady
      ? 'Spin Attack'
      : `Spin Cooldown ${state.timers.spinCooldown.toFixed(1)}s`;
    const spinDisabledClass = spinReady ? '' : ' is-disabled';

    const forgePanel = state.ui.forgeOpen
      ? `
        <div class="hud-panel">
          <h2 class="hud-title">Forge</h2>
          <p class="hud-help">1 blade, 2 guard, 3 pommel</p>
          <p class="hud-help">Move cursor with WASD or arrows. Enter places a shard.</p>
          <div class="craft-board">${renderCraftBoard(state)}</div>
          <p class="hud-help">Selected: ${state.forge.board.selectedType}</p>
          <p class="hud-help">
            Left: blade ${getAvailableShardCount(state, 'blade')},
            guard ${getAvailableShardCount(state, 'guard')},
            pommel ${getAvailableShardCount(state, 'pommel')}
          </p>
          <p class="hud-help">C confirms the layout. Backspace removes the last shard.</p>
          <p class="hud-help">${forgeState.canCraft ? 'Ready to form a sword.' : 'Place one of each shard type.'}</p>
          <p class="hud-help">M: Merge the two newest shard swords</p>
          <p class="hud-help">${
            forgeState.canCombine
              ? 'Ready to merge.'
              : 'Need two crafted shard swords.'
          }</p>
          <p class="hud-help">E or Esc: Close forge</p>
        </div>
      `
      : '';

    markup = `
      <h1 class="hud-title">JKL Block Arena</h1>
      <div class="hud-section">
        <span class="hud-label">Health Bar</span>
        <div class="hud-health-bar" aria-label="Player health">
          <div class="hud-health-fill" style="width: ${healthPercent}%"></div>
        </div>
        <div class="hud-health-text">${state.player.health} / ${state.player.maxHealth}</div>
      </div>
      <div class="hud-grid">
        <div class="hud-card">
          <span class="hud-label">Player Level</span>
          <span class="hud-value">${state.player.level}</span>
        </div>
        <div class="hud-card">
          <span class="hud-label">Sword</span>
          <span class="hud-value">${equippedSword.isStarter ? 'Starter' : 'Custom'}</span>
        </div>
        <div class="hud-card">
          <span class="hud-label">Wave</span>
          <span class="hud-value">${state.wave}</span>
        </div>
        <div class="hud-card">
          <span class="hud-label">Wave Health</span>
          <span class="hud-value">x1.25 each clear</span>
        </div>
      </div>
      <div class="hud-section hud-help">
        Controls: J turns right, L turns left, K moves forward, Space thrusts forward, E uses the forge.
      </div>
      <div class="hud-action-row">
        <button
          class="hud-action-button${spinDisabledClass}"
          type="button"
          data-action="spin-attack"
          aria-disabled="${spinReady ? 'false' : 'true'}"
        >${spinLabel}</button>
      </div>
      <div class="hud-section hud-help">
        Damage: ${state.player.baseDamage} base + ${getSwordBonus(state)} sword
      </div>
      <div class="hud-section hud-help">
        Shards: blade ${state.inventory.blade}, guard ${state.inventory.guard}, pommel ${state.inventory.pommel}
      </div>
      <div class="hud-section hud-swords">
        Swords owned: ${ownedSwords || 'none'}
      </div>
      <div class="hud-section hud-swords">
        Equipped: ${equippedSword.name} (${describeSword(equippedSword)})
      </div>
      <div class="hud-note">${forgeText}</div>
      <div class="hud-note">${state.ui.message}</div>
      ${forgePanel}
    `;
  }

  if (hud.innerHTML !== markup) {
    hud.innerHTML = markup;
  }
}

function renderOutfitPicker(state) {
  const selectedTop = getSelectedTop(state);
  const selectedPants = getSelectedPants(state);
  const topButtons = topOptions
    .map((option, index) => createOptionButton(
      option.name,
      `background: linear-gradient(135deg, ${option.primary} 0%, ${option.trim} 100%);`,
      index === state.player.outfit.topIndex,
      'top-index',
      index
    ))
    .join('');
  const pantsButtons = pantsOptions
    .map((option, index) => createOptionButton(
      option.name,
      `background: ${option.color};`,
      index === state.player.outfit.pantsIndex,
      'pants-index',
      index
    ))
    .join('');

  return `
    <h1 class="hud-title">Choose Your Outfit</h1>
    <div class="hud-section hud-help">
      Pick one shirt and one pair of pants before the game starts.
    </div>
    <div class="hud-section">
      <span class="hud-label">Clothes</span>
      <div class="hud-option-grid">${topButtons}</div>
    </div>
    <div class="hud-section">
      <span class="hud-label">Pants</span>
      <div class="hud-option-grid">${pantsButtons}</div>
    </div>
    <div class="hud-note">Top: ${selectedTop.name} | Pants: ${selectedPants.name}</div>
    <button class="hud-start-button" type="button" data-action="start-game">Start Game</button>
  `;
}

function createOptionButton(label, swatchStyle, selected, dataName, value) {
  const selectedClass = selected ? ' is-selected' : '';

  return `
    <button class="hud-option-button${selectedClass}" type="button" data-${dataName}="${value}">
      <span class="hud-option-swatch" style="${swatchStyle}"></span>
      <span>${label}</span>
    </button>
  `;
}
