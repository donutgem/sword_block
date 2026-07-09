export function createInput() {
  const pressed = new Set();
  const justPressed = new Set();
  let cheatBuffer = '';
  const cheatTimeout = 3000; // 3 seconds to complete cheat code
  let cheatTimer = null;
  const cheatCallbacks = [];

  function onKeyDown(event) {
    if (isTextEntry(event.target)) {
      return;
    }

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

    // Cheat code handler: accumulate digit presses
    if (event.code.startsWith('Digit') && !isTextEntry(event.target)) {
      const digit = event.code.replace('Digit', '');
      cheatBuffer += digit;
      clearTimeout(cheatTimer);
      cheatTimer = setTimeout(() => {
        cheatBuffer = '';
      }, cheatTimeout);
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
    onCheatEntered(callback) {
      cheatCallbacks.push(callback);
    },
    getCheatBuffer() {
      return cheatBuffer;
    },
    clearCheatBuffer() {
      cheatBuffer = '';
      clearTimeout(cheatTimer);
    },
    checkCheatMatch(code) {
      if (cheatBuffer === String(code)) {
        cheatCallbacks.forEach(cb => cb());
        cheatBuffer = '';
        clearTimeout(cheatTimer);
        return true;
      }
      return false;
    },
    endFrame() {
      justPressed.clear();
    },
    destroy() {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      clearTimeout(cheatTimer);
    }
  };
}

function isTextEntry(element) {
  return element instanceof HTMLInputElement
    || element instanceof HTMLTextAreaElement;
}
