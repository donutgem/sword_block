import { getSelectedHair, hairOptions } from './hair.js';
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

  if (hud.contains(document.activeElement)
    && document.activeElement.dataset.input === 'player-name') {
    return;
  }

  if (!state.ui.menuOpen) {
    const markup = renderCollapsedMenu(state);

    if (hud.innerHTML !== markup) {
      hud.innerHTML = markup;
    }

    return;
  }

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
    const weaponSwitcher = renderWeaponSwitcher(state, equippedSword);
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
          <p class="hud-help">Before level 15, use blade, guard, and pommel together.</p>
          <p class="hud-help">Level 15 unlocks one-type and two-type shard weapons.</p>
          <p class="hud-help">Move cursor with WASD. Enter places a shard.</p>
          <div class="craft-board">${renderCraftBoard(state)}</div>
          <p class="hud-help">Selected: ${state.forge.board.selectedType}</p>
          <p class="hud-help">
            Left: blade ${getAvailableShardCount(state, 'blade')},
            guard ${getAvailableShardCount(state, 'guard')},
            pommel ${getAvailableShardCount(state, 'pommel')}
          </p>
          <p class="hud-help">C confirms the layout. Backspace removes the last shard.</p>
          <p class="hud-help">${forgeState.craftStatusText}</p>
          <p class="hud-help">M: Merge the two newest crafted weapons</p>
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
      ${renderMenuHeader('JKL Block Arena')}
      <div class="hud-section hud-health-section">
        <span class="hud-label">Health</span>
        <div
          class="hud-health-circle"
          style="--health-percent: ${healthPercent}%"
          aria-label="Player health"
        >
          <div class="hud-health-center">
            <span class="hud-health-number">${state.player.health}</span>
            <span class="hud-health-total">/ ${state.player.maxHealth}</span>
          </div>
        </div>
      </div>
      <div class="hud-grid">
        <div class="hud-card">
          <span class="hud-label">Player Level</span>
          <span class="hud-value">${state.player.level}</span>
        </div>
        <div class="hud-card">
          <span class="hud-label">Weapon</span>
          <span class="hud-value">${equippedSword.isStarter ? 'Starter' : 'Custom'}</span>
        </div>
        <div class="hud-card">
          <span class="hud-label">Wave</span>
          <span class="hud-value">${state.wave}</span>
        </div>
        <div class="hud-card hud-spin-card">
          <button
            class="hud-action-button${spinDisabledClass}"
            type="button"
            data-action="spin-attack"
            aria-disabled="${spinReady ? 'false' : 'true'}"
          >${spinLabel}</button>
        </div>
      </div>
      <div class="hud-section hud-help">
        Controls: J/L turn, K moves forward, Space attacks, E uses the forge.
      </div>
      <div class="hud-section hud-help">
        The Starter Sword is available until you craft a new weapon. All crafted weapons are stronger than it.
      </div>
      <div class="hud-section hud-help">
        Damage: ${state.player.baseDamage} base + ${getSwordBonus(state)} weapon
      </div>
      <div class="hud-section hud-help">
        Shards: blade ${state.inventory.blade}, guard ${state.inventory.guard}, pommel ${state.inventory.pommel}
      </div>
      ${weaponSwitcher}
      <div class="hud-note">${forgeText}</div>
      ${renderNotification(state)}
      ${renderLeaderboard(state)}
      ${forgePanel}
    `;
  }

  if (hud.innerHTML !== markup) {
    hud.innerHTML = markup;
  }
}

function renderNotification(state) {
  const messageClass = getNotificationClass(state.ui.messageTimer);

  return `
    <div class="hud-note hud-notification ${messageClass}">
      ${escapeHtml(state.ui.message)}
    </div>
  `;
}

function getNotificationClass(messageTimer) {
  if (messageTimer <= 0) {
    return 'is-hidden';
  }

  if (messageTimer <= 0.35) {
    return 'is-leaving';
  }

  return 'is-visible';
}

function renderMenuHeader(title) {
  return `
    <div class="hud-menu-header">
      <h1 class="hud-title">${title}</h1>
      <button class="hud-small-button" type="button" data-action="toggle-menu">
        Hide Menu
      </button>
    </div>
  `;
}

function renderCollapsedMenu(state) {
  const title = state.mode === 'customize' ? 'Outfit Menu' : 'Game Menu';

  return `
    <div class="hud-menu-header hud-menu-header-collapsed">
      <div>
        <h1 class="hud-title">${title}</h1>
        <p class="hud-help">${escapeHtml(state.ui.message)}</p>
      </div>
      <button class="hud-small-button" type="button" data-action="toggle-menu">
        Show Menu
      </button>
    </div>
  `;
}

function renderWeaponSwitcher(state, equippedSword) {
  const toggleLabel = state.ui.weaponsOpen ? 'Hide Weapons' : 'Show Weapons';
  const listMarkup = state.ui.weaponsOpen
    ? `<div class="hud-weapon-list">${renderWeaponButtons(state, equippedSword)}</div>`
    : '';

  return `
    <div class="hud-section hud-swords">
      <div class="hud-weapon-header">
        <div>
          <span class="hud-label">Switch Weapon</span>
          <strong>${escapeHtml(equippedSword.name)}</strong>
        </div>
        <button class="hud-small-button" type="button" data-action="toggle-weapons">
          ${toggleLabel}
        </button>
      </div>
      ${listMarkup}
    </div>
  `;
}

function renderWeaponButtons(state, equippedSword) {
  return state.inventory.swords
    .map((sword) => {
      const selectedClass = sword.id === equippedSword.id ? ' is-selected' : '';
      const equippedLabel = sword.id === equippedSword.id ? 'Equipped' : 'Equip';

      return `
        <button
          class="hud-weapon-button${selectedClass}"
          type="button"
          data-weapon-id="${escapeHtml(sword.id)}"
        >
          <span>${escapeHtml(sword.name)}</span>
          <small>${escapeHtml(describeSword(sword))}</small>
          <strong>${equippedLabel}</strong>
        </button>
      `;
    })
    .join('');
}

function renderOutfitPicker(state) {
  const selectedTop = getSelectedTop(state);
  const selectedPants = getSelectedPants(state);
  const selectedHair = getSelectedHair(state);
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
  const hairButtons = hairOptions
    .map((option, index) => createOptionButton(
      option.name,
      `background: ${option.swatch};`,
      index === state.player.outfit.hairIndex,
      'hair-index',
      index
    ))
    .join('');

  return `
    ${renderMenuHeader('Choose Your Outfit')}
    <div class="hud-section hud-help">
      Pick clothes and a hairstyle before the game starts.
    </div>
    <div class="hud-section">
      <span class="hud-label">Clothes</span>
      <div class="hud-option-grid">${topButtons}</div>
    </div>
    <div class="hud-section">
      <span class="hud-label">Pants</span>
      <div class="hud-option-grid">${pantsButtons}</div>
    </div>
    <div class="hud-section">
      <span class="hud-label">Hair</span>
      <div class="hud-option-grid">${hairButtons}</div>
    </div>
    <div class="hud-note">Top: ${selectedTop.name} | Pants: ${selectedPants.name} | Hair: ${selectedHair.name}</div>
    <button class="hud-start-button" type="button" data-action="start-game">Start Game</button>
    ${renderLeaderboard(state)}
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

