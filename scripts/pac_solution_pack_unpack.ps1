<#
  Helper script to unpack a solution using `pac` and repack after adding artifacts.
  Requires: Power Platform CLI (`pac`) installed and authenticated.

  Usage:
    .\scripts\pac_solution_pack_unpack.ps1 -SolutionZip "exports\WSPTrainingManagementSystem_complete_solution.zip" -ArtifactsDir "artifacts\entities"
#>
param(
  [Parameter(Mandatory=$true)][string]$SolutionZip,
  [Parameter(Mandatory=$true)][string]$ArtifactsDir
)

Write-Output "Unpacking with pac..."
$work = Join-Path (Split-Path -Parent $SolutionZip) "pac_unpacked"
Remove-Item -Recurse -Force $work -ErrorAction SilentlyContinue
pac solution unpack --zipfile $SolutionZip --folder $work

Write-Output "Copying artifacts to $work\Customizations\Entities"
Copy-Item -Path (Join-Path $ArtifactsDir '*') -Destination (Join-Path $work 'Customizations\Entities') -Recurse -Force

Write-Output "Packing with pac..."
$out = Join-Path (Split-Path -Parent $SolutionZip) "WSPTrainingManagementSystem_with_entities_pac_$(Get-Date -Format yyyyMMddHHmmss).zip"
pac solution pack --folder $work --zipfile $out
Write-Output "Packed: $out"
