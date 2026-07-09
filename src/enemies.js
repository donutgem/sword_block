import * as THREE from 'three';
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
const healthFillHalfWidth = 0.825;

export function spawnWave(scene, state, waveNumber) {
  for (const enemy of state.enemies) {
    scene.remove(enemy.mesh);
  }

  state.enemies = [];
  syncPlayerHealthForWave(state, waveNumber);
  state.wave = waveNumber;

  const maxHealth = 20 + (waveNumber - 1) * 5;
  const damage = 10 + (waveNumber - 1) * 2;

  for (const [x, z] of spawnPositions) {
    const enemy = createEnemy(state, maxHealth, damage, x, z, waveNumber);
    state.enemies.push(enemy);
    scene.add(enemy.mesh);
  }

  setMessage(state, `Wave ${waveNumber} started. Defeat the blocks to level up.`, 4);
}

export function updateEnemyVisuals(state, delta, elapsedTime) {
  for (const enemy of state.enemies) {
    enemy.flashTimer = Math.max(enemy.flashTimer - delta, 0);
    enemy.healthFill.scale.x = Math.max(enemy.health / enemy.maxHealth, 0.001);
    enemy.healthFill.position.x =
      -healthFillHalfWidth + enemy.healthFill.scale.x * healthFillHalfWidth;
    syncHealthBarFacing(enemy, state.player.position);
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
    color: new THREE.Color().setHSL(0.49, 0.68, Math.min(0.42 + waveNumber * 0.025, 0.6)),
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
    new THREE.MeshStandardMaterial({ color: '#08343b' })
  );
  eye.position.set(0, 0.38, blockHalfSize + 0.09);
  eye.castShadow = true;
  core.add(eye);

  const healthBarGroup = new THREE.Group();
  healthBarGroup.position.set(0, blockHalfSize + 0.65, 0);
  group.add(healthBarGroup);

  const healthBarBack = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.2, 0.07),
    new THREE.MeshStandardMaterial({ color: '#123d43' })
  );
  healthBarGroup.add(healthBarBack);

  const healthFill = new THREE.Mesh(
    new THREE.BoxGeometry(1.65, 0.14, 0.08),
    new THREE.MeshStandardMaterial({ color: '#7ce4cf' })
  );
  healthFill.position.z = 0.02;
  healthBarGroup.add(healthFill);

  return {
    id: state.nextIds.enemy++,
    mesh: group,
    core,
    healthBarGroup,
    healthFill,
    health: maxHealth,
    maxHealth,
    damage,
    radius: 1.7,
    contactCooldown: 0,
    flashTimer: 0
  };
}

function syncHealthBarFacing(enemy, playerPosition) {
  const dx = playerPosition.x - enemy.mesh.position.x;
  const dz = playerPosition.z - enemy.mesh.position.z;
  enemy.healthBarGroup.rotation.y = Math.atan2(dx, dz);
}

function syncEnemyFlash(enemy) {
  const flashStrength = enemy.flashTimer > 0 ? 0.7 : 0;
  enemy.core.material.emissive.setRGB(flashStrength, flashStrength, flashStrength * 0.08);
}
