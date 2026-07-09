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

## Quest Agent Docs Update Rule

If the user asks to update Quest docs, agent docs, AI instructions, Codex instructions, `AGENTS.md`, or Quest skills:
- Download and run `https://app.joinquest.com/student-deploy/update-quest-agent-docs.mjs`.
- Run it from the project root.
- After it runs, tell the user exactly which files changed.

Example command:

```bash
curl -fsSL https://app.joinquest.com/student-deploy/update-quest-agent-docs.mjs -o /tmp/update-quest-agent-docs.mjs && node /tmp/update-quest-agent-docs.mjs
```

## Multiplayer Rule

If the user asks for multiplayer, networking, rooms, syncing players, shared world state, live game sessions, or anything similar, do not build a custom multiplayer backend by default.

- Do not create an Express server.
- Do not create a Socket.IO server.
- Do not create a Colyseus server.
- Do not create a custom WebSocket backend.
- Do not add a separate hosted multiplayer service.

Use the Quest Multiplayer SDK instead:
- Read `.agents/skills/make-game-multiplayer/SKILL.md` if it exists.
- If it does not exist, read https://agents.joinquest.com/skills/make-game-multiplayer/SKILL.md.
- Use the SDK guide at https://agents.joinquest.com/docs/multiplayer-sdk.md when more detail is needed.

Important:
- Quest deployments must remain static browser builds.
- Multiplayer must use the Quest Multiplayer SDK.
- Keep game logic client-side.
- Use presence for player-specific temporary state.
- Use shared state for room-wide state late joiners should receive.
- Use events for temporary one-off actions.

## Deploy Rule For Projects

If the user asks to deploy a game to Quest:
- Read `.agents/skills/deploy-game/SKILL.md` if it exists.
- If it does not exist, read https://agents.joinquest.com/skills/deploy-game/SKILL.md.
- Look for the Quest deploy token in the user's message first.
- If no token is in the message, check `.env.local` in the project root for `QUEST_DEPLOY_TOKEN` or `STUDENT_DEPLOY_TOKEN`.
- If no local token is available, check the shell environment for `QUEST_DEPLOY_TOKEN` or `STUDENT_DEPLOY_TOKEN`.
- If the user provides a token, save it to `.env.local` as `QUEST_DEPLOY_TOKEN=<exact token>` and make sure `.gitignore` contains `.env.local` or `.env*.local`.
- Ask only for the user's Quest deploy token if it is not available from the message, `.env.local`, or shell environment.
- Choose the macOS/Linux or Windows PowerShell deploy command automatically based on the current shell.
- The token is the only project identifier for deploys. Do not add, infer, fix, or validate a project slug from the repo, folder, package, or command.
- Old owner-wide deploy tokens are no longer valid; if the API says the token is outdated or expired, ask for the latest project deploy token.
- If the user provides an older full Quest deploy prompt or command, use it and preserve build-related arguments such as `--entry`, `--dir`, `--build-dir`, and `--no-build`.
- Run only one deploy command at a time. If the command is still running, wait for it to finish; do not start another deploy in parallel or because output is taking a while.
- Run the deploy command once. If it prints `QUEST_DEPLOY_RESULT {"status":"success",...}`, do not rerun the command, even if later source-backup output is slow, noisy, or warning-only.
- Do not invent deploy tokens, placeholder versions, or URLs.
- Treat the structured `QUEST_DEPLOY_RESULT` line as the source of truth.

## Delete Deployed Version Rule

If the user asks to delete, remove, clean up, or undo a published Quest Student Deploy game version:
- Read `.agents/skills/delete-game-version/SKILL.md` if it exists.
- If it does not exist, read https://agents.joinquest.com/skills/delete-game-version/SKILL.md.
- List the student's projects and versions using the Quest deploy token.
- Ask which project/version to delete if it is not already clear.
- Show the exact version link before deleting.
- Ask for clear yes/no confirmation before deleting and state that deletion cannot be undone.
- If there are higher versions than the one being deleted, explain that Quest compacts version numbering after deletion: any later versions shift down by one number, so if v1, v2, and v3 exist and v2 is deleted, the old v3 becomes the new v2.
- After a successful deletion, mention following versions were renumbered down by one only if there were higher versions than the one deleted.
- Do not delete if the answer is unclear or anything other than yes.

## Local Storage Rule

If the user asks for saved progress, high scores, settings, save slots,
`localStorage`, `sessionStorage`, or storage that works locally but fails after
Quest deploy:
- Read `.agents/skills/use-local-storage/SKILL.md` if it exists.
- If it does not exist, read https://agents.joinquest.com/skills/use-local-storage/SKILL.md.
- Keep saves client-side and small.
- Use simple `localStorage` or `sessionStorage` patterns.
- Do not add a backend just to save game state.
- Do not rely on IndexedDB, localForage, service-worker storage, or Web Worker
  storage unless Quest explicitly documents support.

## Leaderboard Rule

If the user asks for an online leaderboard, shared high scores, global scores,
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

## Final Response For Playable Games

When a game is ready to test and a local dev server is running, put the playable
link first in the final response as a Markdown hyperlink.

Use this format:

```md
[**CLICK HERE TO OPEN THE GAME**](http://localhost:5173/)
```

Do not bury the URL in a long paragraph. Do not leave it as plain text when a
clickable Markdown link is possible. The link text must be bold and all caps.
