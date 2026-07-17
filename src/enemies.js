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
const healthTextureSize = 128;

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

export function updateEnemyVisuals(state, delta, elapsedTime) {
  for (const enemy of state.enemies) {
    enemy.flashTimer = Math.max(enemy.flashTimer - delta, 0);
    updateEnemyHealthCircle(enemy);
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

  const healthCircle = createHealthCircle(maxHealth, maxHealth);
  healthCircle.sprite.position.set(0, blockHalfSize + 0.9, 0);
  healthCircle.sprite.scale.set(1.55, 1.55, 1);
  group.add(healthCircle.sprite);

  return {
    id: state.nextIds.enemy++,
    mesh: group,
    core,
    healthCircle,
    health: maxHealth,
    maxHealth,
    damage,
    radius: 1.7,
    contactCooldown: 0,
    flashTimer: 0
  };
}

function createHealthCircle(health, maxHealth) {
  const canvas = document.createElement('canvas');
  canvas.width = healthTextureSize;
  canvas.height = healthTextureSize;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false
  });

  const healthCircle = {
    canvas,
    context: canvas.getContext('2d'),
    texture,
    sprite: new THREE.Sprite(material),
    displayedHealth: null
  };

  drawHealthCircle(healthCircle, health, maxHealth);
  return healthCircle;
}

function updateEnemyHealthCircle(enemy) {
  if (enemy.healthCircle.displayedHealth === enemy.health) {
    return;
  }

  drawHealthCircle(enemy.healthCircle, enemy.health, enemy.maxHealth);
}

function drawHealthCircle(healthCircle, health, maxHealth) {
  const context = healthCircle.context;
  const size = healthTextureSize;
  const center = size / 2;
  const radius = 43;
  const healthRatio = maxHealth > 0 ? Math.max(health / maxHealth, 0) : 0;

  context.clearRect(0, 0, size, size);

  context.lineWidth = 16;
  context.lineCap = 'round';
  context.strokeStyle = 'rgba(18, 61, 67, 0.9)';
  context.beginPath();
  context.arc(center, center, radius, 0, Math.PI * 2);
  context.stroke();

  context.strokeStyle = '#7ce4cf';
  context.beginPath();
  context.arc(
    center,
    center,
    radius,
    -Math.PI / 2,
    -Math.PI / 2 + Math.PI * 2 * healthRatio
  );
  context.stroke();

  context.fillStyle = 'rgba(8, 52, 59, 0.82)';
  context.beginPath();
  context.arc(center, center, 28, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = '#ffffff';
  context.font = 'bold 34px Trebuchet MS, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.shadowColor = 'rgba(0, 0, 0, 0.7)';
  context.shadowBlur = 5;
  context.fillText(String(Math.ceil(health)), center, center + 1);
  context.shadowBlur = 0;

  healthCircle.displayedHealth = health;
  healthCircle.texture.needsUpdate = true;
}

function syncEnemyFlash(enemy) {
  const flashStrength = enemy.flashTimer > 0 ? 0.7 : 0;
  enemy.core.material.emissive.setRGB(flashStrength, flashStrength, flashStrength * 0.08);
}
