---
name: edit-version-changelog
description: Use when a Quest student asks to edit, rename, polish, write, or fix a deployed Student Deploy version label, change type, or changelog after a game has already been deployed.
---

# Edit Version Changelog

Use this skill when a student asks to update release metadata for an already
deployed Quest Student Deploy game.

Also use this skill automatically after a successful deploy to add a
kid-friendly changelog note. That automatic post-deploy update must not change
the version label.

Do not redeploy the game just to change a version label or changelog.

## What This Skill Can Change

The Student Deploy metadata API can edit:

- `changeKind`, optionally one of `major`, `minor`, `patch`, or `bugfix`
- `changeSummary`, a short plain-language changelog note
- `releaseLabel`, such as `3`, `3.1`, or `3.1.2`, only when the user explicitly
  asks to rename or relabel the version
- `cascadeFollowingLabels`, when later friendly labels should shift forward

This changes friendly metadata only. It does not change canonical deploy URLs
like `v1`, `v2`, or `v3`.

Default behavior: leave the version label alone. Do not include `releaseLabel`
in the API body unless the user explicitly asks to change the version label.

## Token

Use the same Quest deploy token used for deploys.

Look for the token in this order:

1. The user's message.
2. `.env.local` in the project root as `QUEST_DEPLOY_TOKEN` or
   `STUDENT_DEPLOY_TOKEN`.
3. Shell environment variables with those names.

If no token is available, ask for the latest project deploy token.

## Version To Edit

If the user clearly names the version, use it.

If the user does not name a version, edit the latest deployed version.

If this skill is being used automatically after deploy, edit the version that
was just published. Use the version number and project URL from
`QUEST_DEPLOY_RESULT` or the runner's printed `Version` and `Game URL`.

If you are unsure which project or version they mean, list the available
versions first and ask a short clarifying question.

## Writing The Changelog

Prioritize what you know from the work you just did in this chat or task. The
best changelog describes real gameplay, UI, art, level, content, control, or
bug-fix changes, not file mechanics.

Do not assume the changes you personally made in the current chat are the whole
deploy. Other files may have changed before this chat or outside your immediate
edits.

Use the server diff from `QUEST_DEPLOY_RESULT.release.diffSummary`,
`QUEST_DEPLOY_PREVIEW.release.diffSummary`, or the runner's printed diff paths
as a guardrail:

- If the diff includes files that match the work you know about, use that to
  confirm the changelog is complete.
- If the diff includes extra changed files you did not work on, inspect or infer
  cautiously from those files before mentioning them.
- If a changed file path does not clearly reveal a user-facing change, do not
  invent one.
- If the diff contradicts your memory, trust the diff for which files changed
  and use your project knowledge to decide whether those changes are
  user-facing.

Write short, scannable changelog lines. Prefer concrete, user-facing changes
over a prose summary.

Good changelog lines:

- "Added a boss fight."
- "Fixed jump controls."
- "Made enemy waves faster."
- "Improved the aiming reticle."

If there are multiple meaningful player-visible changes, use 2-3 short lines,
one change per line:

```txt
Added coins to collect.
Fixed jump controls.
Improved the aiming reticle.
```

Avoid:

- Paragraphs or multiple sentences strung together.
- Long strings of changes joined by "and".
- File names, implementation details, or commit-message language.
- Vague filler like "Updated the game with the latest fixes and improvements"
  unless the actual user-facing changes are unclear.

If there are many changes, include only the 2-3 most important player-visible
ones. If the actual user-facing changes are unclear, use one simple line.

## API

Send:

```txt
PATCH /api/student-deploy/projects/:projectSlug/versions/:versionNumber/metadata
```

Example body:

```json
{
  "changeKind": "minor",
  "changeSummary": "Added a boss fight and made jumping smoother."
}
```

Only include fields you are changing.

If the user only asks you to write, edit, or polish the changelog, send only
`changeSummary` and optionally `changeKind`. Leave the existing version label
unchanged.

Only include `releaseLabel` when the user explicitly asks for a version label,
such as "make this 3.1.2" or "rename the release to 4".

When this skill is used automatically after deploy, never include
`releaseLabel`.

Use `cascadeFollowingLabels: true` only when the user wants following friendly
labels shifted. For example, if versions are labelled `1`, `2`, `3`, and `4`,
and the user changes version `3` to `2.1`, then version `4` can shift to `3`.

## Release Label Rules

Skip this section unless the user explicitly asked to change the version label.

Release labels must be numeric labels like:

- `2`
- `2.1`
- `2.1.3`

Do not set a label that is less than or equal to the previous version's friendly
label.

Do not set a label that is greater than or equal to the next version's friendly
label unless you are also using `cascadeFollowingLabels: true`.

## Response

After a successful edit, tell the student:

- which project/version was updated
- the new friendly label, if changed
- the new changelog text, if changed

Keep it short.
