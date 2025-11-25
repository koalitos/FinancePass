# Script para converter certificado .pfx para Base64
# Necessário para configurar como secret no GitHub Actions

$certPath = "cert/certificado-lucas.pfx"
$outputPath = "cert-base64.txt"

if (Test-Path $certPath) {
    Write-Host "Convertendo certificado para Base64..." -ForegroundColor Yellow
    
    $bytes = [IO.File]::ReadAllBytes($certPath)
    $base64 = [Convert]::ToBase64String($bytes)
    
    Set-Content -Path $outputPath -Value $base64
    
    Write-Host ""
    Write-Host "✅ Certificado convertido com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Arquivo gerado: $outputPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "PRÓXIMOS PASSOS:" -ForegroundColor Yellow
    Write-Host "1. Abra o arquivo: $outputPath"
    Write-Host "2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)"
    Write-Host "3. Vá para: https://github.com/koalitos/FinancePass/settings/secrets/actions"
    Write-Host "4. Clique em 'New repository secret'"
    Write-Host "5. Nome: WINDOWS_CERT_BASE64"
    Write-Host "6. Cole o conteúdo copiado"
    Write-Host "7. Clique em 'Add secret'"
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Depois de copiar, DELETE o arquivo cert-base64.txt" -ForegroundColor Red
    Write-Host ""
} else {
    Write-Host "❌ Certificado não encontrado em: $certPath" -ForegroundColor Red
    Write-Host "Certifique-se de que o arquivo existe." -ForegroundColor Yellow
}
