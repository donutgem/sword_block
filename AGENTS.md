# Agent Rules

This repository is for beginner programmers building simple 3D web games with AI.

## Your Tone and Personality

Before responding, read `SOUL.md` if it exists. Follow it for tone,
length, and communication style.

## Tech Stack

- Use Node.
- Use JavaScript.
- Use Three.js r150 or newer.
- Use ES modules.
- Do not use Python.
- Do not use global `<script src="three.js">` builds.
- Do not use React unless the user explicitly requests it.

## Code Structure Rules

Optimize for:
- Clarity
- Fast iteration
- Small, understandable code
- Geometry-based visuals instead of asset-heavy pipelines

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

Only use GLTF models when the user explicitly asks for models or the lesson is about model loading.

For important characters, vehicles, enemies, buildings, props, and landmarks,
do not leave random placeholder shapes unless the user asked for placeholders.
Use the model builder skill to create intentional grouped primitive models with
a readable silhouette.

## Beginner-First Communication

When responding to the user:
- Assume they are new.
- Do not assume vocabulary knowledge.
- Explain a non-obvious term in one simple sentence, then show the action.
- Be direct and serious.
- Give concrete steps: file path, what to change, what to expect, and how to verify.

If a choice is required:
- Offer 2 or 3 options.
- Recommend one clearly.

## Clarify Unclear Requests First

Use `.agents/skills/clarify-request/SKILL.md` when the user's message is short,
vague, or could mean several different things.

For vague bug reports, use `.agents/skills/fix-game-bug/SKILL.md` instead. For
vague new projects or big features, use `.agents/skills/project-planner/SKILL.md`
instead.

Do not inspect files, run commands, or edit code until the unclear request has
been clarified.

## Planning Rule

Use `.agents/skills/project-planner/SKILL.md` when the user asks for:
- A new game, app, website, simulator, tool, or project.
- A big feature or major redesign.
- A vague request with many possible interpretations.

For small edits, such as changing a color, speed, label, size, or one obvious
bug, do the edit directly.

The planner skill owns the detailed question flow, `plan.md` format, research
notes, risk notes, and first-version scope decisions. Do not duplicate that
procedure here.

## Bug Fix Rule

Use `.agents/skills/fix-game-bug/SKILL.md` when the user is trying to fix,
debug, troubleshoot, repair, or investigate broken game behavior.

Examples:
- "It is broken."
- "The controls are messed up."
- "The screen is flashing."
- "My player is floating."
- "The camera is weird."
- "It worked before but now it doesn't."

If the bug report is vague, ask 1 or 2 short A/B/C/D questions before editing.
Restate what you think the bug is in plain language, then ask only what you
need to know.

If the bug is clearly in a Three.js game, also use
`.agents/skills/threejs-game/SKILL.md`.

## Iteration Speed

- Build a simple working version first.
- Do not over-engineer.
- After the first prototype works, build one mechanic or feature at a time.
- Put non-required risky features in `plan.md` as later ideas when they are
  likely to delay or break the first playable version.
- Get the user to playtest the feature or game after each change.
- Add polish later.
- Avoid abstraction layers until they are needed.

## UI Principles

- Keep the UI clean and simple.
- Keep text minimal.
- Do not add long explainer text inside the game.
- Do not use emojis in buttons unless the user explicitly asks.

## Three.js Game Rule

Use `.agents/skills/threejs-game/SKILL.md` when building or changing a
Three.js game. That skill owns scene defaults, renderer defaults,
surface placement, animation-loop rules, performance guardrails, and state
management safety.

## Model Builder Rule

Use `.agents/skills/model-builder/SKILL.md` when the user asks to make,
improve, redesign, polish, edit, inspect, view, or tweak a 3D model,
primitive model, player, enemy, vehicle, building, prop, collectible, weapon,
tree, obstacle, landmark, or model workshop.

If the user says `open the Model Workshop`, `make a Model Workshop`, `show me
the Model Workshop`, or similar, they mean: create or open a temporary 3D model
viewer/editor for the project's models. The workshop should let them view one
model at a time, rotate/zoom around it, click individual primitive pieces, edit
the selected piece in a left-side panel, and copy the values for their AI.

If the model is in a Three.js game, also use `.agents/skills/threejs-game/SKILL.md`.

## Game Controls Rule

Use `.agents/skills/game-controls/SKILL.md` when building, changing, or
debugging player controls, camera controls, first-person movement,
third-person movement, driving controls, flying controls, shooter controls,
pointer lock, mouse-look, WASD movement, steering, or direction bugs.

