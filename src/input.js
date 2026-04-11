export function createInput() {
  const pressed = new Set();
  const justPressed = new Set();

  function onKeyDown(event) {
    if (!pressed.has(event.code)) {
      justPressed.add(event.code);
    }

    pressed.add(event.code);

    if (
      ['Space', 'KeyJ', 'KeyK', 'KeyL', 'KeyE', 'Digit1', 'Digit2', 'Escape'].includes(
        event.code
      )
    ) {
      event.preventDefault();
    }
  }

  function onKeyUp(event) {
    pressed.delete(event.code);
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  return {
    isDown(code) {
      return pressed.has(code);
    },
    consumePress(code) {
      if (!justPressed.has(code)) {
        return false;
      }

      justPressed.delete(code);
      return true;
    },
    endFrame() {
      justPressed.clear();
    },
    destroy() {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    }
  };
}
