# Agent Rules

This repository is for beginner programmers building simple 3D web games with AI.

Optimize for:
- Clarity
- Fast iteration
- Small, understandable code
- Geometry-based visuals instead of asset-heavy pipelines

## Tech Stack

- Use Node.
- Use JavaScript.
- Use Three.js r150 or newer.
- Use ES modules.
- Do not use Python.
- Do not use global `<script src="three.js">` builds.
- Do not use React unless the student explicitly requests it.

## Code Structure Rules

Never put everything in one large file.

Use a structure like:

```txt
/src
  main.js
  scene.js
  player.js
  input.js
  ui.js
```

Rules:
- Keep one responsibility per file.
- Keep files under about 250 lines.
- Use ES module `import` and `export`.

## Function Rules

- Prefer small, readable functions.
- If a function is longer than about 30 lines, split it.
- Name functions clearly, such as `createLights()`, `updatePlayer()`, and `handleInput()`.
- Avoid huge functions, deeply nested conditionals, and clever one-liners.

Clarity matters more than cleverness.

## Prefer Geometry Over Assets

Do not rely heavily on downloaded 3D assets.

Prefer:
- `BoxGeometry`
- `SphereGeometry`
- `PlaneGeometry`
- `TorusGeometry`
- `IcosahedronGeometry`
- `CylinderGeometry`
- `ConeGeometry`

Only use GLTF models when the student explicitly asks for models or the lesson is about model loading.

## Beginner-First Communication

When responding to students:
- Assume they are new.
- Do not assume vocabulary knowledge.
- Explain a non-obvious term in one simple sentence, then show the action.
- Be direct and serious.
- Give concrete steps: file path, what to change, what to expect, and how to verify.

If a choice is required:
- Offer 2 or 3 options.
- Recommend one clearly.

## Iteration Speed

- Build the simplest working version first.
- Do not over-engineer.
- After the first prototype works, build one mechanic or feature at a time.
- Test after each change.
- Add polish later.
- Avoid abstraction layers until they are needed.

## UI Principles

- Keep the UI clean and simple.
- Keep text minimal.
- Do not add long explainer text inside the game.
- Do not use emojis in buttons unless the student explicitly asks.

## Three.js Scene Defaults

Before gameplay, define:
- What is the core object?
- How does the player move?
- Is the camera static, orbit controls, or WASD?
- Is the target desktop only, unless the student says otherwise?

Build a quick calibration scene first:
- Add `GridHelper`.
- Add `AxesHelper`.
- Add one test cube.
- Confirm the camera looks correct.
- Confirm movement directions feel correct.
- Confirm the ground is at `y = 0`.

Three.js reference frame:
- `+X` is right.
- `+Y` is up.
- `+Z` is toward the camera.
- Object forward is usually local `-Z`.

If movement feels backward, fix the vector math. Do not remap keys to hide an orientation bug.

