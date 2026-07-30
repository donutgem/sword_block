import * as THREE from 'three';
import {
  createEnemyHealthDisplay,
  faceHealthDisplayTowardCamera,
  updateEnemyHealthDisplay
} from './enemyHealthDisplay.js';
import { getMaxHealthForClearedWaves, setMessage } from './state.js';

const spawnPositions = [
  [-10, -10],
  [10, -10],
  [-10, 2],
  [10, 2],
  [0, -12]
];
const blockSize = 3;
const blockHalfSize = blockSize / 2;

export function spawnWave(scene, state, waveNumber) {
  for (const enemy of state.enemies) {
    scene.remove(enemy.mesh);
  }

  state.enemies = [];
  syncPlayerHealthForWave(state, waveNumber);
  state.wave = waveNumber;

  const maxHealth = (20 + (waveNumber - 1) * 5) * 5;
  const damage = 10 + (waveNumber - 1) * 2;

  for (const [x, z] of spawnPositions) {
    const enemy = createEnemy(state, maxHealth, damage, x, z, waveNumber);
    state.enemies.push(enemy);
    scene.add(enemy.mesh);
  }

  setMessage(state, `Wave ${waveNumber} started. Defeat the blocks to level up.`, 4);
}

export function updateEnemyVisuals(state, camera, delta, elapsedTime) {
  for (const enemy of state.enemies) {
    enemy.flashTimer = Math.max(enemy.flashTimer - delta, 0);
    updateEnemyHealthDisplay(enemy.healthDisplay, enemy.health, enemy.maxHealth);
    faceHealthDisplayTowardCamera(enemy.healthDisplay, camera);
    enemy.core.rotation.y = elapsedTime * 0.55 + enemy.id * 0.4;
    syncEnemyFlash(enemy);
  }
}

export function allEnemiesDefeated(state) {
  return state.enemies.length === 0;
}

function syncPlayerHealthForWave(state, waveNumber) {
  const clearedWaves = Math.max(waveNumber - 1, 0);
  const scaledHealth = getMaxHealthForClearedWaves(clearedWaves);

  state.player.maxHealth = scaledHealth;
  state.player.health = scaledHealth;
}

function createEnemy(state, maxHealth, damage, x, z, waveNumber) {
  const group = new THREE.Group();
  group.position.set(x, blockHalfSize, z);

  const blockMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(
      (0.47 + (waveNumber - 1) * 0.07) % 1,
      0.88,
      Math.min(0.48 + waveNumber * 0.025, 0.62)
    ),
    emissive: '#000000'
  });

  const core = new THREE.Mesh(
    new THREE.BoxGeometry(blockSize, blockSize, blockSize),
    blockMaterial
  );
  core.castShadow = true;
  core.receiveShadow = true;
  group.add(core);

  const eye = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 0.3, 0.18),
    new THREE.MeshStandardMaterial({
      color: '#000000',
      emissive: '#000000',
      emissiveIntensity: 0
    })
  );
  eye.position.set(0, 0.38, blockHalfSize + 0.09);
  eye.castShadow = true;
  core.add(eye);

  const healthDisplay = createEnemyHealthDisplay(maxHealth, maxHealth);
  healthDisplay.root.position.set(0, blockHalfSize + 1.95, 0);
  group.add(healthDisplay.root);

  return {
    id: state.nextIds.enemy++,
    mesh: group,
    core,
    healthDisplay,
    health: maxHealth,
    maxHealth,
    damage,
    radius: 1.7,
    contactCooldown: 0,
    flashTimer: 0
  };
}

function syncEnemyFlash(enemy) {
  const flashStrength = enemy.flashTimer > 0 ? 0.7 : 0;
  enemy.core.material.emissive.setRGB(flashStrength, flashStrength, flashStrength * 0.08);
}
