---
name: delete-game-version
description: Use when a Quest student asks to delete, remove, clean up, or undo a published Quest Student Deploy game version. This skill requires listing versions, asking which version, showing the version link, warning that deletion cannot be undone, explaining that later versions shift down by one number when higher versions exist, getting explicit confirmation, and then calling the Student Deploy delete API with the student's deploy token.
---

# Delete A Quest Student Game Version

Use this skill when a student asks to delete a published Quest Student Deploy version.

Deleting a version permanently removes that version's uploaded files. This action cannot be undone.

Quest keeps version numbers sequential. When a middle version is deleted, the version list is compacted: every later version shifts down by one number. For example, if a project has v1, v2, and v3, deleting v2 makes the old v3 become the new v2. Always confirm the exact version before deleting.

## Safety Rule

Never delete immediately.

You must:
1. Find the student's Quest deploy token.
2. List the student's projects and versions.
3. Ask which project/version to delete if it is not already clear.
4. Show the exact version number and link.
5. Ask for confirmation using clear yes/no language, and say deletion cannot be undone.
6. If the version being deleted has higher versions after it, explain that version numbering is compacted after deletion: those later versions shift down by one number.
7. Delete only after the student clearly says yes.

If the student says no, maybe, stop, cancel, wait, or anything unclear, do not delete.

## Deploy Token Handling

Resolve the Quest deploy token in this order:
1. The student's current message, including a full Quest deploy prompt or command.
2. `.env.local` in the project root, first `QUEST_DEPLOY_TOKEN`, then `STUDENT_DEPLOY_TOKEN`.
3. Existing shell environment variables, first `QUEST_DEPLOY_TOKEN`, then `STUDENT_DEPLOY_TOKEN`.
4. If no token is available, ask the student for the token only.

If the student provides a token in chat, save it before using it:

```txt
QUEST_DEPLOY_TOKEN=<exact token>
```

Write that line to `.env.local` in the project root. Preserve other existing `.env.local` entries when possible. Make sure `.gitignore` contains `.env.local` or `.env*.local` so the token is not committed or shared. Do not print the token back.

Old owner-wide deploy tokens are no longer valid. If the API says the token is outdated or expired, ask for the latest project deploy token.

Do not invent placeholder tokens, project slugs, version numbers, or URLs.

## List Projects

Use this request to list projects:

```bash
curl -fsSL \
  -H "Authorization: Bearer $QUEST_DEPLOY_TOKEN" \
  "https://app.joinquest.com/api/student-deploy/projects"
```

For Windows PowerShell:

```powershell
$headers = @{ Authorization = "Bearer $env:QUEST_DEPLOY_TOKEN" }
Invoke-RestMethod -Headers $headers -Uri "https://app.joinquest.com/api/student-deploy/projects"
```

Each project includes:
- `projectSlug`
- `studentSlug`
- `displayName`
- `latestVersion`
- `versions`

If the student has multiple projects or the target is unclear, ask which project.

## Inspect A Project

Use this request to inspect one project:

```bash
curl -fsSL \
  -H "Authorization: Bearer $QUEST_DEPLOY_TOKEN" \
  "https://app.joinquest.com/api/student-deploy/projects/<projectSlug>"
```

For Windows PowerShell:

```powershell
$headers = @{ Authorization = "Bearer $env:QUEST_DEPLOY_TOKEN" }
Invoke-RestMethod -Headers $headers -Uri "https://app.joinquest.com/api/student-deploy/projects/<projectSlug>"
```

Use the returned `versions[].url` as the version link. If a URL is missing, build it as:

```txt
https://app.joinquest.com/projects/<studentSlug>/<projectSlug>/v/<versionNumber>
```

## Confirmation Prompt

Before deleting, ask a question like:

```txt
Do you want me to permanently delete version <versionNumber> of <displayName>?
Link: <versionUrl>

This action cannot be undone.
If there are versions after v<versionNumber>, version numbering will be compacted: those later versions will shift down by one number, so v3 becomes v2 if v2 is deleted.

Reply yes to delete it, or no to cancel.
```

Only continue if the student clearly replies yes.

## Delete The Version

Use the project slug and version number:

```bash
curl -fsSL -X DELETE \
  -H "Authorization: Bearer $QUEST_DEPLOY_TOKEN" \
  "https://app.joinquest.com/api/student-deploy/projects/<projectSlug>/versions/<versionNumber>"
```

For Windows PowerShell:

```powershell
$headers = @{ Authorization = "Bearer $env:QUEST_DEPLOY_TOKEN" }
Invoke-RestMethod -Method Delete -Headers $headers -Uri "https://app.joinquest.com/api/student-deploy/projects/<projectSlug>/versions/<versionNumber>"
```

## Final Reply Format

If deletion succeeds, reply with:

```txt
- Deleted
- Project: <displayName>
- Deleted version: <versionNumber>
- Latest version is now: <latestVersion>
```

Only include this extra line when there were higher versions than the one deleted:

```txt
- Version numbering was compacted; any versions after v<versionNumber> were shifted down by one number
```

If the student cancels, reply with only:

```txt
- Canceled
- No versions were deleted
```

If deletion fails, reply with:

```txt
- Failed
- <exact error message>
```