Renderer defaults:

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
```

Handle resize:

```js
window.addEventListener("resize", () => {
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

Animation rules:
- Compute delta time once per frame.
- Store input state outside the loop.
- Only mutate transforms inside the loop.
- Never create geometry or materials inside the loop.

Lighting defaults:
- Start with `AmbientLight` from 0.3 to 0.5.
- Add one `DirectionalLight`.
- Enable shadows only when needed.
- Avoid 4 or 5 light sources unless there is a clear reason.

Performance guardrails:
- Reuse materials and geometries.
- Avoid extremely high segment counts.
- Remove debug helpers before final delivery.
- Keep draw calls low.

## State Management Safety

If the game freezes when time runs out, the common cause is multiple systems trying to end the game.

Rules:
- Use one `state.mode`.
- Use one transition function.
- Clamp timers once.
- Use a boolean latch such as `hasEnded`.

## Quest Agent Docs Update Rule

If a student asks to update Quest docs, agent docs, AI instructions, Codex instructions, `AGENTS.md`, or Quest skills:
- Download and run `https://app.joinquest.com/student-deploy/update-quest-agent-docs.mjs`.
- Run it from the project root.
- After it runs, tell the student exactly which files changed.

Example command:

```bash
curl -fsSL https://app.joinquest.com/student-deploy/update-quest-agent-docs.mjs -o /tmp/update-quest-agent-docs.mjs && node /tmp/update-quest-agent-docs.mjs
```

## Multiplayer Rule For Student Projects

If a student asks for multiplayer, networking, rooms, syncing players, shared world state, live game sessions, or anything similar, do not build a custom multiplayer backend by default.

For Quest student projects:
- Do not create an Express server.
- Do not create a Socket.IO server.
- Do not create a Colyseus server.
- Do not create a custom WebSocket backend.
- Do not add a separate hosted multiplayer service.

Use the Quest Student Multiplayer SDK instead:
- Read `.agents/skills/make-game-multiplayer/SKILL.md` if it exists.
- If it does not exist, read https://agents.joinquest.com/skills/make-game-multiplayer/SKILL.md.
- Use the SDK guide at https://agents.joinquest.com/docs/multiplayer-sdk.md when more detail is needed.

Important:
- Quest student deployments must remain static browser builds.
- Multiplayer must use the Quest Multiplayer SDK.
- Keep game logic client-side.
- Use presence for player-specific temporary state.
- Use shared state for room-wide state late joiners should receive.
- Use events for temporary one-off actions.

## Publishing Rule For Student Projects

If a student asks to deploy or publish a game to Quest:
- Read `.agents/skills/publish-game/SKILL.md` if it exists.
- If it does not exist, read https://agents.joinquest.com/skills/publish-game/SKILL.md.
- Ask only for the student's Quest deploy token if it is missing.
- Choose the macOS/Linux or Windows PowerShell deploy command automatically based on the current shell.
- If the student provides an older full Quest deploy prompt or command, use it and preserve every provided argument, including `--project`.
- Do not invent deploy tokens, placeholder project ids, versions, or URLs.
- Treat the structured `QUEST_DEPLOY_RESULT` line as the source of truth.

## Local Storage Rule For Student Projects

If a student asks for saved progress, high scores, settings, save slots,
`localStorage`, `sessionStorage`, or storage that works locally but fails after
Quest deploy:
- Read `.agents/skills/use-local-storage/SKILL.md` if it exists.
- If it does not exist, read https://agents.joinquest.com/skills/use-local-storage/SKILL.md.
- Keep saves client-side and small.
- Use simple `localStorage` or `sessionStorage` patterns.
- Do not add a backend just to save game state.
- Do not rely on IndexedDB, localForage, service-worker storage, or Web Worker
  storage unless Quest explicitly documents support.

## Leaderboard Rule For Student Projects

If a student asks for an online leaderboard, shared high scores, global scores,
persistent score database, fastest-time board, points ranking, money ranking,
or scores shared across devices:
- Read `.agents/skills/use-leaderboard/SKILL.md` if it exists.
- If it does not exist, read https://agents.joinquest.com/skills/use-leaderboard/SKILL.md.
- Use the SDK guide at https://agents.joinquest.com/docs/leaderboard-sdk.md when more detail is needed.
- Use the Quest Leaderboard SDK from `/student-deploy/quest-leaderboard.mjs` or `.js`.
- Do not create a custom backend, database, Supabase project, Firebase project,
  or put database credentials in browser code.
- Submit scores only at round end, level completion, or when the player beats a best score.
- Use `order: "desc"` when higher scores are better and `order: "asc"` when lower scores are better.

## Anti-Patterns

Never do these:
- One giant `main.js` file.
- Geometry created every frame.
- Random y-offset fixes in multiple files.
- Global Three.js builds.
- Guessing model orientation.
- Unbounded `devicePixelRatio`.
- 500-line functions.
- Custom multiplayer backends for Quest Student Deploy.
- Custom leaderboard backends or browser database credentials for Quest Student Deploy.
- IndexedDB or localForage for Quest Student Deploy saves unless Quest documents support.

## Final Principle

Clarity over complexity. Build one step, test it, then continue.
