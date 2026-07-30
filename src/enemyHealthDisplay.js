import * as THREE from 'three';

const textureWidth = 512;
const textureHeight = 128;
const lineStart = 36;
const lineEnd = textureWidth - lineStart;
const lineY = textureHeight / 2;

export function createEnemyHealthDisplay(health, maxHealth) {
  const root = new THREE.Group();
  root.name = 'enemyHealthDisplay';

  const canvas = document.createElement('canvas');
  canvas.width = textureWidth;
  canvas.height = textureHeight;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.02,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const line = new THREE.Mesh(
    new THREE.PlaneGeometry(2.7, 0.68),
    material
  );
  line.name = 'healthLine';
  root.add(line);

  const display = {
    root,
    canvas,
    context: canvas.getContext('2d'),
    texture,
    displayedHealth: null
  };

  drawEnemyHealth(display, health, maxHealth);
  return display;
}

export function updateEnemyHealthDisplay(display, health, maxHealth) {
  if (display.displayedHealth === health) {
    return;
  }

  drawEnemyHealth(display, health, maxHealth);
}

export function faceHealthDisplayTowardCamera(display, camera) {
  display.root.quaternion.copy(camera.quaternion);
}

function drawEnemyHealth(display, health, maxHealth) {
  const context = display.context;
  const healthRatio = maxHealth > 0
    ? THREE.MathUtils.clamp(health / maxHealth, 0, 1)
    : 0;

  context.clearRect(0, 0, textureWidth, textureHeight);
  drawNeonHealth(context, healthRatio);
  drawHealthNumber(context, health, healthRatio);

  display.displayedHealth = health;
  display.texture.needsUpdate = true;
}

function drawNeonHealth(context, healthRatio) {
  if (healthRatio <= 0) {
    return;
  }

  const fillEnd = THREE.MathUtils.lerp(lineStart, lineEnd, healthRatio);
  context.lineCap = 'round';
  context.lineWidth = 30;
  context.strokeStyle = '#25ff79';
  context.shadowColor = '#00ff66';
  context.shadowBlur = 18;
  drawLine(context, lineStart, fillEnd);
  context.shadowBlur = 0;
}

function drawLine(context, startX, endX) {
  context.beginPath();
  context.moveTo(startX, lineY);
  context.lineTo(endX, lineY);
  context.stroke();
}

function drawHealthNumber(context, health, healthRatio) {
  const fillEnd = THREE.MathUtils.lerp(lineStart, lineEnd, healthRatio);
  const numberX = (lineStart + fillEnd) / 2;

  context.font = 'bold 54px Trebuchet MS, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.lineWidth = 8;
  context.strokeStyle = 'rgba(0, 25, 16, 0.9)';
  context.strokeText(String(Math.ceil(health)), numberX, lineY + 1);
  context.fillStyle = '#ffffff';
  context.fillText(String(Math.ceil(health)), numberX, lineY + 1);
}
