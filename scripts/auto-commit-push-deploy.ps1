$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$logPath = Join-Path $repoRoot "auto-commit-push-deploy.log"

function Write-Log {
  param([string]$Message)
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  "$stamp $Message" | Tee-Object -FilePath $logPath -Append
}

Set-Location $repoRoot

$changes = git status --porcelain
if (-not $changes) {
  Write-Log "No changes found. Skipping commit, push, and deploy."
  exit 0
}

Write-Log "Changes found. Building project."
npm run build

$branch = git branch --show-current
if (-not $branch) {
  Write-Log "Could not find the current git branch."
  exit 1
}

git add -A
$stagedChanges = git diff --cached --name-only
if (-not $stagedChanges) {
  Write-Log "No staged changes after build. Skipping commit, push, and deploy."
  exit 0
}

$messageTime = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "Auto save $messageTime"

Write-Log "Pulling latest changes for $branch."
git pull --rebase origin $branch

Write-Log "Pushing $branch."
git push origin $branch

Write-Log "Deploying to Quest."
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + " --use-system-ca").Trim())
$deployOutput = (Invoke-WebRequest "https://app.joinquest.com/student-deploy/runner.js" -UseBasicParsing).Content |
  node - --api-base "https://app.joinquest.com" 2>&1

$deployOutput | Tee-Object -FilePath $logPath -Append

$resultLine = $deployOutput | Where-Object { $_ -like "QUEST_DEPLOY_RESULT *" } | Select-Object -Last 1
if ($resultLine -and $resultLine -like '*"status":"failed"*') {
  Write-Log "Quest deploy failed."
  exit 1
}

if (-not $resultLine) {
  Write-Log "Quest deploy did not print a structured result."
  exit 1
}

Write-Log "Finished."
