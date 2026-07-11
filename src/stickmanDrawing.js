export function drawStickman(context, x, footY, color, pose, scale) {
  const headRadius = 5 * scale;
  const hip = { x, y: footY - 19 * scale };
  const neck = { x: x + Math.sin(pose.lean || 0) * 8 * scale, y: footY - 39 * scale };
  const head = { x: neck.x, y: neck.y - 8 * scale };

  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 3 * scale;
  context.lineCap = 'round';

  line(context, neck.x, neck.y, hip.x, hip.y);
  limb(context, neck.x, neck.y + 4 * scale, pose.leftArm, 17 * scale);
  limb(context, neck.x, neck.y + 4 * scale, pose.rightArm, 17 * scale);
  limb(context, hip.x, hip.y, pose.leftLeg, 19 * scale);
  limb(context, hip.x, hip.y, pose.rightLeg, 19 * scale);

  context.beginPath();
  context.arc(head.x, head.y, headRadius, 0, Math.PI * 2);
  context.fill();
}

export function line(context, x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

export function drawFinishFlag(context, x, groundY, scale) {
  context.fillStyle = '#263445';
  context.fillRect(x, groundY - 55 * scale, 4 * scale, 55 * scale);
  context.fillStyle = '#ffffff';
  context.fillRect(x + 4 * scale, groundY - 52 * scale, 22 * scale, 16 * scale);
  context.fillStyle = '#111111';
  context.fillRect(x + 15 * scale, groundY - 52 * scale, 11 * scale, 16 * scale);
}

export function drawJumpArc(context, startX, endX, groundY, scale) {
  context.strokeStyle = 'rgba(184, 132, 0, 0.35)';
  context.lineWidth = 2 * scale;
  context.setLineDash([5 * scale, 5 * scale]);
  context.beginPath();
  context.moveTo(startX, groundY - 3 * scale);
  context.quadraticCurveTo((startX + endX) / 2, groundY - 54 * scale, endX, groundY - 3 * scale);
  context.stroke();
  context.setLineDash([]);
}

export function drawImpactLines(context, x, y, scale) {
  context.strokeStyle = '#ffd85a';
  context.lineWidth = 2 * scale;
  for (let index = 0; index < 6; index += 1) {
    const angle = (Math.PI * 2 * index) / 6;
    line(context, x + Math.cos(angle) * 8 * scale, y + Math.sin(angle) * 8 * scale, x + Math.cos(angle) * 16 * scale, y + Math.sin(angle) * 16 * scale);
  }
}

export function drawBlock(context, x, groundY, scale) {
  context.fillStyle = '#4ec7b5';
  context.fillRect(x, groundY - 20 * scale, 23 * scale, 20 * scale);
}

export function drawSword(context, x, y, length, angle, scale) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.strokeStyle = '#263445';
  context.lineWidth = 3 * scale;
  line(context, 0, 0, length, 0);
  context.restore();
}

export function drawSpark(context, x, y, scale, frame) {
  context.fillStyle = '#ffd85a';
  context.beginPath();
  context.arc(x, y, (frame % 2 === 0 ? 7 : 4) * scale, 0, Math.PI * 2);
  context.fill();
}

export function getShardByType(type) {
  if (type === 'blade') {
    return { type, color: '#9ea7b0', shape: 'pole' };
  }

  if (type === 'guard') {
    return { type, color: '#7f6758', shape: 'stick' };
  }

  return { type, color: '#2778d8', shape: 'sphere' };
}

export function drawShard(context, x, y, shard, scale) {
  if (shard.shape === 'pole') {
    drawShardPole(context, x, y, shard.color, scale);
  } else if (shard.shape === 'stick') {
    drawShardStick(context, x, y, shard.color, scale);
  } else {
    drawShardSphere(context, x, y, shard.color, scale);
  }
}

export function drawForgeStation(context, x, groundY, scale, glowing) {
  context.save();
  context.translate(x, groundY);

  context.strokeStyle = glowing ? 'rgba(230, 142, 26, 0.95)' : 'rgba(240, 178, 83, 0.72)';
  context.lineWidth = 3 * scale;
  context.beginPath();
  context.ellipse(0, -5 * scale, 31 * scale, 9 * scale, 0, 0, Math.PI * 2);
  context.stroke();

  if (glowing) {
    context.strokeStyle = 'rgba(240, 178, 83, 0.34)';
    context.lineWidth = 7 * scale;
    context.beginPath();
    context.ellipse(0, -5 * scale, 35 * scale, 11 * scale, 0, 0, Math.PI * 2);
    context.stroke();
  }

  context.fillStyle = '#53616f';
  context.beginPath();
  context.moveTo(-24 * scale, -8 * scale);
  context.lineTo(24 * scale, -8 * scale);
  context.lineTo(17 * scale, -28 * scale);
  context.lineTo(-17 * scale, -28 * scale);
  context.closePath();
  context.fill();

  context.fillStyle = '#9ea7b0';
  context.fillRect(-23 * scale, -38 * scale, 46 * scale, 12 * scale);
  context.fillStyle = 'rgba(255, 255, 255, 0.22)';
  context.fillRect(-18 * scale, -36 * scale, 31 * scale, 3 * scale);
  context.restore();
}

export function drawIntermission(context, width, height, scale) {
  context.fillStyle = 'rgba(20, 33, 46, 0.12)';
  context.beginPath();
  context.arc(width / 2 - 10 * scale, height / 2, 3 * scale, 0, Math.PI * 2);
  context.arc(width / 2, height / 2, 3 * scale, 0, Math.PI * 2);
  context.arc(width / 2 + 10 * scale, height / 2, 3 * scale, 0, Math.PI * 2);
  context.fill();
}

function limb(context, x, y, angle, length) {
  line(context, x, y, x + Math.sin(angle) * length, y + Math.cos(angle) * length);
}

function drawShardPole(context, x, y, color, scale) {
  context.strokeStyle = '#263445';
  context.lineWidth = 5 * scale;
  line(context, x - 9 * scale, y, x + 9 * scale, y);
  context.strokeStyle = color;
  context.lineWidth = 3 * scale;
  line(context, x - 9 * scale, y, x + 9 * scale, y);
}

function drawShardStick(context, x, y, color, scale) {
  context.strokeStyle = '#263445';
  context.lineWidth = 5 * scale;
  line(context, x - 8 * scale, y + 3 * scale, x + 8 * scale, y - 3 * scale);
  context.strokeStyle = color;
  context.lineWidth = 3 * scale;
  line(context, x - 8 * scale, y + 3 * scale, x + 8 * scale, y - 3 * scale);
}

function drawShardSphere(context, x, y, color, scale) {
  context.fillStyle = color;
  context.strokeStyle = '#263445';
  context.lineWidth = 1.4 * scale;
  context.beginPath();
  context.arc(x, y, 5 * scale, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.fillStyle = 'rgba(255, 255, 255, 0.32)';
  context.beginPath();
  context.arc(x - 1.8 * scale, y - 1.8 * scale, 1.7 * scale, 0, Math.PI * 2);
  context.fill();
}
