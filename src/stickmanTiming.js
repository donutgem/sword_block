export const frameRate = 10;
export const intermissionSeconds = 0.8;

export function getMovieFrame(frameCounts, storyId, elapsedSeconds, activeSeconds) {
  const count = frameCounts[storyId] || frameCounts.forge;
  const loopSeconds = getLoopSeconds(frameCounts, storyId, elapsedSeconds, activeSeconds);

  if (loopSeconds >= activeSeconds) {
    return -1;
  }

  return Math.floor(loopSeconds * frameRate) % count;
}

export function getLoopSeconds(frameCounts, storyId, elapsedSeconds, activeSeconds) {
  const count = frameCounts[storyId] || frameCounts.forge;
  const cycleSeconds = (activeSeconds || count / frameRate) + intermissionSeconds;
  return elapsedSeconds % cycleSeconds;
}

export function getActiveSeconds(frameCounts, storyId, captionCount, captionSeconds) {
  const count = frameCounts[storyId] || frameCounts.forge;
  return Math.max(count / frameRate, captionCount * captionSeconds);
}
