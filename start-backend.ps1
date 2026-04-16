$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "unet-solutions-backend"
$npmCmd = "C:\Program Files\nodejs\npm.cmd"
$logPath = Join-Path $projectRoot "backend-startup.log"

if (-not (Test-Path $backendPath)) {
    "Backend path not found: $backendPath" | Out-File -FilePath $logPath -Append
    exit 1
}

if (-not (Test-Path $npmCmd)) {
    "npm.cmd not found at: $npmCmd" | Out-File -FilePath $logPath -Append
    exit 1
}

Start-Process -FilePath $npmCmd `
    -ArgumentList "start" `
    -WorkingDirectory $backendPath `
    -WindowStyle Hidden
