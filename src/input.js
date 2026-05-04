export function createInput() {
  const pressed = new Set();
  const justPressed = new Set();

  function onKeyDown(event) {
    if (!pressed.has(event.code)) {
      justPressed.add(event.code);
    }

    pressed.add(event.code);

    const gameKeys = [
      'Space',
      'Enter',
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'KeyA',
      'KeyC',
      'KeyD',
      'KeyE',
      'KeyJ',
      'KeyK',
      'KeyL',
      'KeyM',
      'KeyS',
      'KeyW',
      'Digit1',
      'Digit2',
      'Digit3',
      'Escape'
    ];

    if (gameKeys.includes(event.code)) {
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
