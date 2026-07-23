import {
  drawBlock,
  drawFinishFlag,
  drawForgeStation,
  drawImpactLines,
  drawIntermission,
  drawShard,
  drawSpark,
  drawStickman,
  drawSword,
  getShardByType,
  line
} from './stickmanDrawing.js';
import { findCaptionLines, getCaptionIndex, hideCaptions, showCaption } from './stickmanCaptions.js';
import { getActiveSeconds, getLoopSeconds, getMovieFrame } from './stickmanTiming.js';

const activeCanvases = new WeakSet();
const FRAME_COUNTS = {
  race: 14,
  jump: 14,
  duel: 12,
  forge: 18,
  cheer: 12,
  throw: 14,
  staff: 14,
  dance: 16
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
  const activeSeconds = getActiveSeconds(FRAME_COUNTS, storyId);
  const startTime = performance.now();
  let lastCaption = -1;

  function draw(now) {
    if (!canvas.isConnected) {
      return;
    }

    const elapsedSeconds = (now - startTime) / 1000;
    const frame = getMovieFrame(FRAME_COUNTS, storyId, elapsedSeconds, activeSeconds);
    drawScene(context, canvas, storyId, color, frame);

    const captionIndex = frame === -1
      ? -1
      : getCaptionIndex(captionLines, getLoopSeconds(FRAME_COUNTS, storyId, elapsedSeconds, activeSeconds), activeSeconds);
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
  } else if (storyId === 'cheer') {
    drawCheer(context, frame, groundY, scale);
  } else if (storyId === 'throw') {
    drawThrow(context, frame, groundY, scale);
  } else if (storyId === 'staff') {
    drawStaffSpin(context, frame, groundY, scale);
  } else if (storyId === 'dance') {
    drawDance(context, frame, groundY, scale);
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
  drawProgressDot(context, Math.min(frame / (FRAME_COUNTS.race - 1), 1), groundY, scale);
}

function drawJump(context, frame, groundY, scale) {
  const heights = [0, 0, 6, 16, 27, 34, 32, 24, 12, 3, 0, 0, 4, 0];
  const xSteps = [18, 24, 33, 45, 58, 70, 82, 94, 105, 114, 121, 124, 126, 128];
  const pose = jumpPose(frame);
  const jumperX = sampleLoop(xSteps, frame) * scale;
  const jumperY = groundY - sampleLoop(heights, frame) * scale;

  drawJumpTrail(context, frame, xSteps, heights, groundY, scale);
  drawBlock(context, 82 * scale, groundY, scale);
  drawStickman(context, jumperX, jumperY, '#b88400', pose, scale);
  drawStickman(context, 126 * scale, groundY, '#0b8a8f', cheerPose(frame), scale * 0.8);
}

function drawJumpTrail(context, frame, xSteps, heights, groundY, scale) {
  const currentStep = Math.floor(frame);
  const dotCount = Math.min(currentStep + 1, xSteps.length);

  context.fillStyle = 'rgba(184, 132, 0, 0.42)';

  for (let index = 0; index < dotCount; index += 1) {
    const trailAge = dotCount - index;
    const radius = Math.max(1.5, 4 - trailAge * 0.18) * scale;
    const x = xSteps[index] * scale;
    const y = groundY - heights[index] * scale - 5 * scale;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
}

function drawDuel(context, frame, groundY, scale) {
  const leftX = sampleLoop([31, 33, 38, 47, 52, 44, 35, 29, 27, 31, 39, 49, 56, 48, 38, 31], frame) * scale;
  const rightX = sampleLoop([119, 117, 112, 103, 98, 106, 115, 121, 122, 118, 110, 100, 91, 101, 112, 119], frame) * scale;
  const leftPose = samplePoseLoop([
    { leftArm: 0.55, rightArm: -1.25, leftLeg: 0.28, rightLeg: -0.3, lean: -0.05 },
    { leftArm: 0.8, rightArm: -1.75, leftLeg: 0.32, rightLeg: -0.38, lean: 0.08 },
    { leftArm: 1.2, rightArm: -0.85, leftLeg: 0.38, rightLeg: -0.46, lean: 0.2 },
    { leftArm: 1.55, rightArm: 0.1, leftLeg: 0.46, rightLeg: -0.5, lean: 0.32 },
    { leftArm: 0.9, rightArm: 0.75, leftLeg: 0.52, rightLeg: -0.58, lean: 0.26 },
    { leftArm: 0.35, rightArm: -0.25, leftLeg: 0.24, rightLeg: -0.28, lean: -0.05 },
    { leftArm: 0.2, rightArm: -1.15, leftLeg: -0.2, rightLeg: 0.42, lean: -0.22 },
    { leftArm: 0.65, rightArm: -1.55, leftLeg: -0.28, rightLeg: 0.5, lean: -0.28 },
    { leftArm: 0.95, rightArm: -1.1, leftLeg: 0.34, rightLeg: -0.3, lean: 0.02 },
    { leftArm: 1.15, rightArm: -0.45, leftLeg: 0.38, rightLeg: -0.42, lean: 0.18 },
    { leftArm: 1.4, rightArm: 0.25, leftLeg: 0.52, rightLeg: -0.58, lean: 0.34 },
    { leftArm: 0.75, rightArm: 0.95, leftLeg: 0.62, rightLeg: -0.7, lean: 0.4 },
    { leftArm: 0.35, rightArm: 0.35, leftLeg: 0.3, rightLeg: -0.35, lean: 0.12 },
    { leftArm: 0.5, rightArm: -0.65, leftLeg: 0.28, rightLeg: -0.32, lean: -0.08 },
    { leftArm: 0.58, rightArm: -1.05, leftLeg: 0.28, rightLeg: -0.3, lean: -0.05 },
    { leftArm: 0.55, rightArm: -1.25, leftLeg: 0.28, rightLeg: -0.3, lean: -0.05 }
  ], frame);
  const rightPose = samplePoseLoop([
    { leftArm: 1.2, rightArm: -0.55, leftLeg: 0.3, rightLeg: -0.28, lean: 0.05 },
    { leftArm: 1.35, rightArm: -0.75, leftLeg: 0.34, rightLeg: -0.32, lean: -0.02 },
    { leftArm: 1.65, rightArm: -1.05, leftLeg: 0.42, rightLeg: -0.4, lean: -0.16 },
    { leftArm: 1.8, rightArm: -0.2, leftLeg: 0.48, rightLeg: -0.45, lean: -0.3 },
    { leftArm: 1.25, rightArm: 0.4, leftLeg: 0.36, rightLeg: -0.34, lean: -0.12 },
    { leftArm: 0.65, rightArm: -0.2, leftLeg: 0.22, rightLeg: -0.26, lean: 0.1 },
    { leftArm: 0.35, rightArm: -1.25, leftLeg: -0.18, rightLeg: 0.44, lean: 0.22 },
    { leftArm: 0.9, rightArm: -1.65, leftLeg: -0.24, rightLeg: 0.52, lean: 0.3 },
    { leftArm: 1.25, rightArm: -1.1, leftLeg: 0.28, rightLeg: -0.3, lean: -0.02 },
    { leftArm: 1.55, rightArm: -0.55, leftLeg: 0.34, rightLeg: -0.38, lean: -0.18 },
    { leftArm: 1.85, rightArm: 0.1, leftLeg: 0.46, rightLeg: -0.5, lean: -0.35 },
    { leftArm: 1.05, rightArm: 0.65, leftLeg: 0.6, rightLeg: -0.66, lean: -0.42 },
    { leftArm: 0.45, rightArm: 0.15, leftLeg: 0.3, rightLeg: -0.32, lean: -0.15 },
    { leftArm: 0.75, rightArm: -0.55, leftLeg: 0.28, rightLeg: -0.3, lean: 0.08 },
    { leftArm: 1.05, rightArm: -0.95, leftLeg: 0.3, rightLeg: -0.28, lean: 0.05 },
    { leftArm: 1.2, rightArm: -0.55, leftLeg: 0.3, rightLeg: -0.28, lean: 0.05 }
  ], frame);
  const leftSwordAngle = sampleLoop([-1.05, -1.35, -0.75, 0.1, 0.72, -0.15, -1.25, -1.65, -1.0, -0.35, 0.28, 0.92, 0.45, -0.28, -0.78, -1.05], frame);
  const rightSwordAngle = Math.PI + sampleLoop([1.05, 1.25, 0.7, -0.05, -0.58, 0.22, 1.15, 1.55, 1.05, 0.35, -0.22, -0.82, -0.38, 0.25, 0.75, 1.05], frame);
  const leftSwordHand = getStickmanHand(leftX, groundY, leftPose, leftPose.rightArm, scale);
  const rightSwordHand = getStickmanHand(rightX, groundY, rightPose, rightPose.leftArm, scale);

  drawStickman(context, leftX, groundY, '#c03a82', leftPose, scale);
  drawStickman(context, rightX, groundY, '#2778d8', rightPose, scale);
  drawSword(context, leftSwordHand.x, leftSwordHand.y, 28 * scale, leftSwordAngle, scale);
  drawSword(context, rightSwordHand.x, rightSwordHand.y, 28 * scale, rightSwordAngle, scale);

  const step = Math.floor(frame) % FRAME_COUNTS.duel;
  if (step === 4 || step === 11) {
    const sparkX = step === 4 ? 76 : 72;
    const sparkY = step === 4 ? 42 : 36;
    drawSpark(context, sparkX * scale, groundY - sparkY * scale, scale, frame);
    drawImpactLines(context, sparkX * scale, groundY - sparkY * scale, scale);
  }
}

function drawForge(context, frame, groundY, scale, color) {
  const hammerFrame = frame % 12;
  const hammerStep = Math.floor(hammerFrame);
  const hammerDown = hammerStep === 3 || hammerStep === 4 || hammerStep === 8 || hammerStep === 9;
  const hammerLift = sampleLoop([2.2, 1.6, 0.5, -1.4, -1.1, 0.8, 2.2, 1.2, -1.4, -1.1, 0.6, 1.8], frame);
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

function drawCheer(context, frame, groundY, scale) {
  const bounce = Math.sin(frame * 1.2) * 5;
  drawSpark(context, 75 * scale, groundY - 58 * scale, scale, frame);
  drawStickman(context, 75 * scale, groundY - bounce * scale, '#0b8a8f', cheerPose(frame), scale);
  drawStickman(context, 112 * scale, groundY, '#238a50', {
    leftArm: 1.7,
    rightArm: -1.4,
    leftLeg: 0.35,
    rightLeg: -0.35,
    lean: -0.14
  }, scale * 0.82);
}

function drawThrow(context, frame, groundY, scale) {
  const step = frame % FRAME_COUNTS.throw;
  const progress = Math.min(Math.max((step - 4) / 7, 0), 1);
  const starX = (54 + progress * 74) * scale;
  const starY = (groundY - (48 - Math.sin(progress * Math.PI) * 18) * scale);
  const pose = {
    leftArm: 0.7,
    rightArm: sampleLoop([-1.5, -1.9, -2.15, -1.2, 0.1, 0.75, 0.2], frame),
    leftLeg: 0.35,
    rightLeg: -0.42,
    lean: progress > 0 ? 0.25 : -0.08
  };

  drawBlock(context, 125 * scale, groundY, scale);
  drawStickman(context, 46 * scale, groundY, '#2778d8', pose, scale);
  drawNinjaStar(context, starX, starY, frame, scale);

  if (progress > 0.82) {
    drawImpactLines(context, 126 * scale, groundY - 18 * scale, scale);
  }
}

function drawStaffSpin(context, frame, groundY, scale) {
  const pose = {
    leftArm: 1.75,
    rightArm: -1.75,
    leftLeg: 0.34,
    rightLeg: -0.34,
    lean: Math.sin(frame * 0.7) * 0.18
  };
  const hand = getStickmanHand(75 * scale, groundY, pose, pose.rightArm, scale);
  const angle = -frame * 0.75;

  drawBlock(context, 116 * scale, groundY, scale);
  drawStickman(context, 75 * scale, groundY, '#7f6758', pose, scale);
  drawSword(context, hand.x, hand.y - 10 * scale, 43 * scale, angle, scale);
  drawSword(context, hand.x, hand.y - 10 * scale, 43 * scale, angle + Math.PI, scale);

  if (Math.floor(frame) % 5 === 2) {
    drawImpactLines(context, 116 * scale, groundY - 18 * scale, scale);
  }
}

function drawDance(context, frame, groundY, scale) {
  const poses = [
    { leftArm: 1.8, rightArm: -0.5, leftLeg: 0.8, rightLeg: -0.25, lean: -0.22 },
    { leftArm: 1.2, rightArm: -1.2, leftLeg: 0.25, rightLeg: -0.25, lean: 0 },
    { leftArm: 0.5, rightArm: -1.8, leftLeg: 0.25, rightLeg: -0.8, lean: 0.22 },
    { leftArm: 1.2, rightArm: -1.2, leftLeg: 0.25, rightLeg: -0.25, lean: 0 }
  ];

  drawStickman(context, 55 * scale, groundY, '#c03a82', samplePoseLoop(poses, frame), scale);
  drawStickman(context, 98 * scale, groundY, '#d46b1f', samplePoseLoop(poses, frame + 2), scale * 0.9);
  drawFrameTicks(context, frame, 20 * scale, groundY - 56 * scale, scale);
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
  drawStickman(context, x, groundY, color, { ...samplePoseLoop(poses, frame), lean: 0.22 }, scale);
}

function drawNinjaStar(context, x, y, frame, scale) {
  context.save();
  context.translate(x, y);
  context.rotate(frame * 0.8);
  context.strokeStyle = '#263445';
  context.lineWidth = 2 * scale;
  for (let index = 0; index < 4; index += 1) {
    const angle = (Math.PI / 4) * index;
    line(
      context,
      Math.cos(angle) * -7 * scale,
      Math.sin(angle) * -7 * scale,
      Math.cos(angle) * 7 * scale,
      Math.sin(angle) * 7 * scale
    );
  }
  context.restore();
}

function jumpPose(frame) {
  if (frame > 2 && frame < 9) {
    return { leftArm: 2.05, rightArm: -2.05, leftLeg: 0.55, rightLeg: -0.55, lean: 0.12 };
  }

  return { leftArm: 0.6, rightArm: -0.6, leftLeg: 0.32, rightLeg: -0.32, lean: -0.08 };
}

function cheerPose(frame) {
  const up = Math.floor(frame) % 4 < 2;
  return {
    leftArm: up ? 2.2 : 0.75,
    rightArm: up ? -2.2 : -0.75,
    leftLeg: 0.3,
    rightLeg: -0.3,
    lean: up ? 0.12 : -0.08
  };
}

function getForgeHelperPose(frame) {
  const phase = Math.floor(frame) % 6;
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

function getStickmanHand(x, footY, pose, armAngle, scale) {
  const neck = {
    x: x + Math.sin(pose.lean || 0) * 8 * scale,
    y: footY - 39 * scale
  };
  const shoulderY = neck.y + 4 * scale;

  return {
    x: neck.x + Math.sin(armAngle) * 17 * scale,
    y: shoulderY + Math.cos(armAngle) * 17 * scale
  };
}

function sampleLoop(values, frame) {
  const index = Math.floor(frame) % values.length;
  const nextIndex = (index + 1) % values.length;
  const amount = frame - Math.floor(frame);
  return values[index] + (values[nextIndex] - values[index]) * amount;
}

function samplePoseLoop(poses, frame) {
  const index = Math.floor(frame) % poses.length;
  const nextIndex = (index + 1) % poses.length;
  const amount = frame - Math.floor(frame);
  return {
    leftArm: lerp(poses[index].leftArm, poses[nextIndex].leftArm, amount),
    rightArm: lerp(poses[index].rightArm, poses[nextIndex].rightArm, amount),
    leftLeg: lerp(poses[index].leftLeg, poses[nextIndex].leftLeg, amount),
    rightLeg: lerp(poses[index].rightLeg, poses[nextIndex].rightLeg, amount),
    lean: lerp(poses[index].lean || 0, poses[nextIndex].lean || 0, amount)
  };
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
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
