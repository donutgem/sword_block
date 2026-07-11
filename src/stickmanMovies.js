import {
  drawBlock,
  drawFinishFlag,
  drawForgeStation,
  drawImpactLines,
  drawIntermission,
  drawJumpArc,
  drawShard,
  drawSpark,
  drawStickman,
  drawSword,
  getShardByType,
  line
} from './stickmanDrawing.js';
import { captionSeconds, findCaptionLines, getCaptionIndex, hideCaptions, showCaption } from './stickmanCaptions.js';
import { getActiveSeconds, getLoopSeconds, getMovieFrame } from './stickmanTiming.js';

const activeCanvases = new WeakSet();
const FRAME_COUNTS = {
  race: 14,
  jump: 14,
  duel: 12,
  forge: 18
};
export function syncStickmanMovies(root) {
  root.querySelectorAll('[data-stickman-canvas="true"]').forEach((canvas) => {
    if (activeCanvases.has(canvas)) {
      return;
    }

    activeCanvases.add(canvas);
    animateCanvas(canvas);
  });
}

function animateCanvas(canvas) {
  const context = canvas.getContext('2d');
  const storyId = canvas.dataset.storyId;
  const color = canvas.dataset.storyColor || '#000000';
  const captionLines = findCaptionLines(canvas, storyId);
  const activeSeconds = getActiveSeconds(FRAME_COUNTS, storyId, captionLines.length, captionSeconds);
  const startTime = performance.now();
  let lastFrame = -1;
  let lastCaption = -1;

  function draw(now) {
    if (!canvas.isConnected) {
      return;
    }

    const elapsedSeconds = (now - startTime) / 1000;
    const frame = getMovieFrame(FRAME_COUNTS, storyId, elapsedSeconds, activeSeconds);
    if (frame !== lastFrame) {
      drawScene(context, canvas, storyId, color, frame);
      lastFrame = frame;
    }

    const captionIndex = frame === -1
      ? -1
      : getCaptionIndex(captionLines, getLoopSeconds(FRAME_COUNTS, storyId, elapsedSeconds, activeSeconds));
    if (captionIndex !== lastCaption) {
      if (captionIndex === -1) {
        hideCaptions(captionLines);
      } else {
        showCaption(captionLines, captionIndex);
      }
      lastCaption = captionIndex;
    }

    requestAnimationFrame(draw);
  }

  draw(performance.now());
}

function drawScene(context, canvas, storyId, color, frame) {
  const width = canvas.width;
  const height = canvas.height;
  const scale = width / 150;
  const groundY = height - 18 * scale;

  context.clearRect(0, 0, width, height);
  drawBackdrop(context, width, height, groundY, scale);

  if (frame === -1) {
    drawIntermission(context, width, height, scale);
    return;
  }

  if (storyId === 'race') {
    drawRace(context, frame, groundY, scale);
  } else if (storyId === 'jump') {
    drawJump(context, frame, groundY, scale);
  } else if (storyId === 'duel') {
    drawDuel(context, frame, groundY, scale);
  } else {
    drawForge(context, frame, groundY, scale, color);
  }
}

function drawBackdrop(context, width, height, groundY, scale) {
  context.fillStyle = '#eef8ff';
  context.fillRect(0, 0, width, height);
  context.fillStyle = 'rgba(57, 138, 198, 0.16)';
  context.fillRect(0, 0, width, 6 * scale);
  context.strokeStyle = 'rgba(20, 33, 46, 0.18)';
  context.lineWidth = 2 * scale;
  line(context, 8 * scale, groundY, width - 8 * scale, groundY);
}

function drawRace(context, frame, groundY, scale) {
  drawFinishFlag(context, 126 * scale, groundY, scale);
  drawFrameTicks(context, frame, 16 * scale, groundY - 47 * scale, scale);
  drawRunner(context, wrappedX(frame, 9, 8) * scale, groundY, '#238a50', frame, scale);
  drawRunner(context, wrappedX(frame, 8, 34) * scale, groundY, '#d46b1f', frame + 1, scale);
  drawRunner(context, wrappedX(frame, 7, 58) * scale, groundY, '#7448d8', frame + 2, scale);
  drawProgressDot(context, frame / (FRAME_COUNTS.race - 1), groundY, scale);
}

function drawJump(context, frame, groundY, scale) {
  const heights = [0, 0, 6, 16, 27, 34, 32, 24, 12, 3, 0, 0, 4, 0];
  const xSteps = [18, 24, 33, 45, 58, 70, 82, 94, 105, 114, 121, 124, 126, 128];
  const pose = jumpPose(frame);

  drawJumpArc(context, 20 * scale, 126 * scale, groundY, scale);
  drawBlock(context, 82 * scale, groundY, scale);
  drawStickman(context, xSteps[frame] * scale, groundY - heights[frame] * scale, '#b88400', pose, scale);
  drawStickman(context, 126 * scale, groundY, '#0b8a8f', cheerPose(frame), scale * 0.8);
}

