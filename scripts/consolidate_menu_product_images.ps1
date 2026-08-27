$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $projectRoot "public\menu-products"
$sourceDirectories = @(
  (Join-Path $projectRoot "public\ramen-products"),
  (Join-Path $projectRoot "public\snack-products")
)

New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

$copiedFiles = foreach ($sourceDirectory in $sourceDirectories) {
  Get-ChildItem -LiteralPath $sourceDirectory -File -Filter "*.png" |
    Where-Object { $_.Name -ne "_contact-sheet.png" } |
    ForEach-Object {
      $destination = Join-Path $outputDirectory $_.Name
      Copy-Item -LiteralPath $_.FullName -Destination $destination -Force
      Get-Item -LiteralPath $destination
    }
}

$manifest = $copiedFiles |
  Sort-Object Name -Unique |
  ForEach-Object {
    [ordered]@{
      file = $_.Name
      url = "/menu-products/$($_.Name)"
    }
  }

$manifestPath = Join-Path $outputDirectory "manifest.json"
$manifest | ConvertTo-Json | Set-Content -LiteralPath $manifestPath -Encoding utf8

Write-Output "Consolidated $($manifest.Count) product images into $outputDirectory"
Write-Output $manifestPath
