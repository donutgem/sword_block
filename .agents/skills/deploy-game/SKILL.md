---
name: deploy-game
description: Use when a Quest student asks to deploy, upload, release, or update a browser game through Quest Student Deploy. This skill explains the static hosting limits, deploy command handling, success parsing, and failure responses.
---

# Deploy A Quest Student Game

Use this skill when a student asks to deploy a game to Quest Student Deploy.

Quest Student Deploy accepts static browser builds only: HTML, CSS, JavaScript, and asset files. If the project needs multiplayer, it must use the Quest Multiplayer SDK in the browser client.

Uploads are capped at 100 MiB per file, 250 MiB total across allowed files, and
300 files per upload. The runner also uploads a latest-only admin source
snapshot zip capped at 200 MiB after excluding build output, `node_modules`,
and common cache folders.

## Before Running Deploy

Check:
- A project-specific Quest deploy token is available from the student's message, local token storage, or shell environment.
- The project builds to static browser files.
- Backend folders or server entry files are not part of the deploy output.
- Large assets are not accidentally included from `node_modules`, cache folders, or source snapshots.

## Deploy Token Handling

Resolve the Quest deploy token in this order:
1. The student's current message, including a full Quest deploy prompt or command.
2. `.env.local` in the project root, first `QUEST_DEPLOY_TOKEN`, then `STUDENT_DEPLOY_TOKEN`.
3. Existing shell environment variables, first `QUEST_DEPLOY_TOKEN`, then `STUDENT_DEPLOY_TOKEN`.
4. If no token is available, ask the student for the token for this project only.

If the student provides a token in chat or in an older full deploy command, save it before deploying:

```txt
QUEST_DEPLOY_TOKEN=<exact token>
```

Write that line to `.env.local` in the project root. If `.env.local` already
has `QUEST_DEPLOY_TOKEN` or `STUDENT_DEPLOY_TOKEN`, replace the old value with
the new token so future deploys use the latest project key. Preserve other
existing `.env.local` entries when possible. Make sure `.gitignore` contains
`.env.local` or `.env*.local` so the token is not committed or shared. Do not
print the token back in the final response.

The token is the only project identifier for deploys. Do not add, infer, fix, or validate a project slug from the repo, folder, package, or command. Old owner-wide deploy tokens are no longer valid; if the API says the token is outdated or expired, ask for the latest project deploy token.

If the student provides an older full Quest deploy prompt or command, use the command for the current shell. Preserve build-related arguments such as `--entry`, `--dir`, `--build-dir`, and `--no-build`; project names and slugs are not needed.

Do not invent placeholder tokens, versions, or URLs.

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

Run only one deploy command at a time. If the command is still running, wait for it to finish; do not start another deploy in parallel or because output is taking a while.

Run the deploy command once. Do not add `--project`; the deploy token selects the Quest project. If the runner prints `QUEST_DEPLOY_RESULT {"status":"success",...}`, do not rerun the command, even if later source-backup output is slow, noisy, or warning-only.

## Version Labels And Change Logs

Quest keeps canonical deploy URLs as `v1`, `v2`, `v3`, and so on. Do not try to
renumber canonical deploy versions.

During a normal deploy, do not wait to write release notes. Publish the game
first. Quest automatically uses the next version number as the friendly release
label, so a project with versions `v1`, `v2`, and `v3` deploys as the next
version by default.

Do not run `--release-preview` during a normal deploy unless the user
specifically asks to preview release metadata without publishing.

Do not pass `--change-kind` or `--change-summary` during a normal deploy.
Changelogs are optional metadata that can be edited after deploy.

Do not pass `--release-label` unless the user explicitly asks for a specific
friendly label, such as `3.1` or `3.1.2`.

After the deploy succeeds, make one best-effort metadata update to add a
kid-friendly changelog. Use the separate `edit-version-changelog` skill and the
metadata API. Leave the version label unchanged unless the user explicitly asked
for a specific label.

Keep that automatic changelog short and scannable: one line for one meaningful
change, or 2-3 separate lines when there are multiple meaningful
player-visible changes. Do not write a paragraph or string together every
changed file.

For that changelog, prioritize what you know from the work you just did, but do
not assume your current-chat edits are the entire deploy. Use the server diff in
the deploy result as a guardrail for files that changed before this chat or
outside your immediate work.

If that post-deploy metadata update fails, do not mark the deploy as failed. The
game is already published. Tell the student the deploy succeeded and mention
only briefly that the changelog update can be retried later.

If the student later asks to rename a release or fix the change log, do not
redeploy. Use the same `edit-version-changelog` skill.

For macOS/Linux shells:

```bash
curl -fsSL "https://app.joinquest.com/student-deploy/runner.js" | node - --api-base "https://app.joinquest.com"
```

For Windows PowerShell:

```powershell
node --version
$env:NODE_OPTIONS=(($env:NODE_OPTIONS + " --use-system-ca").Trim())
(iwr "https://app.joinquest.com/student-deploy/runner.js" -UseBasicParsing).Content | node - --api-base "https://app.joinquest.com"
```

Use `--use-system-ca` by default on Windows when Node is 22.15 or newer. This
lets Node trust certificates already trusted by Windows and prevents deploy
failures on school or company networks that inspect HTTPS. The environment
setting above lasts only for the current PowerShell session.

If Node is older than 22.15, run the deploy without `NODE_OPTIONS`. Only ask the
student to update Node if the deploy then fails with a certificate trust error.

The runner reads the token from `.env.local` or shell environment variables. If you are intentionally using a one-off token instead, pass `--token "<QUEST_DEPLOY_TOKEN>"` and preserve all characters.

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
- You've hit the limit of 10 game updates/versions in the last 24 hours
```

If upload size limit reached and `QUEST_DEPLOY_RESULT` includes `largestFiles`,
include the largest file details in the response. Reply with only:

```txt
- Failed
- Your Quest upload is over the total upload limit or per-file upload limit. Limit: 100 MiB per file, 250 MiB total. Largest files: <path> (<size>), <path> (<size>). Build first and deploy only the browser output folder, then reduce or compress large assets if needed.
```

If Node fails with `UNABLE_TO_VERIFY_LEAF_SIGNATURE` on Windows but PowerShell can download `runner.js`, do not report failure yet. This is usually local Node certificate trust on a school or company network. Check `node --version`, then automatically retry with Node's Windows certificate store when Node is 22.15 or newer:

```powershell
$env:NODE_OPTIONS=(($env:NODE_OPTIONS + " --use-system-ca").Trim())
(iwr "https://app.joinquest.com/student-deploy/runner.js" -UseBasicParsing).Content | node - --api-base "https://app.joinquest.com"
```

Do not use `NODE_TLS_REJECT_UNAUTHORIZED=0`.

If `--use-system-ca` is not recognized, update Node or export the network root certificate as a PEM file and set `NODE_EXTRA_CA_CERTS` to that file.

Do not permanently change the student's user or system environment variables without asking.

If another failure happens, tell the student to send Ben or Felipe:

```txt
- Exact error message
- The command you ran
- Shell used, either macOS/Linux or Windows PowerShell
```

## More Detail

For the full deploy reference, read:
https://agents.joinquest.com/docs/deploy.md
