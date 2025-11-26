# Script para verificar assinatura digital do instalador

param(
    [string]$InstallerPath = "dist\FinancePass-Setup-*.exe"
)

Write-Host "Verificador de Assinatura Digital" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Encontrar o instalador
$installer = Get-ChildItem -Path $InstallerPath -ErrorAction SilentlyContinue | Select-Object -First 1

if (-not $installer) {
    Write-Host "Erro: Instalador nao encontrado em $InstallerPath" -ForegroundColor Red
    Write-Host "Execute o build primeiro: npm run dist:win" -ForegroundColor Yellow
    exit 1
}

Write-Host "Arquivo: $($installer.Name)" -ForegroundColor Green
Write-Host "Tamanho: $([math]::Round($installer.Length / 1MB, 2)) MB" -ForegroundColor Green
Write-Host ""

# Verificar assinatura
Write-Host "Verificando assinatura digital..." -ForegroundColor Cyan

try {
    $signature = Get-AuthenticodeSignature -FilePath $installer.FullName
    
    if ($signature.Status -eq 'Valid') {
        Write-Host "Status: VALIDO" -ForegroundColor Green
        Write-Host ""
        Write-Host "Detalhes do Certificado:" -ForegroundColor Cyan
        Write-Host "  Titular: $($signature.SignerCertificate.Subject)" -ForegroundColor White
        Write-Host "  Emissor: $($signature.SignerCertificate.Issuer)" -ForegroundColor White
        Write-Host "  Valido de: $($signature.SignerCertificate.NotBefore)" -ForegroundColor White
        Write-Host "  Valido ate: $($signature.SignerCertificate.NotAfter)" -ForegroundColor White
        Write-Host "  Algoritmo: $($signature.SignerCertificate.SignatureAlgorithm.FriendlyName)" -ForegroundColor White
        Write-Host "  Thumbprint: $($signature.SignerCertificate.Thumbprint)" -ForegroundColor White
        Write-Host ""
        Write-Host "O instalador esta assinado corretamente!" -ForegroundColor Green
        
        # Verificar se está próximo de expirar
        $daysUntilExpiry = ($signature.SignerCertificate.NotAfter - (Get-Date)).Days
        if ($daysUntilExpiry -lt 30) {
            Write-Host ""
            Write-Host "ATENCAO: Certificado expira em $daysUntilExpiry dias!" -ForegroundColor Yellow
        }
        
    } elseif ($signature.Status -eq 'NotSigned') {
        Write-Host "Status: NAO ASSINADO" -ForegroundColor Red
        Write-Host ""
        Write-Host "O instalador NAO esta assinado digitalmente!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Possiveis causas:" -ForegroundColor Yellow
        Write-Host "  1. Certificado nao foi encontrado durante o build" -ForegroundColor Yellow
        Write-Host "  2. Senha do certificado incorreta" -ForegroundColor Yellow
        Write-Host "  3. Arquivo cert/certificado-lucas.pfx nao existe" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Solucao:" -ForegroundColor Cyan
        Write-Host "  1. Execute: npm run encode-cert" -ForegroundColor White
        Write-Host "  2. Adicione os secrets no GitHub" -ForegroundColor White
        Write-Host "  3. Rebuild: npm run dist:win" -ForegroundColor White
        exit 1
        
    } else {
        Write-Host "Status: $($signature.Status)" -ForegroundColor Yellow
        Write-Host "Mensagem: $($signature.StatusMessage)" -ForegroundColor Yellow
        
        if ($signature.Status -eq 'UnknownError') {
            Write-Host ""
            Write-Host "Erro desconhecido ao verificar assinatura" -ForegroundColor Red
        }
        exit 1
    }
    
} catch {
    Write-Host "Erro ao verificar assinatura: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Verificacao concluida!" -ForegroundColor Green
