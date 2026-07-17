export function findCaptionLines(canvas, storyId) {
  const viewer = canvas.closest('.stickman-viewer');
  return Array.from(viewer?.querySelectorAll(`[data-caption-player="${storyId}"] [data-caption-index]`) || []);
}

export function getCaptionIndex(captionLines, elapsedSeconds, activeSeconds) {
  if (captionLines.length === 0) {
    return -1;
  }

  const captionSeconds = activeSeconds / captionLines.length;
  return Math.min(captionLines.length - 1, Math.floor(elapsedSeconds / captionSeconds));
}

export function showCaption(captionLines, activeIndex) {
  captionLines.forEach((line, index) => {
    line.classList.toggle('is-active', index === activeIndex);
  });
}

export function hideCaptions(captionLines) {
  captionLines.forEach((line) => {
    line.classList.remove('is-active');
  });
}
