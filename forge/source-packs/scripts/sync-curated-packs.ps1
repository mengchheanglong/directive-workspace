$ErrorActionPreference = 'Stop'

$sourcePacksRoot = Split-Path -Parent $PSScriptRoot
$forgeRoot = Split-Path -Parent $sourcePacksRoot
$directiveWorkspaceRoot = Split-Path -Parent $forgeRoot
$workspaceRoot = Split-Path -Parent $directiveWorkspaceRoot
$legacyRoot = Join-Path $workspaceRoot 'logs/skills'

$maps = @(
  @{ from = Join-Path $sourcePacksRoot 'agency-agents'; to = Join-Path $legacyRoot 'agency-agents-curated' },
  @{ from = Join-Path $sourcePacksRoot 'arscontexta'; to = Join-Path $legacyRoot 'arscontexta-curated' }
)

New-Item -ItemType Directory -Force -Path $legacyRoot | Out-Null

foreach ($map in $maps) {
  if (-not (Test-Path $map.from)) {
    Write-Host "skip missing source: $($map.from)"
    continue
  }

  if (Test-Path $map.to) {
    Remove-Item -Recurse -Force $map.to
  }

  Write-Host "copy $($map.from) -> $($map.to)"
  Copy-Item -Recurse -Force $map.from $map.to
}

Write-Host 'sync complete.'
