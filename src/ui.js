import { getForgePrompt, getForgeState, getSwordBonus, isNearForge } from './progression.js';

export function renderHud(state) {
  const hud = document.querySelector('#hud');
  const forgeState = getForgeState(state);
  const forgeText = isNearForge(state)
    ? getForgePrompt(state)
    : 'Visit the forge to craft with shards or combine swords.';

  const ownedSwords = Object.entries(state.inventory.swordsByLevel)
    .filter(([, count]) => count > 0)
    .map(([level, count]) => `L${level}: ${count}`)
    .join(' | ');

  const forgePanel = state.ui.forgeOpen
    ? `
      <div class="hud-panel">
        <h2 class="hud-title">Forge</h2>
        <p class="hud-help">1: Craft a level 1 sword</p>
        <p class="hud-help">Needs: blade 1, guard 1, pommel 1</p>
        <p class="hud-help">${forgeState.canCraft ? 'Ready to craft.' : 'Not enough shards yet.'}</p>
        <p class="hud-help">2: Combine matching swords</p>
        <p class="hud-help">${
          forgeState.canCombine
            ? `Ready to combine two level ${forgeState.combineLevel} swords.`
            : 'Need two swords of the same level.'
        }</p>
        <p class="hud-help">E or Esc: Close forge</p>
      </div>
    `
    : '';

  hud.innerHTML = `
    <h1 class="hud-title">JKL Block Arena</h1>
    <div class="hud-grid">
      <div class="hud-card">
        <span class="hud-label">Health</span>
        <span class="hud-value">${state.player.health} / ${state.player.maxHealth}</span>
      </div>
      <div class="hud-card">
        <span class="hud-label">Player Level</span>
        <span class="hud-value">${state.player.level}</span>
      </div>
      <div class="hud-card">
        <span class="hud-label">Sword Level</span>
        <span class="hud-value">${state.player.swordLevel}</span>
      </div>
      <div class="hud-card">
        <span class="hud-label">Wave</span>
        <span class="hud-value">${state.wave}</span>
      </div>
    </div>
    <div class="hud-section hud-help">
      Controls: J turns right, L turns left, K moves forward, Space thrusts forward, E uses the forge.
    </div>
    <div class="hud-section hud-help">
      Damage: ${state.player.baseDamage} base + ${getSwordBonus(state.player.swordLevel)} sword
    </div>
    <div class="hud-section hud-help">
      Shards: blade ${state.inventory.blade}, guard ${state.inventory.guard}, pommel ${state.inventory.pommel}
    </div>
    <div class="hud-section hud-swords">
      Swords owned: ${ownedSwords || 'none'}
    </div>
    <div class="hud-note">${forgeText}</div>
    <div class="hud-note">${state.ui.message}</div>
    ${forgePanel}
  `;
}
