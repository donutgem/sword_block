# Agent Rules

This repository is for **beginner programmers** building simple 3D web games using AI.

Optimize for:
- Clarity
- Fast iteration
- Small, understandable code
- Geometry-based visuals (not asset-heavy pipelines)

---

## Tech Stack (Non-Negotiable)

- Use **Node**
- Use **JavaScript**
- Use **Three.js (r150+)**
- Use **ES modules**
- Do NOT use Python
- Do NOT use global `<script src="three.js">`
- Do NOT use React unless explicitly requested

---

## Code Structure Rules

### 1. Split Files Properly

Never put everything in one large file.

Use structure like:

```text
/src
  main.js
  scene.js
  player.js
  input.js
  ui.js
```

Rules:

- One responsibility per file
- Keep files under ~250 lines
- Import/export using ES modules only

---

### 2. Keep Functions Small and Clear

- Prefer small, readable functions.
- If a function is longer than ~30 lines, split it.
- Name functions clearly (`createLights()`, `updatePlayer()`, `handleInput()`).

Avoid:

- Huge "do everything" functions
- Deep nested conditionals
- Clever one-liners that confuse beginners

Clarity > cleverness.

---

### 3. Prefer Geometry Over Assets

Do NOT rely heavily on downloaded 3D assets.

Instead use:

- `BoxGeometry`
- `SphereGeometry`
- `PlaneGeometry`
- `TorusGeometry`
- `IcosahedronGeometry`
- `CylinderGeometry`
- `ConeGeometry`

Why:

- Faster iteration
- No loading bugs
- No scaling/orientation issues
- Easier for beginners to understand

Only use GLTF models if:

- Explicitly requested
- The lesson is about model loading

---

## Beginner-First Communication Rules

When responding to students:

- Assume they are new.
- Do not assume vocabulary knowledge.
- Explain any non-obvious term in **one simple sentence max**, then show the action.
- Avoid being cutesy or overly casual.
- Be direct and serious.
- Give concrete steps:
  - File path
  - What to change
  - What to expect
  - How to verify it worked

If a choice is required:

- Offer 2-3 options
- Recommend one clearly

---

## Iteration Speed Rules

- Build the simplest working version first.
- Do not over-engineer.
- After the original prototype is built, build one mechanic or feature at a time.
- Add polish later.
- Avoid abstraction layers until needed.

---

## UI Principles

- Keep the UI clean and simple
- Keep text minimal, don't add too much explainer text

---

# Three.js Web Game Defaults

Follow these unless explicitly told otherwise.

---

## Scene First (Before Gameplay)

Before writing logic, define:

- What is the core object?
- How does the player move?
- Is this static, orbit controls, or WASD?
- Desktop target only (unless stated otherwise)?

Build a quick calibration scene:

- Add `GridHelper`
- Add `AxesHelper`
- Add 1 test cube

Confirm:

- Camera looks correct
- Movement directions feel correct
- Ground is at `y = 0`

Do this before building mechanics.

---

## Reference Frame Contract (Critical)

Three.js defaults:

- +X = right
- +Y = up
- +Z = toward camera
- Object forward is usually local `-Z`

Do NOT guess orientation.

If movement feels backward:

- Fix vector math
- Do NOT remap keys

---

## Renderer Defaults

Always:

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
```

Handle resize:

```js
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
```

Use:

```js
renderer.setAnimationLoop((time) => {
  renderer.render(scene, camera);
});
```

---

## Animation Rules

- Compute delta time once per frame.
- Store input state outside the loop.
- Only mutate transforms inside the loop.
- Never create geometry or materials inside the loop.

---

## Camera-Relative Movement

When using WASD with a movable camera:

1. Get camera forward vector
2. Project onto XZ plane
3. Normalize
4. Derive right vector with correct cross product

If A/D feels inverted:

- Your cross product order is wrong.
- Fix math, not key mapping.

---

## Ground Anchoring Rules

Characters:

- Bottom of model touches `y = 0`

Ground tiles:

- Top of surface is `y = 0`

Do not fix floating issues with random offsets in multiple files.

If you need to adjust a model:

- Wrap it in a parent `Object3D`
- Offset once during setup

---

## Lighting Defaults

Start simple:

- `AmbientLight` (0.3-0.5)
- One `DirectionalLight`

Enable shadows only if needed.

Avoid 4-5 light sources unless necessary.

---

## Performance Guardrails

- Reuse materials and geometries.
- Avoid extremely high segment counts.
- Remove debug helpers before final version.
- Keep draw calls low.

Never create objects inside animation loops.

---

## State Management Safety

If your game freezes at "time ran out":

Common cause:

- Multiple systems trying to end the game.

Rules:

- One `state.mode`
- One transition function
- Clamp timers once
- Use a boolean latch like `hasEnded`

---

## Anti-Patterns (Never Do These)

- One giant `main.js` file
- Geometry created every frame
- Random y-offset fixes everywhere
- Global THREE builds
- Guessing model orientation
- Unbounded devicePixelRatio
- 500-line functions

---

## Multiplayer Rule For Student Projects

If a student asks for multiplayer, networking, rooms, syncing players, shared world state, live game sessions, or anything similar, do **not** build a custom multiplayer backend by default.

For Quest student projects:

- Do **not** create an Express server
- Do **not** create a Socket.IO server
- Do **not** create a Colyseus server
- Do **not** create a custom WebSocket backend
- Do **not** add a separate hosted multiplayer service

Instead, you must check the following `.md` file:

**Quest Student Multiplayer SDK Guide**

Use that guide whenever multiplayer is needed.

Important:

- Quest student deployments must remain static browser builds
- Multiplayer must use the Quest Multiplayer SDK
- Keep game logic client-side
- Use presence for player-specific temporary state
- Use shared state for room-wide state that late joiners should receive
- Use events for temporary one-off actions

---

## Final Principles

Clarity over complexity.
After the first prototype is built: build one step at a time, then test, then repeat.
