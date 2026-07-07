<#
Verify GitHub Actions setup for this repo and trigger the CI run.

Usage: run from repo root in PowerShell (requires Git and GitHub CLI `gh` for full automation).

What it does:
- Confirms local & remote branch `add-unpacked-solution` existence
- Confirms workflow triggers on push to `add-unpacked-solution`
- Lists required secrets and offers to set any missing using `gh secret set`
- If git available: creates an empty commit on the branch and pushes to trigger CI
- Polls the latest workflow run for the branch and reports status, downloads `packed-solution` artifact if present

Note: the script will prompt for secret values if missing. Secrets are sent to GitHub via `gh secret set`.
#>

param(
  [string]$Repo = 'LokerH83/wsp-training-acsa',
  [string]$Branch = 'add-unpacked-solution',
  [int]$PollSeconds = 10,
  [int]$TimeoutMinutes = 20
)

function Check-Command($name){ return (Get-Command $name -ErrorAction SilentlyContinue) -ne $null }

Write-Output "Repository: $Repo"

if(-not (Test-Path .git)){
  Write-Warning "This script expects to be run from the repository root (contains .git)."
}

# 1) Branch checks
if(Check-Command 'git'){
  Write-Output "Checking local branch..."
  $local = git rev-parse --verify $Branch 2>$null
  if($LASTEXITCODE -eq 0){ Write-Output "Local branch exists: $Branch" } else { Write-Warning "Local branch not found: $Branch" }

  Write-Output "Checking remote branch..."
  git fetch origin --prune
  $remote = git ls-remote --heads origin $Branch
  if($remote){ Write-Output "Remote branch exists: origin/$Branch" } else { Write-Warning "Remote branch origin/$Branch not found" }
} else {
  Write-Warning "git CLI not found. You can still proceed manually via GitHub Desktop."
}

# 2) Workflow trigger check
$wf = '.github/workflows/pack_and_inject.yml'
if(Test-Path $wf){
  $content = Get-Content $wf -Raw
  if($content -match 'add-unpacked-solution'){
    Write-Output "Workflow triggers on push to $Branch (confirmed)"
  } else { Write-Warning "Workflow file exists but does not reference branch '$Branch' in its trigger." }
} else { Write-Warning "Workflow file not found: $wf" }

# 3) Check GitHub CLI availability for secrets & runs
if(-not (Check-Command 'gh')){
  Write-Warning "GitHub CLI 'gh' not found. Install it for automated secret checks and run control: https://cli.github.com/"
  Write-Output "You can still add secrets via GitHub UI: Settings → Secrets and variables → Actions → New repository secret"
  exit 0
}

# 3a) List existing secrets
Write-Output "Listing repository secrets (requires gh auth)..."
try{
  $seclist = gh secret list --repo $Repo 2>$null | ForEach-Object { ($_ -split '\t')[0] }
} catch{
  Write-Warning "Failed to query secrets via gh. Ensure gh is authenticated (gh auth login) and you have repo access."
  exit 1
}

$required = @('PP_TENANT_ID','PP_CLIENT_ID','PP_CLIENT_SECRET','PP_ENVIRONMENT')
$missing = @()
foreach($s in $required){ if(-not ($seclist -contains $s)){ $missing += $s } }

if($missing.Count -eq 0){ Write-Output "All required secrets present." } else { Write-Warning "Missing secrets: $($missing -join ', ')" }

# 4) Offer to set missing secrets
foreach($s in $missing){
  Write-Host "Enter value for secret $s (leave blank to skip): " -NoNewline
  $val = Read-Host -AsSecureString
  if($val.Length -gt 0){
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($val)
    $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    Write-Output "Setting secret $s via gh..."
    gh secret set $s --body "$plain" --repo $Repo
    Write-Output "Secret $s set."
  } else { Write-Warning "Skipped $s" }
}

# Refresh secrets list
$seclist = gh secret list --repo $Repo 2>$null | ForEach-Object { ($_ -split '\t')[0] }
$missing = @(); foreach($s in $required){ if(-not ($seclist -contains $s)){ $missing += $s } }
if($missing.Count -gt 0){ Write-Warning "Still missing secrets: $($missing -join ', '). Add them in GitHub UI or via gh and re-run." }

# 5) Trigger workflow by pushing an empty commit to the branch (if git available)
if(Check-Command 'git'){
  Write-Output "Preparing to create an empty commit on branch $Branch and push to origin..."
  git fetch origin
  $exists = (git rev-parse --verify $Branch 2>$null) -ne $null
  if(-not $exists){
    Write-Warning "Local branch $Branch does not exist. Attempting to create tracking branch from origin/$Branch if present..."
    git checkout -b $Branch origin/$Branch 2>$null
    if($LASTEXITCODE -ne 0){ Write-Warning "Could not create local branch $Branch. Create it manually or use GitHub Desktop."; exit 1 }
  } else { git checkout $Branch }

  git commit --allow-empty -m "ci: trigger pack_and_inject" || Write-Output "Empty commit skipped or failed"
  git push origin $Branch
  if($LASTEXITCODE -eq 0){ Write-Output "Pushed empty commit to origin/$Branch — CI should trigger." } else { Write-Warning "Push failed. Resolve git issues or push via GitHub Desktop." }
} else {
  Write-Warning "git not available locally. Please push or re-run the workflow using GitHub Desktop or the GitHub Actions UI." }

# 6) Poll for latest run and report
Write-Output "Polling for the latest workflow run on branch $Branch..."
$deadline = (Get-Date).AddMinutes($TimeoutMinutes)
while((Get-Date) -lt $deadline){
  Start-Sleep -Seconds $PollSeconds
  $runs = gh run list --repo $Repo --workflow pack_and_inject.yml --branch $Branch -L 5 2>$null
  if(-not $runs){ Write-Output "No runs found yet. Waiting..."; continue }
  $first = gh run list --repo $Repo --workflow pack_and_inject.yml --branch $Branch -L 1 --json databaseId,conclusion,status -q '.[0]'
  if(-not $first){ Write-Output "No JSON-friendly gh version available. Use 'gh run list --limit 1' in the repo UI to inspect runs."; break }
  $runObj = $first | ConvertFrom-Json
  $runId = $runObj.databaseId
  $status = $runObj.status
  $conclusion = $runObj.conclusion
  Write-Output "Latest run: id=$runId status=$status conclusion=$conclusion"
  if($status -eq 'completed' -or $status -eq 'completed'){
    break
  }
}

if(-not $runId){ Write-Warning "No run ID found; check Actions page manually."; exit 0 }

Write-Output "Fetching run details and logs for run $runId..."
gh run view $runId --repo $Repo --log || Write-Warning "Failed to fetch logs via gh run view"

# Try to download artifact named 'packed-solution'
Write-Output "Attempting to download artifact 'packed-solution' for run $runId to ./exports/artifacts_$runId.zip"
try{ gh run download $runId --repo $Repo --name packed-solution --dir exports --archive --output "exports/packed-solution_$runId.zip" ; Write-Output "Downloaded artifact to exports/packed-solution_$runId.zip" } catch { Write-Warning "Artifact download failed or artifact not present." }

Write-Output "Script complete. Review the Actions run logs and import results in GitHub Actions or Power Platform Maker portal."
