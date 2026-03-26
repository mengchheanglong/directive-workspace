$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$targets = @('agent-orchestrator','agency-agents','arscontexta')

Write-Host "Tooling root: $root"
Write-Host ""

foreach ($name in $targets) {
  $path = Join-Path $root $name
  if (-not (Test-Path $path)) {
    Write-Host "[MISSING] $name"
    continue
  }

  $readme = Join-Path $path 'README.md'
  $hasReadme = Test-Path $readme
  $topCount = (Get-ChildItem -Path $path -Force | Measure-Object).Count

  Write-Host "[$name]"
  Write-Host "  path: $path"
  Write-Host "  readme: $hasReadme"
  Write-Host "  top-level entries: $topCount"
}
