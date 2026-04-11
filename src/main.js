import './style.css';
import { performAttack, applyContactDamage } from './combat.js';
import { allEnemiesDefeated, spawnWave, updateEnemyVisuals } from './enemies.js';
import { createInput } from './input.js';
import { createPlayer, updatePlayer } from './player.js';
import {
  closeForge,
  handleForgeInput,
  isNearForge,
  openForge,
  updatePickups
} from './progression.js';
import { createSceneApp, updateCamera } from './scene.js';
import { createGameState, setMessage } from './state.js';
import { renderHud } from './ui.js';

const state = createGameState();
const appRoot = document.querySelector('#app');
const { scene, camera, renderer } = createSceneApp(state);
const player = createPlayer(state);
const input = createInput();

appRoot.append(renderer.domElement);
scene.add(player);
spawnWave(scene, state, 1);
renderHud(state);

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

  if (state.ui.messageTimer > 0) {
    state.ui.messageTimer = Math.max(state.ui.messageTimer - delta, 0);
  }

  if (state.mode === 'playing') {
    updatePlayer(delta, input, state);
  }

  updateCamera(camera, state, delta);

  if (state.mode === 'playing' && input.consumePress('Space')) {
    performAttack(state, scene);
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
  }

  updatePickups(state, scene, delta, elapsedTime);
  updateEnemyVisuals(state, elapsedTime);

  if (allEnemiesDefeated(state)) {
    spawnWave(scene, state, state.wave + 1);
  }

  renderHud(state);
  renderer.render(scene, camera);
  input.endFrame();
});
