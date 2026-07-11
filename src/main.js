import './style.css';
import {
  applyContactDamage,
  performAttack,
  performSpinAttack,
  updateProjectiles
} from './combat.js';
import { allEnemiesDefeated, spawnWave, updateEnemyVisuals } from './enemies.js';
import { createInput } from './input.js';
import { setHairOption, syncPlayerHair } from './hair.js';
import { getWeeklyCheatCode } from './cheatcode.js';
import { loadLeaderboard, submitWaveScore } from './leaderboard.js';
import { syncStickmanMovies } from './stickmanMovies.js';
import {
  setPantsOption,
  setTopOption,
  startGameWithOutfit,
  syncPlayerOutfit
} from './outfit.js';
import { createPlayer, syncSwordLevel, updatePlayer, syncPlayerOutfitTransform } from './player.js';
import {
  closeForge,
  handleForgeInput,
  isNearForge,
  openForge,
  updatePickups
} from './progression.js';
import { createSceneApp, updateCamera } from './scene.js';
import { createGameState, setMessage } from './state.js';
import { equipSword } from './swordcraft.js';
import { renderHud } from './ui.js';

const state = createGameState();
const appRoot = document.querySelector('#app');
const hud = document.querySelector('#hud');
const { scene, camera, renderer } = createSceneApp(state);
const player = createPlayer(state);
const input = createInput();

appRoot.append(renderer.domElement);
scene.add(player);
spawnWave(scene, state, 1);
renderHud(state);
syncStickmanMovies(hud);
loadLeaderboard(state);
hud.addEventListener('input', (event) => {
  if (event.target.dataset.input === 'player-name') {
    state.leaderboard.playerName = event.target.value.slice(0, 20);
    event.target.value = state.leaderboard.playerName;
    event.target.setAttribute('value', state.leaderboard.playerName);
  }
});
hud.addEventListener('pointerdown', (event) => {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  event.preventDefault();

  if (button.dataset.topIndex !== undefined) {
    setTopOption(state, Number(button.dataset.topIndex));
    syncPlayerOutfit(state);
    renderHud(state);
    return;
  }

  if (button.dataset.pantsIndex !== undefined) {
    setPantsOption(state, Number(button.dataset.pantsIndex));
    syncPlayerOutfit(state);
    renderHud(state);
    return;
  }

  if (button.dataset.hairIndex !== undefined) {
    setHairOption(state, Number(button.dataset.hairIndex));
    syncPlayerHair(state);
    renderHud(state);
    return;
  }

  if (button.dataset.stickmanId !== undefined && state.mode === 'customize') {
    state.ui.selectedStickman = button.dataset.stickmanId;
    renderHud(state);
    return;
  }

  if (button.dataset.action === 'close-stickman') {
    state.ui.selectedStickman = null;
    renderHud(state);
    return;
  }

  if (button.dataset.weaponId !== undefined) {
    if (equipSword(state, button.dataset.weaponId)) {
      syncSwordLevel(state);
      renderHud(state);
    }

    return;
  }

  if (button.dataset.action === 'start-game') {
    startGameWithOutfit(state);
    renderHud(state);
    return;
  }

  if (button.dataset.action === 'toggle-weapons') {
    state.ui.weaponsOpen = !state.ui.weaponsOpen;
    renderHud(state);
    return;
  }

  if (button.dataset.action === 'toggle-menu') {
    state.ui.menuOpen = !state.ui.menuOpen;
    renderHud(state);
    return;
  }

  if (button.dataset.action === 'spin-attack' && state.mode === 'playing') {
    if (!performSpinAttack(state, scene) && state.timers.spinCooldown > 0) {
      setMessage(state, `Spin attack is recharging for ${state.timers.spinCooldown.toFixed(1)} more seconds.`, 2);
    }

    renderHud(state);
  }
});

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

let previousTime = 0;

renderer.setAnimationLoop((time) => {
  const elapsedTime = time * 0.001;
  const delta = Math.min(Math.max(elapsedTime - previousTime, 0.001), 0.05);
  previousTime = elapsedTime;

  state.timers.attackCooldown = Math.max(state.timers.attackCooldown - delta, 0);
  state.timers.attackAnimation = Math.max(state.timers.attackAnimation - delta, 0);
  state.timers.spinCooldown = Math.max(state.timers.spinCooldown - delta, 0);
  state.timers.spinAnimation = Math.max(state.timers.spinAnimation - delta, 0);

  if (state.ui.messageTimer > 0) {
    state.ui.messageTimer = Math.max(state.ui.messageTimer - delta, 0);
  }

  if (state.mode === 'playing') {
    updatePlayer(delta, input, state);
  } else if (state.mode === 'customize') {
    if (input.isDown('KeyJ')) {
      state.player.rotationY += state.player.turnSpeed * delta;
    }

    if (input.isDown('KeyL')) {
      state.player.rotationY -= state.player.turnSpeed * delta;
    }

    if (input.isDown('ArrowUp')) {
      state.player.rotationX += state.player.turnSpeed * delta;
    }

    if (input.isDown('ArrowDown')) {
      state.player.rotationX -= state.player.turnSpeed * delta;
    }

    if (input.isDown('ArrowLeft')) {
      state.player.rotationY += state.player.turnSpeed * delta;
    }

    if (input.isDown('ArrowRight')) {
      state.player.rotationY -= state.player.turnSpeed * delta;
    }

    syncPlayerOutfitTransform(state);
  }

  updateCamera(camera, state, delta);

  if (state.mode === 'playing' && input.consumePress('Space')) {
    performAttack(state, scene);
  }

  if (input.checkCheatMatch(getWeeklyCheatCode())) {
    const levelGain = Math.max(20 - state.player.level, 0);
    state.player.level += levelGain;
    state.player.baseDamage += levelGain;
    syncSwordLevel(state);

    if (levelGain > 0) {
      setMessage(state, 'Level 20 unlocked.', 3);
    }
  }

  if (state.mode === 'playing' && input.consumePress('KeyE')) {
    if (isNearForge(state)) {
      openForge(state);
    } else {
      setMessage(state, 'Move into the glowing forge ring, then press E to craft.', 3);
    }
  } else if (state.mode === 'forge') {
    if (!isNearForge(state)) {
      closeForge(state);
      setMessage(state, 'You stepped away from the forge.', 2.5);
    } else {
      handleForgeInput(state, input);
    }
  }

  if (state.mode === 'playing') {
    applyContactDamage(state, delta);
    updateProjectiles(state, scene, delta);
  }

  updatePickups(state, scene, delta, elapsedTime);
  syncSwordLevel(state);
  updateEnemyVisuals(state, delta, elapsedTime);

  if (allEnemiesDefeated(state)) {
    submitWaveScore(state);
    spawnWave(scene, state, state.wave + 1);
  }

  renderHud(state);
  syncStickmanMovies(hud);
  renderer.render(scene, camera);
  input.endFrame();
});
