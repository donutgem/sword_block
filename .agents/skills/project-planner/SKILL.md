---
name: project-planner
description: Use when the user asks for a new game, web game, app, simulator, tool, large feature, major redesign, vague change, or request that may require multiple files or important product/gameplay decisions. Create or update plan.md, ask one non-technical high-impact question at a time, record answers across chats, then build when the plan is ready.
---

# Project Planner

Use this skill before coding when the user request is big, vague, inspired by
a known game or genre, or likely to change several files.

Quest projects are static browser web games. Default to JavaScript
and Three.js unless the existing project or the user says otherwise.

If `plan.md` already exists and its `Status` is `Collecting answers`, read it
before doing anything else. If the users's latest message looks like the answer
to the current question, update `plan.md`, then ask the next unanswered question
or mark the plan `Ready to build`.

If the users's message looks like a different request, answer that request
normally and briefly remind them that the unfinished plan is still waiting.

## Goal

Help the user describe what they want without asking technical architecture
questions. Convert their answers into the technical plan yourself.

## Start Question Mode

Before making code changes:
1. Inspect the current project shape briefly.
2. Create or update `plan.md`.
3. Set `Status` to `Collecting answers`.
4. Add the goal in plain language.
5. Add only the questions needed to plan the first version.
6. Ask only the first unanswered question.

Keep explanations short. The chat response should contain
only one question and its choices.

Keep the question and choices short. Write at about a 4th or 5th grade reading
level.

## plan.md Format

Use this structure:

```md
# Plan

## Goal

One short paragraph describing what the user wants.

## Status

Collecting answers

## Questions

None yet.

## Answers

None yet.

## Reference Notes

None yet.

## Risky For First Version

None yet.

## Question Notes

None yet.

## Decisions

None yet.

## Build Plan

Waiting for answers.
```

As the user answers, update `Questions`, `Answers`, `Reference Notes`,
`Risky For First Version`, `Question Notes`, and `Decisions`. Keep the file
useful across multiple chats.

When enough information is known, change:

```md
## Status

Ready to build
```

Then write the build plan and start implementation.

## Asking Questions

Ask one question at a time. Make each question high-impact and non-technical.
There is no fixed number of questions. Ask as many as needed, but only one at a
time. Stop when the first build plan is clear enough.

Use A/B/C/D choices. `D` should usually be
`Something else - type your own answer`.

Question text rules:
- Use short sentences.
- Use simple words.
- Keep each answer choice to one short line when possible.
- Use `D. Something else - type your own answer` for open answers.
- If the user can choose more than one answer, include this on its own
  short line: `You can write more than one letter if you want.`
- Do not include the multi-letter line when the question needs exactly one
  answer, such as choosing a camera style.
- Make A, B, and C meaningfully different decisions.
- Do not offer two choices that both mean skipping the same feature for now.
- For optional risky features, use choices that represent different real paths,
  such as leaving it out, adding a simpler version, or adding a fuller version,
  only when those are truly different technical paths.
- For scope choices, choose the right scope axis for that game or genre. Do not
  default to map size unless map size is truly the main decision.
- Before asking a scope question, think through whether the choices are actually
  different difficulty levels. Write the reason for the question in
  `Question Notes` in `plan.md`.
- Do not create fake difficulty ladders. If the first working version of a
  system is the hard part, do not imply that a small number is easy and a larger
  number is the only hard version.
- Do not split choices by quantity when the real risk is building the system at
  all. Ask whether to include that system now, use a simpler version, or save it
  for later.
- Give quick context about how easy each option is to get working, how long it
  may take, and how likely it is to have bugs.
- Do not describe bigger options as more fun, cooler, or better. Say plainly
  that bigger options usually take longer, break more often, and need more
  fixing.
- Give the smallest option a clear upside, such as fastest to build or easiest
  to fix.
- Warn next to any first-version feature that is likely to break or take a lot
  of fixing.
- For risky features, prefer wording like `harder to get working`,
  `may need fixes`, or `better to add later`.
- Add a little extra explaining text only when the choice would be confusing
  without it.
- Always include: `If this question is confusing, ask me.`

Ask about the most important first-version slice. The question should come from
the specific request, research notes, and risk notes, not from a template.

After the user answers:
1. Update `plan.md`.
2. Decide if another answer is needed.
3. Ask the next question only, or mark the plan ready and build.

## First Version Scope Filter

Before asking questions, look for features that are not required for the first
playable version and are likely to break or need lots of manual fixing.

Write them in `Risky For First Version` in `plan.md`.

Also write brief `Question Notes` explaining which first question matters most
and why. Use those notes to avoid template questions.

Common risky first-version feature types:
- Systems that control characters automatically.
- Systems that must navigate around obstacles.
- Systems with complex movement, collision, or physics.
- Systems that sync state between people or devices.
- Systems that need a large world or lots of content before they are fun.
- Systems with many moving objects at once.
- Systems that generate content automatically.
- Systems with many rules, items, upgrades, quests, or states.
- Systems that require several different input styles at once.

When asking about these, make the safer option clear. It is okay to suggest
adding risky features later after the first version works.

For any complex system, identify the real hard part. Often the first working
version of a behavior, mechanic, or system is the risky step. Adding more copies
or more content after the system works may be much easier than creating the
system.

Do not remove required genre pieces. Keep required pieces simple in the first
version.

## Known Game Or Genre Requests

If the user asks for a game like a known game, genre, character, movie, show,
sport, or real-world activity, look it up or research what it means before
planning. Do not rely on a shallow guess or memory.

Before asking questions, understand the main pattern and write short
`Reference Notes` in `plan.md`.

Capture:
- Gameplay flow.
- Camera style.
- Player movement.
- Normal control style and input pattern.
- Level shape.
- Round, wave, or level structure.
- Obstacles and hazards.
- Enemies or pressure.
- Collectibles and rewards.
- Win and lose conditions.
- What the first tiny playable version needs.

If the reference has multiple common formats, ask that question first. Do not
reuse a generic size question when the named game or genre has a more important
scope decision.

Assume the project is played on a computer with mouse and keyboard unless the
user asks for another input style. If the normal controls or input style are
unclear, research how similar games usually control before asking the user.
If there is still real ambiguity for mouse and keyboard play, ask one short,
non-technical controls question before building.

Make inspired-by versions. Do not copy exact protected characters, names, art,
music, levels, or logos unless the user owns them or has permission.

## Good Question Topics

Ask about:
- The main thing the player does.
- The size of the first version.
- Which features belong in the first version and which can wait.
- The number of characters, enemies, objects, or moving things on screen.
- The mood or feel of the game.
- Win and lose conditions.
- Single-player or multiplayer.
- Saving progress, high scores, or settings.
- Desktop keyboard controls, mobile touch controls, or both.

## Avoid Technical Questions

Do not ask the user to choose:
- Three.js architecture.
- ECS versus classes.
- Physics engine details.
- Shader details.
- Build tools.
- Storage APIs.
- Multiplayer networking design.
- File structure.

Make those technical decisions from the answers and from `AGENTS.md`.

## Small Edits

Do not use Question Mode for obvious small edits, such as:
- Change a color.
- Make the player faster or slower.
- Rename text.
- Fix one clear bug.
- Add one simple object.

Make those edits directly and verify them.

## Special Quest Features

If the plan includes multiplayer, use the `make-game-multiplayer` skill before
implementing multiplayer.

If the plan includes deploying, use the `deploy-game` skill.

If the plan includes saved progress, high scores, settings, save slots,
`localStorage`, or `sessionStorage`, use the `use-local-storage` skill.
