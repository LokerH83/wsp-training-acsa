<#
  Merge generated entity EntityMetadata XML fragments into an existing solution ZIP.
  This script is idempotent and safe for quick sandbox testing.

  Usage (PowerShell):
    cd <repo root>
    .\scripts\merge_entities_into_solution.ps1 -SolutionZip "exports\WSPTrainingManagementSystem_complete_solution.zip" -ArtifactsDir "artifacts\entities"

  Requirements: PowerShell 5+, `Expand-Archive`/`Compress-Archive` available.
  If you prefer `pac solution unpack/pack`, use that instead — this script edits the unpacked files directly.
#>

param(
  [Parameter(Mandatory=$true)][string]$SolutionZip,
  [Parameter(Mandatory=$true)][string]$ArtifactsDir
)

function AbortIfMissing($path){ if(-not (Test-Path $path)) { Write-Error "Missing: $path"; exit 1 } }

AbortIfMissing $SolutionZip
AbortIfMissing $ArtifactsDir

$pwd = Get-Location
$work = Join-Path -Path (Split-Path -Parent $SolutionZip) -ChildPath "unpacked_solution"
Remove-Item -Recurse -Force $work -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $work | Out-Null

Write-Output "Expanding $SolutionZip → $work"
Expand-Archive -Path $SolutionZip -DestinationPath $work -Force

# Support both solution structures:
# - unpacked_solution\Customizations\customizations.xml (older style)
# - unpacked_solution\customizations.xml (root customizations file)
$customFolder = Join-Path $work "Customizations"
if(Test-Path $customFolder) {
  $entitiesTarget = Join-Path $customFolder "Entities"
  if(-not (Test-Path $entitiesTarget)) { New-Item -ItemType Directory -Path $entitiesTarget | Out-Null }
  $customXmlPath = Join-Path $customFolder "customizations.xml"
} else {
  # fallback to root-level customizations.xml
  $entitiesTarget = Join-Path $work "Entities"
  if(-not (Test-Path $entitiesTarget)) { New-Item -ItemType Directory -Path $entitiesTarget | Out-Null }
  $customXmlPath = Join-Path $work "customizations.xml"
}
AbortIfMissing $customXmlPath

Write-Output "Copying entity folders from $ArtifactsDir to $entitiesTarget"
Get-ChildItem -Directory $ArtifactsDir | ForEach-Object {
  $src = $_.FullName
  $dst = Join-Path $entitiesTarget $_.Name
  if(Test-Path $dst) { Write-Output "Overwriting existing entity folder: $dst"; Remove-Item -Recurse -Force $dst }
  Copy-Item -Path $src -Destination $dst -Recurse
}


$customXml = Get-Content $customXmlPath -Raw

Write-Output "Inserting EntityMetadata fragments into customizations.xml"
Get-ChildItem -Directory $ArtifactsDir | ForEach-Object {
  $fragmentPath = Join-Path $_.FullName "EntityMetadata.xml"
  if(Test-Path $fragmentPath) {
    $fragment = Get-Content $fragmentPath -Raw
    if($customXml -match "</Entities>") {
      $customXml = $customXml -replace "</Entities>", "$fragment`r`n</Entities>"
    } else {
      # fallback: append before closing customization root element
      $customXml = $customXml -replace "</ImportExportXml>", "$fragment`r`n</ImportExportXml>"
    }
    Write-Output "Inserted fragment: $fragmentPath"
  } else { Write-Warning "No fragment found for entity folder: $($_.Name)" }
}

# Inject Flow fragments (artifacts\flows)
$flowsFolder = Join-Path (Split-Path -Parent $ArtifactsDir) "flows"
if(Test-Path $flowsFolder) {
  Write-Output "Inserting Flow fragments from $flowsFolder"
  # Ensure a Processes container exists
  if(-not ($customXml -match "</Processes>")) {
    $customXml = $customXml -replace "</ImportExportXml>", "<Processes></Processes>`r`n</ImportExportXml>"
  }
  Get-ChildItem -Path $flowsFolder -Filter *.json | ForEach-Object {
    $json = Get-Content $_.FullName -Raw
    $flowName = (ConvertFrom-Json $json).name -replace '[^a-zA-Z0-9 _\-]', ''
    $processFragment = "<Process><Name>$flowName</Name><Type>Workflow</Type><Definition><![CDATA[$json]]></Definition></Process>"
    $customXml = $customXml -replace "</Processes>", "$processFragment`r`n</Processes>"
    Write-Output "Inserted flow fragment: $($_.Name)"
  }
}

# Inject Security Role fragments (artifacts\security)
$secFolder = Join-Path (Split-Path -Parent $ArtifactsDir) "security"
if(Test-Path $secFolder) {
  Write-Output "Inserting Security Role fragments from $secFolder"
  # Ensure a Roles container exists
  if(-not ($customXml -match "</Roles>")) {
    $customXml = $customXml -replace "</ImportExportXml>", "<Roles></Roles>`r`n</ImportExportXml>"
  }
  Get-ChildItem -Path $secFolder -Filter *.xml | ForEach-Object {
    $xmlFrag = Get-Content $_.FullName -Raw
    $customXml = $customXml -replace "</Roles>", "$xmlFrag`r`n</Roles>"
    Write-Output "Inserted security fragment: $($_.Name)"
  }
}

Set-Content -Path $customXmlPath -Value $customXml -Encoding UTF8

$outZip = Join-Path (Split-Path -Parent $SolutionZip) "WSPTrainingManagementSystem_with_entities_$(Get-Date -Format yyyyMMddHHmmss).zip"
Write-Output "Repacking solution → $outZip"
if(Test-Path $outZip) { Remove-Item $outZip -Force }
Compress-Archive -Path (Join-Path $work '*') -DestinationPath $outZip -Force

Write-Output "Done. New solution package: $outZip"