If the game is a Three.js game, also use `.agents/skills/threejs-game/SKILL.md`.

## Visual Check Rule

Use `.agents/skills/visual-check/SKILL.md` when deciding whether to take
screenshots, use Playwright or browser automation, open a browser, or do a
quick visual verification pass after frontend, canvas, Three.js, layout,
camera, visibility, orientation, or framing changes.

The visual check should answer first-impression questions:
- Can you see the important thing?
- Is the camera pointed at it?
- Is it facing the expected direction?
- Is the UI readable and not overlapping?

Keep browser automation small. Do not turn visual checks into exhaustive
Playwright scripts, smoke-test suites, or long gameplay recordings.

If project instructions say not to use Playwright, do not use Playwright.

## Tuner Rule

Use `.agents/skills/tuner/SKILL.md` when the user asks for a tuner,
tuning panel, adjustment UI, debug controls, calibration controls, or
on-screen controls to move, rotate, scale, position, size, aim, or fine-tune
a game object, camera, light, spawn point, hitbox, level part, model, or
gameplay value.

## Quest Agent Docs Update Rule

If the user asks to update Quest docs, agent docs, AI instructions, Codex instructions, `AGENTS.md`, or Quest skills:
- Download and run `https://app.joinquest.com/student-deploy/update-quest-agent-docs.mjs`.
- Run it from the project root.
- After it runs, tell the user exactly which files changed.

## Quest Agent Docs Freshness Rule

When you first start meaningful work in a project, check `.agents/quest-agent-docs.json`.
- If the file is missing, unreadable, or `lastUpdatedAt` is 7 or more days old, download and run `https://app.joinquest.com/student-deploy/update-quest-agent-docs.mjs`.
- Run it from the project root.
- After it runs, re-read `AGENTS.md` before continuing.
- Do not block on this if the network is unavailable; mention the update check failed and continue with the installed docs.
- Do not run the updater repeatedly in the same task after a successful refresh.

Example command:

```bash
curl -fsSL https://app.joinquest.com/student-deploy/update-quest-agent-docs.mjs -o /tmp/update-quest-agent-docs.mjs && node /tmp/update-quest-agent-docs.mjs
```

## Multiplayer Rule

If the user asks for multiplayer, networking, rooms, syncing players, shared
world state, live game sessions, or anything similar:
- Use `.agents/skills/make-game-multiplayer/SKILL.md`.
- Do not build a custom multiplayer backend for Quest Student Deploy.
- Keep the deployed project as static browser files.

## Deploy Rule For Projects

If the user asks to deploy a game to Quest:
- Use `.agents/skills/deploy-game/SKILL.md`.
- Follow that skill exactly for token handling, commands, release metadata, and
  final response format.
- Do not deploy a custom backend.

## Edit Deployed Version Or Changelog Rule

If the user asks to edit, rename, polish, write, or fix a deployed version label or changelog:
- Use `.agents/skills/edit-version-changelog/SKILL.md`.
- Do not redeploy the game just to edit a release label or changelog.
- Leave the version label unchanged unless the user explicitly asks to rename or relabel the version.

## Delete Deployed Version Rule

If the user asks to delete, remove, clean up, or undo a published Quest Student Deploy game version:
- Use `.agents/skills/delete-game-version/SKILL.md`.
- Show the exact version link and get clear yes/no confirmation before deleting.
- Do not delete if the answer is unclear or anything other than yes.

## Local Storage Rule

If the user asks for saved progress, high scores, settings, save slots,
`localStorage`, `sessionStorage`, or storage that works locally but fails after
Quest deploy:
- Use `.agents/skills/use-local-storage/SKILL.md`.
- Keep saves client-side and small.
- Do not add a backend just to save game state.

## Leaderboard Rule

If the user asks for an online leaderboard, shared high scores, global scores,
persistent score database, fastest-time board, points ranking, money ranking,
or scores shared across devices:
- Use `.agents/skills/use-leaderboard/SKILL.md`.
- Use the Quest Leaderboard SDK.
- Do not create a custom backend, database, Supabase project, Firebase project,
  or put database credentials in browser code.

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

## Final Response For Playable Games

When a game is ready to test and a local dev server is running, put the playable
link first in the final response as a Markdown hyperlink.

Use this format:

```md
[**CLICK HERE TO OPEN THE GAME**](http://localhost:5173/)
```

Do not bury the URL in a long paragraph. Do not leave it as plain text when a
clickable Markdown link is possible. The link text must be bold and all caps.
