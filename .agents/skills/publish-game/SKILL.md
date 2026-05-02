---
name: publish-game
description: Use when a Quest student asks to deploy, publish, upload, release, or update a browser game through Quest Student Deploy. This skill explains the static hosting limits, deploy command handling, success parsing, and failure responses.
---

# Publish A Quest Student Game

Use this skill when a student asks to deploy or publish a game to Quest Student Deploy.

Quest Student Deploy accepts static browser builds only: HTML, CSS, JavaScript, and asset files. If the project needs multiplayer, it must use the Quest Multiplayer SDK in the browser client.

## Before Running Deploy

Check:
- The student provided their Quest deploy token.
- The project builds to static browser files.
- Backend folders or server entry files are not part of the deploy output.
- Large assets are not accidentally included from `node_modules`, cache folders, or source snapshots.

If the Quest deploy token is missing, ask the student for the token only. Do not ask for a full deploy command unless a token-based deploy fails and the error says a project-specific command or value is required.

If the student provides an older full Quest deploy prompt or command, use the command for the current shell and preserve every provided argument, including `--project`, `--entry`, `--dir`, `--build-dir`, and `--no-build`.

Do not invent placeholder tokens, project ids, versions, or URLs.

## Static Hosting Rules

- Upload HTML, CSS, JavaScript, and asset files only.
- Do not upload an Express server.
- Do not upload a Socket.IO server.
- Do not upload a Colyseus server.
- Do not upload a custom WebSocket backend.
- Build first when the project uses Vite or another bundler.
- Deploy the browser output folder, such as `dist`, when that is what the Quest command expects.

## Browser Storage Rule

Student games should use normal browser `localStorage` and `sessionStorage` for
small local saves. Quest production serves game content from an isolated student
project origin, ideally a stable per-project origin, so plain browser storage
can work without sharing Quest app cookies or Quest app storage. A stable
per-project origin also keeps one game's browser storage separate from another
game's storage. Versions share that same storage origin, so a save from version
1 is available in version 2 when the game keeps the same storage key.
Students may use simple `localStorage`/`sessionStorage` calls such as `getItem`,
`setItem`, `removeItem`, `clear`, bracket access, or property access. Do not
rely on IndexedDB, localForage, browser extension storage, service-worker
storage, or storage inside Web Workers unless Quest explicitly documents
support for it.

If the student is adding or debugging saved progress, high scores, settings,
save slots, `localStorage`, or `sessionStorage`, use:
`https://agents.joinquest.com/skills/use-local-storage/SKILL.md`.

If the student wants an online leaderboard, shared/global high scores, fastest
times, points rankings, money rankings, or a persistent score database shared
across devices, use:
`https://agents.joinquest.com/skills/use-leaderboard/SKILL.md`.

## Multiplayer Rule

If the project needs multiplayer:
- Use `https://app.joinquest.com/student-deploy/quest-multiplayer.mjs` or `.js`.
- Ask the player for a nickname.
- Join the shared room for the deployed project version.
- Keep player movement and presence lightweight.
- Send presence on a timer, about every 125ms to 250ms, not every frame.
- Do not resend unchanged presence values repeatedly.
- Keep shared world changes in shared state.
- Use events for transient actions.

## Running The Command

Choose the command for the current shell automatically. Do not ask the student whether they use macOS, Linux, or Windows unless the environment cannot run either command.

For macOS/Linux shells:

```bash
curl -fsSL "https://app.joinquest.com/student-deploy/runner.js" | node - --token "<QUEST_DEPLOY_TOKEN>" --api-base "https://app.joinquest.com"
```

For Windows PowerShell:

```powershell
(iwr "https://app.joinquest.com/student-deploy/runner.js" -UseBasicParsing).Content | node - --token "<QUEST_DEPLOY_TOKEN>" --api-base "https://app.joinquest.com"
```

Replace `<QUEST_DEPLOY_TOKEN>` with the exact token from the student, preserving all characters.

Ask questions only if the command fails or required auth is missing.

Treat the deploy as successful if the runner prints a line like:

```txt
QUEST_DEPLOY_RESULT {"status":"success",...}
```

Use that structured line as the source of truth over earlier warnings or noisy build output.

If that marker is missing, treat the deploy as successful only if the runner prints all of:
- `Success`
- `Version`
- `Game URL`

Warnings like this are not deploy failures:

```txt
Some chunks are larger than 500 kB after minification
```

## Failure Rules

Only reply `Failed` if:
- The command exits non-zero.
- The runner prints `QUEST_DEPLOY_RESULT {"status":"failed",...}`.
- The runner prints `Student deploy failed:`.

Never invent placeholders like `unknown` or `unavailable`. Copy the exact version and URL printed by the runner.

## Final Reply Format

Reply with only:

```txt
- Success/Failed
- Version
- Game URL
```

If rate limit reached, reply with only:

```txt
- Failed
- You've hit the limit of 5 game updates/versions in the last 24 hours
```

If upload size limit reached, reply with only:

```txt
- Failed
- Your Quest upload is over the total upload limit or per-file upload limit; build first and deploy only the browser output folder, then reduce large assets if needed
```

If another failure happens, tell the student to send Ben or Felipe:

```txt
- Exact error message
- The command you ran
- Shell used, either macOS/Linux or Windows PowerShell
```

## More Detail

For the full publishing reference, read:
https://agents.joinquest.com/docs/publishing.md