function renderLeaderboard(state) {
  const leaderboard = state.leaderboard;
  let content = '<p class="hud-help">Loading scores...</p>';

  if (leaderboard.status === 'unavailable') {
    content = '<p class="hud-help">Leaderboard available in the published game.</p>';
  } else if (leaderboard.entries.length > 0) {
    const rows = leaderboard.entries
      .slice(0, 10)
      .map((entry) => `
        <li class="leaderboard-row">
          <span>${entry.rank}. ${escapeHtml(entry.playerName)}</span>
          <strong>${escapeHtml(entry.displayScore || `${entry.score} blocks`)}</strong>
        </li>
      `)
      .join('');

    content = `<ol class="leaderboard-list">${rows}</ol>`;
  } else if (leaderboard.status === 'ready') {
    content = '<p class="hud-help">Be the first to clear a wave.</p>';
  }

  const rankText = leaderboard.rank
    ? `<p class="hud-help">Your best rank: #${leaderboard.rank}</p>`
    : '';

  return `
    <section class="hud-panel leaderboard-panel">
      <h2 class="hud-title">Top 10 Blocks</h2>
      <label class="hud-name-field">
        <span class="hud-label">Name</span>
        <input
          class="hud-name-input"
          type="text"
          maxlength="20"
          data-input="player-name"
          placeholder="Type your name"
          value="${escapeHtml(state.leaderboard.playerName)}"
        />
      </label>
      ${content}
      ${rankText}
    </section>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
