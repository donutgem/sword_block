---
name: use-local-storage
description: Use when a Quest student project needs saved progress, high scores, settings, save slots, browser persistence, localStorage, sessionStorage, or debugging storage that works locally but not after Quest Student Deploy. This skill explains safe plain-browser localStorage patterns for Quest's isolated student project origin.
---

# Use Local Storage In A Quest Student Game

Use this skill when adding or fixing small browser saves for a student game deployed with Quest Student Deploy.

Quest Student Deploy serves game content from an isolated student project origin in production, ideally a stable per-project origin. Students should write plain browser `localStorage` and `sessionStorage` code. Quest handles the hosting isolation; the student game should not import a special storage SDK or talk to the parent page.

A per-project origin is the least error-prone production setup because browser storage is origin-wide. If many projects share one content origin, use a project-specific key such as `"submarine-shark-save-v1"` instead of a generic key such as `"saveData"`.

All versions of the same deployed game stay on the same browser storage origin. The version number is only part of the URL path, so a save made on version 1 is available on version 2 if the game keeps using the same storage key.

## Supported

Use:
- `localStorage.getItem(key)`
- `localStorage.setItem(key, value)`
- `localStorage.removeItem(key)`
- `localStorage.clear()`
- `localStorage[key]`
- `localStorage.keyName`
- The same simple patterns on `sessionStorage`

All values are strings. Use `JSON.stringify()` and `JSON.parse()` for objects.

## Not Supported By Default

Do not rely on these for Quest Student Deploy unless Quest explicitly documents support:
- IndexedDB
- localForage
- browser extension storage
- service-worker storage
- storage inside Web Workers
- server-side file or database saves

Student Deploy is static browser hosting. Do not add a backend just to save game state.

## Implementation Workflow

1. Inspect how the game tracks progress, score, settings, and reset state.
2. Add one small storage module, such as `src/storage.js`.
3. Store only small JSON-safe values: progress, high scores, settings, unlocked levels, save slots.
4. Save after meaningful changes, not every animation frame.
5. Load once during startup before creating UI that depends on saved values.
6. Add a reset or clear-save control when useful.
7. Keep the game playable if storage is unavailable or the save data is corrupt.

## Recommended Module

```js
const SAVE_KEY = "my-game-save-v1";

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGame(saveData) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch {
    // Keep the game running even if storage is full or unavailable.
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
}
```

Use a versioned key like `"my-game-save-v1"` so future save formats can change without crashing old saves.

Do not include the Quest deploy version (`v/1`, `v/2`, `v/3`) in the storage key unless the student explicitly wants each deployed version to have separate saves.

## Good Uses

- Best score
- Level unlocked
- Player settings
- Completed tutorial flag
- Small inventory or save slots

## Avoid

- Large assets, images, audio, or generated maps bigger than a small JSON object
- Saving every frame
- Secrets, tokens, passwords, or private information
- Depending on one browser's local save for multiplayer truth

For multiplayer games, keep shared game truth in the Quest Multiplayer SDK shared state. Use localStorage only for per-device preferences or single-player progress.
