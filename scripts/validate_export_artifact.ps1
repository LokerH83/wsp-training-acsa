param(
  [string]$SolutionPath = "exports\WSPTrainingManagementSystem_complete_solution.zip"
)

$ErrorActionPreference = 'Stop'

if(-not (Test-Path $SolutionPath)) {
  Write-Error "Solution export not found: $SolutionPath"
  exit 1
}

$solution = Get-Item $SolutionPath
Write-Host "Solution export path: $solution.FullName"
Write-Host "Size (bytes): $($solution.Length)"
Write-Host "Last modified: $($solution.LastWriteTimeUtc.ToString('u'))"

try {
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [System.IO.Compression.ZipFile]::OpenRead($solution.FullName).Dispose()
  Write-Host 'Zip file is valid.'
} catch {
  Write-Error "Zip validation failed: $($_.Exception.Message)"
  exit 1
}