function drawDuel(context, frame, groundY, scale) {
  const clashFrames = [0, 0.15, 0.35, 0.65, 1, 0.45, 0.1, 0, 0.25, 0.7, 1, 0.2];
  const clash = clashFrames[frame];
  const leftX = (31 + clash * 19) * scale;
  const rightX = (119 - clash * 19) * scale;

  drawStickman(context, leftX, groundY, '#c03a82', {
    leftArm: 0.65,
    rightArm: -1 - clash * 0.75,
    leftLeg: 0.32,
    rightLeg: -0.34,
    lean: clash * 0.22
  }, scale);
  drawStickman(context, rightX, groundY, '#2778d8', {
    leftArm: 1 + clash * 0.75,
    rightArm: -0.65,
    leftLeg: 0.34,
    rightLeg: -0.32,
    lean: -clash * 0.22
  }, scale);
  drawSword(context, leftX + 12 * scale, groundY - 34 * scale, 28 * scale, -0.4 + clash * 0.9, scale);
  drawSword(context, rightX - 12 * scale, groundY - 34 * scale, 28 * scale, Math.PI + 0.4 - clash * 0.9, scale);

  if (clash > 0.9) {
    drawSpark(context, 75 * scale, groundY - 42 * scale, scale, frame);
    drawImpactLines(context, 75 * scale, groundY - 42 * scale, scale);
  }
}

function drawForge(context, frame, groundY, scale, color) {
  const hammerFrame = frame % 12;
  const hammerDown = hammerFrame === 3 || hammerFrame === 4 || hammerFrame === 8 || hammerFrame === 9;
  const hammerLift = [2.2, 1.6, 0.5, -1.4, -1.1, 0.8, 2.2, 1.2, -1.4, -1.1, 0.6, 1.8][hammerFrame];
  const helperPose = getForgeHelperPose(frame);

  drawForgeStation(context, 93 * scale, groundY, scale, hammerDown);
  drawMovingForgeShard(context, frame, scale);
  drawStickman(context, 60 * scale, groundY, color, {
    leftArm: 0.65,
    rightArm: hammerLift,
    leftLeg: 0.35,
    rightLeg: -0.35,
    lean: hammerDown ? 0.16 : -0.06
  }, scale);
  drawStickman(context, 120 * scale, groundY, '#b88400', helperPose, scale * 0.82);
}

function wrappedX(frame, speed, offset) {
  return 10 + ((frame * speed + offset) % 112);
}

function drawRunner(context, x, groundY, color, frame, scale) {
  const poses = [
    { leftArm: 0.9, rightArm: -0.9, leftLeg: -0.85, rightLeg: 0.85 },
    { leftArm: 0.25, rightArm: -0.25, leftLeg: -0.3, rightLeg: 0.3 },
    { leftArm: -0.9, rightArm: 0.9, leftLeg: 0.85, rightLeg: -0.85 },
    { leftArm: -0.25, rightArm: 0.25, leftLeg: 0.3, rightLeg: -0.3 }
  ];
  drawStickman(context, x, groundY, color, { ...poses[frame % poses.length], lean: 0.22 }, scale);
}

function jumpPose(frame) {
  if (frame > 2 && frame < 9) {
    return { leftArm: 2.05, rightArm: -2.05, leftLeg: 0.55, rightLeg: -0.55, lean: 0.12 };
  }

  return { leftArm: 0.6, rightArm: -0.6, leftLeg: 0.32, rightLeg: -0.32, lean: -0.08 };
}

function cheerPose(frame) {
  const up = frame % 4 < 2;
  return {
    leftArm: up ? 2.2 : 0.75,
    rightArm: up ? -2.2 : -0.75,
    leftLeg: 0.3,
    rightLeg: -0.3,
    lean: up ? 0.12 : -0.08
  };
}

function getForgeHelperPose(frame) {
  const phase = frame % 6;
  const isReaching = phase < 3;
  const isThrowing = phase === 3 || phase === 4;

  return {
    leftArm: isThrowing ? 2 : isReaching ? 1.35 : 0.75,
    rightArm: isThrowing ? -2 : isReaching ? -1.25 : -0.75,
    leftLeg: 0.3,
    rightLeg: -0.3,
    lean: isThrowing ? -0.28 : isReaching ? -0.16 : 0.08
  };
}

function drawMovingForgeShard(context, frame, scale) {
  const shard = getForgeShard(frame);
  const step = frame % 6;
  const progress = Math.min(step / 5, 1);
  const start = { x: 121, y: 45 };
  const end = getShardTarget(shard.type);
  const lift = Math.sin(progress * Math.PI) * 24;
  const x = (start.x + (end.x - start.x) * progress) * scale;
  const y = (start.y + (end.y - start.y) * progress - lift) * scale;

  drawShard(context, x, y, shard, scale);
}

function getForgeShard(frame) {
  return getShardByType(['blade', 'guard', 'pommel'][Math.floor(frame / 6)]);
}

function getShardTarget(type) {
  const targets = { blade: { x: 90, y: 50 }, guard: { x: 94, y: 48 }, pommel: { x: 98, y: 50 } };
  return targets[type] || targets.pommel;
}

function drawFrameTicks(context, frame, x, y, scale) {
  context.strokeStyle = 'rgba(20, 33, 46, 0.28)';
  context.lineWidth = 1.5 * scale;
  for (let index = 0; index < 5; index += 1) {
    const offset = ((frame * 9 + index * 17) % 70) * scale;
    line(context, x + offset, y + index * 8 * scale, x + offset + 14 * scale, y + index * 8 * scale);
  }
}

function drawProgressDot(context, progress, groundY, scale) {
  context.fillStyle = '#286d9f';
  context.beginPath();
  context.arc((12 + progress * 126) * scale, groundY + 9 * scale, 3.5 * scale, 0, Math.PI * 2);
  context.fill();
}
