export const animationSlowdown = 2;
export const frameRate = 10 / animationSlowdown;
export const intermissionSeconds = 0.8 * animationSlowdown;

export function getMovieFrame(frameCounts, storyId, elapsedSeconds, activeSeconds) {
  const count = frameCounts[storyId] || frameCounts.forge;
  const loopSeconds = getLoopSeconds(frameCounts, storyId, elapsedSeconds, activeSeconds);

  if (loopSeconds >= activeSeconds) {
    return -1;
  }

  return (loopSeconds * frameRate) % count;
}

export function getLoopSeconds(frameCounts, storyId, elapsedSeconds, activeSeconds) {
  const count = frameCounts[storyId] || frameCounts.forge;
  const cycleSeconds = (activeSeconds || count / frameRate) + intermissionSeconds;
  return elapsedSeconds % cycleSeconds;
}

export function getActiveSeconds(frameCounts, storyId) {
  const count = frameCounts[storyId] || frameCounts.forge;
  return count / frameRate;
}
