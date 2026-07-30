const edgePadding = 8;

export function enableStickmanRemoteDrag(root) {
  if (root.dataset.dragReady === 'true') {
    return;
  }

  root.dataset.dragReady = 'true';
  const drag = { pointerId: null, offsetX: 0, offsetY: 0, width: 0, height: 0 };

  root.addEventListener('pointerdown', (event) => {
    const header = event.target.closest('.stickman-remote-header');
    const remote = header?.closest('.stickman-remote');

    if (!remote || event.button !== 0) {
      return;
    }

    const bounds = remote.getBoundingClientRect();
    drag.pointerId = event.pointerId;
    drag.offsetX = event.clientX - bounds.left;
    drag.offsetY = event.clientY - bounds.top;
    drag.width = bounds.width;
    drag.height = bounds.height;

    root.classList.add('is-dragged', 'is-dragging');
    setRemotePosition(root, bounds.left, bounds.top, drag);
    header.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  window.addEventListener('pointermove', (event) => {
    if (event.pointerId !== drag.pointerId) {
      return;
    }

    setRemotePosition(
      root,
      event.clientX - drag.offsetX,
      event.clientY - drag.offsetY,
      drag
    );
    event.preventDefault();
  });

  window.addEventListener('pointerup', (event) => endDrag(root, drag, event));
  window.addEventListener('pointercancel', (event) => endDrag(root, drag, event));
  window.addEventListener('resize', () => keepRemoteInBounds(root));
}

function setRemotePosition(root, x, y, drag) {
  const maxX = Math.max(window.innerWidth - drag.width - edgePadding, edgePadding);
  const maxY = Math.max(window.innerHeight - drag.height - edgePadding, edgePadding);
  const left = clamp(x, edgePadding, maxX);
  const top = clamp(y, edgePadding, maxY);

  root.style.setProperty('--stickman-remote-left', `${left}px`);
  root.style.setProperty('--stickman-remote-top', `${top}px`);
}

function keepRemoteInBounds(root) {
  const remote = root.querySelector('.stickman-remote');

  if (!remote || !root.classList.contains('is-dragged')) {
    return;
  }

  const bounds = remote.getBoundingClientRect();
  setRemotePosition(root, bounds.left, bounds.top, {
    width: bounds.width,
    height: bounds.height
  });
}

function endDrag(root, drag, event) {
  if (event.pointerId !== drag.pointerId) {
    return;
  }

  drag.pointerId = null;
  root.classList.remove('is-dragging');
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
