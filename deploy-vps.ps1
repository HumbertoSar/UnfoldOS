$ErrorActionPreference = "Stop"

$VPS_IP = "2.24.108.121"
$VPS_USER = "root"
$APP_DIR = "/opt/diagnostico-canva"
$APP_PORT = 8788
$SUBDOMAIN = "unfold.mvpsardenberg.cloud"
$APP_NAME = "diagnostico-canva"

Write-Host "Deploy para VPS - $APP_NAME" -ForegroundColor Cyan
Write-Host ""

# 1. BUILD
Write-Host "Step 1: Build local..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Erro no build" -ForegroundColor Red; exit 1 }
Write-Host "OK - Build concluido" -ForegroundColor Green
Write-Host ""

# 2. SCRIPT DE SETUP NA VPS
Write-Host "Step 2: Preparando script de deploy..." -ForegroundColor Yellow
$SCRIPT_CONTENT = @'
#!/bin/bash
set -e
APP_DIR="/opt/diagnostico-canva"
APP_PORT=8788
SUBDOMAIN="unfold.mvpsardenberg.cloud"
APP_NAME="diagnostico-canva"

cd $APP_DIR
echo "Instalando dependencias..."
# npm ci COMPLETO: tsx e devDependency e roda em runtime; --omit=dev quebra o boot.
npm ci

echo "Instalando PM2..."
npm install -g pm2 2>/dev/null || true

echo "Criando wrapper de boot (start.sh)..."
cat > start.sh << 'WRAP'
#!/bin/bash
cd /opt/diagnostico-canva
exec node_modules/.bin/tsx server/index.ts
WRAP
chmod +x start.sh

pm2 delete $APP_NAME 2>/dev/null || true
pm2 start ./start.sh --name $APP_NAME
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo "Aguardando app..."
sleep 2
RESPONSE=$(curl -s http://127.0.0.1:$APP_PORT/api/health || echo "error")
if echo "$RESPONSE" | grep -q "ok"; then echo "OK - App respondendo"; else echo "AVISO - veja pm2 logs $APP_NAME"; fi

echo "Atualizando Caddyfile..."
if [ -f /etc/caddy/Caddyfile ]; then cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup; fi
echo "Removendo dominio antigo (canva) do Caddyfile, se existir..."
if [ -f /etc/caddy/Caddyfile ]; then
  awk 'skip==1{ if($0 ~ /\}/) skip=0; next } /^canva\.mvpsardenberg\.cloud[[:space:]]*\{/{ skip=1; next } { print }' /etc/caddy/Caddyfile > /etc/caddy/Caddyfile.tmp && mv /etc/caddy/Caddyfile.tmp /etc/caddy/Caddyfile
fi
if ! grep -q "^$SUBDOMAIN" /etc/caddy/Caddyfile; then
cat >> /etc/caddy/Caddyfile << 'BLOCK'

unfold.mvpsardenberg.cloud {
    reverse_proxy 127.0.0.1:8788
}
BLOCK
fi
systemctl reload caddy
echo ""
echo "Sucesso! Acesse: https://unfold.mvpsardenberg.cloud"
'@
# Grava LF + sem BOM: Out-File -Encoding UTF8 (PS 5.1) põe BOM e CRLF, e o bash da VPS quebra.
[System.IO.File]::WriteAllText("$env:TEMP\deploy-canva.sh", ($SCRIPT_CONTENT -replace "`r`n", "`n"), (New-Object System.Text.UTF8Encoding $false))
Write-Host "OK - Script pronto" -ForegroundColor Green
Write-Host ""

# 3. PREPARAR VPS
Write-Host "Step 3: Preparando VPS..." -ForegroundColor Yellow
ssh -q "${VPS_USER}@${VPS_IP}" "mkdir -p ${APP_DIR}"
Write-Host "OK" -ForegroundColor Green
Write-Host ""

# 4. TRANSFERIR (src/ obrigatorio: tsx le o TS em runtime)
Write-Host "Step 4: Transferindo arquivos..." -ForegroundColor Yellow
@("dist", "server", "src", "package.json", "package-lock.json", ".env") | ForEach-Object {
    if (Test-Path $_) { Write-Host "  - $_"; scp -r -q $_ "${VPS_USER}@${VPS_IP}:${APP_DIR}/" }
}
Write-Host "OK - Arquivos enviados" -ForegroundColor Green
Write-Host ""

# 5. SETUP NA VPS
# Envia o .sh por scp (byte-a-byte, preserva LF/sem BOM) e roda la.
# NAO usar "Get-Content | ssh bash": o pipe do PowerShell re-encoda em CRLF + BOM e o bash quebra.
Write-Host "Step 5: Executando setup na VPS..." -ForegroundColor Yellow
scp -q "$env:TEMP\deploy-canva.sh" "${VPS_USER}@${VPS_IP}:/tmp/deploy-canva.sh"
ssh "${VPS_USER}@${VPS_IP}" "bash /tmp/deploy-canva.sh"

Write-Host ""
Write-Host "Deploy concluido!" -ForegroundColor Green
Write-Host "URL: https://unfold.mvpsardenberg.cloud" -ForegroundColor Cyan
