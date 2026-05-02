---
name: use-leaderboard
description: Use when a Quest student project needs an online leaderboard, shared high scores, global scores, persistent scores across devices, fastest times, fewest moves, money rankings, points rankings, or a simple Quest-managed score database. This skill uses the Quest Leaderboard SDK and forbids custom databases/backends for Quest Student Deploy.
---

# Use A Quest Leaderboard In A Student Game

Use this skill when adding a shared online leaderboard to a browser game deployed with Quest Student Deploy.

Quest Student Deploy hosts static browser builds only. Do not create or upload a backend server, database client, Supabase account, Firebase project, Express server, or custom API just to store scores. Use the Quest Leaderboard SDK from the browser client.

## SDK URLs

Use the ES module URL when possible:

```js
import QuestLeaderboard from "https://app.joinquest.com/student-deploy/quest-leaderboard.mjs";
```

Use the script/global URL only when the project is not using ES modules:

```html
<script src="https://app.joinquest.com/student-deploy/quest-leaderboard.js"></script>
```

```js
const leaderboard = await window.QuestLeaderboard.loadTop();
```

## Core API

- `QuestLeaderboard.submitScore(options)`
- `QuestLeaderboard.loadTop(options)`
- `QuestLeaderboard.getPlayerKey(options)`
- `QuestLeaderboard.resetPlayerKey(options)`

Common options:
- `playerName`: recommended when submitting; defaults to `"Player"` if omitted
- `score`: required when submitting; must be a finite number
- `displayScore`: optional formatted score text, such as `"1:23.45"` or `"$1.2M"`
- `leaderboardKey`: optional; defaults to `"default"`
- `order`: optional; `"desc"` for high scores, `"asc"` for fastest times or fewest moves
- `metadata`: optional small JSON value
- `leaderboardName`: optional display name for the board
- `scoreLabel`: optional label such as `"points"`, `"seconds"`, or `"coins"`
- `apiBase`: optional; use for local testing
- `project`: optional; use for local testing outside a deployed Quest URL

Prefer a numeric `score`. Use `displayScore` for formatted text shown in the UI.
Quest can recover from simple formatted score strings like `"1,200 pts"`,
`"$1.2M"`, or `"1:23.45"`, but numeric values are clearer.

The SDK also accepts a few common aliases when adapting existing code:
- `submit` or `submitHighScore` for `submitScore`
- `loadScores` or `getLeaderboard` for `loadTop`
- `boardKey` or `key` for `leaderboardKey`
- `displayName`, `name`, or `nickname` for `playerName`
- `points`, `coins`, `money`, `seconds`, `time`, or `moves` for `score`
- `lowerIsBetter: true` or `sort: "lowest"` for `order: "asc"`

## Submit A High Score

```js
await QuestLeaderboard.submitScore({
  playerName: "Ari",
  score: 1200,
});
```

## Load The Top Scores

```js
const result = await QuestLeaderboard.loadTop({ limit: 25 });

for (const entry of result.entries) {
  console.log(`${entry.rank}. ${entry.playerName}: ${entry.displayScore || entry.score}`);
}
```

If `limit` is omitted, Quest returns up to 25 entries.

## Suggested Default UI Pattern

These are good defaults, but adjust them if the student asks for a different design:
- Show a short top list, usually 10 to 25 entries.
- Highlight the current player's row if it appears in the top list.
- If `result.playerEntry` exists and `result.playerInTopEntries` is false, show the player's row separately under the top list.
- Use `entry.displayScore || entry.score` when rendering scores.
- Put the leaderboard in an end-game screen, modal, or side panel so gameplay is not blocked.
- If the leaderboard cannot load, show a small unavailable state and keep the game playable.
- Submit scores at game end or level completion, then use `result.submittedEntry.rank` to show the player's rank.

```js
const result = await QuestLeaderboard.loadTop({ limit: 25 });

renderRows(result.entries);

if (result.playerEntry && !result.playerInTopEntries) {
  renderPinnedPlayerRow(result.playerEntry);
}
```

## Fastest Time Or Fewest Moves

Use `order: "asc"` when lower scores are better. Keep the same `leaderboardKey` and `order` every time.

```js
await QuestLeaderboard.submitScore({
  leaderboardKey: "fastest-time",
  leaderboardName: "Fastest Times",
  scoreLabel: "seconds",
  playerName: "Ari",
  score: elapsedSeconds,
  displayScore: formatTime(elapsedSeconds),
  order: "asc",
});
```

```js
const result = await QuestLeaderboard.loadTop({
  leaderboardKey: "fastest-time",
  order: "asc",
});
```

## Multiple Leaderboards

Use separate `leaderboardKey` values for separate boards:

```js
await QuestLeaderboard.submitScore({
  leaderboardKey: "coins",
  playerName,
  score: coinsCollected,
});

await QuestLeaderboard.submitScore({
  leaderboardKey: "survival-time",
  playerName,
  score: secondsAlive,
});
```

Good keys: `"default"`, `"coins"`, `"fastest-time"`, `"fewest-moves"`, `"level-1"`.

## Local Development

When testing against a local Quest app:

```js
apiBase: "http://localhost:3000"
```

When testing outside a deployed Quest project URL, pass the project reference:

```js
await QuestLeaderboard.submitScore({
  apiBase: "https://app.joinquest.com",
  project: {
    studentSlug: "student-slug",
    projectSlug: "project-slug",
    versionNumber: 1,
  },
  playerName: "Ari",
  score: 1200,
});
```

Do not invent project values. Use the values from the Quest game URL or ask the student.

## Important Limits

- Leaderboards are project-wide across deploy versions.
- The SDK stores a browser player key in `localStorage` so a player keeps one best entry on the same device.
- Leaderboard boards may cap the number of unique players; existing players can still update their saved best score.
- Ranking always uses the numeric `score`; use `displayScore` only for formatted text shown in the UI.
- Scores are client-submitted and should be treated as friendly classroom/game data, not cheat-proof records.
- Metadata must be small JSON and is optional. Do not store large saves, images, secrets, passwords, or private information.
- Do not submit scores every frame. Submit only when a round ends, a level completes, or the player beats a best score.

## What Not To Do

Do not ask AI to:
- Build a Node backend for scores.
- Upload a custom API server with the game.
- Put database credentials in browser code.
- Create a Supabase, Firebase, or other database account for a basic leaderboard.
- Use multiplayer shared state as persistent leaderboard storage.
- Use `localStorage` when the student asks for a shared online leaderboard.

## More Detail

For the full reference, read:
https://agents.joinquest.com/docs/leaderboard-sdk.md
