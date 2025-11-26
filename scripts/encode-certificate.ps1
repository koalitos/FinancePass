Write-Host "Codificador de Certificado para GitHub Secrets`n" -ForegroundColor Cyan

$certPath = Join-Path $PSScriptRoot "..\cert\certificado-lucas.pfx"
$outputPath = Join-Path $PSScriptRoot "..\cert-base64.txt"

# Verificar se o certificado existe
if (-not (Test-Path $certPath)) {
    Write-Host "Erro: Certificado nao encontrado!" -ForegroundColor Red
    Write-Host "   Procurado em: $certPath" -ForegroundColor Yellow
    Write-Host "`nCertifique-se de que o arquivo certificado-lucas.pfx esta na pasta cert/" -ForegroundColor Yellow
    exit 1
}

try {
    # Ler o arquivo do certificado
    $certBytes = [System.IO.File]::ReadAllBytes($certPath)
    
    # Converter para base64 (sem quebras de linha)
    $base64Cert = [Convert]::ToBase64String($certBytes)
    
    # Salvar em arquivo
    [System.IO.File]::WriteAllText($outputPath, $base64Cert)
    
    Write-Host "Certificado codificado com sucesso!`n" -ForegroundColor Green
    Write-Host "Arquivo gerado: cert-base64.txt"
    Write-Host "Tamanho original: $([math]::Round($certBytes.Length / 1KB, 2)) KB"
    Write-Host "Tamanho base64: $([math]::Round($base64Cert.Length / 1KB, 2)) KB"
    Write-Host "Caracteres: $($base64Cert.Length)`n"
    
    Write-Host "Proximos passos:`n" -ForegroundColor Cyan
    Write-Host "1. Acesse: https://github.com/koalitos/FinancePass/settings/secrets/actions"
    Write-Host "2. Clique em 'New repository secret'"
    Write-Host "3. Adicione um secret:"
    Write-Host "   - Nome: WINDOWS_CERT_BASE64"
    Write-Host "   - Valor: Abra cert-base64.txt e cole TODO o conteudo"
    Write-Host "   IMPORTANTE: E uma linha MUITO longa, certifique-se de copiar TUDO!" -ForegroundColor Yellow
    Write-Host "4. Adicione outro secret:"
    Write-Host "   - Nome: WINDOWS_CERT_PASSWORD"
    Write-Host "   - Valor: A senha do seu certificado"
    Write-Host "`nIMPORTANTE: Delete o arquivo cert-base64.txt apos adicionar no GitHub!" -ForegroundColor Yellow
    Write-Host "   Comando: del cert-base64.txt`n"
    
    # Copiar para clipboard se possivel
    try {
        Set-Clipboard -Value $base64Cert
        Write-Host "Base64 copiado para a area de transferencia!" -ForegroundColor Green
        Write-Host "   Voce pode colar diretamente no GitHub Secrets`n" -ForegroundColor Green
    } catch {
        Write-Host "Dica: Abra cert-base64.txt com um editor de texto para copiar`n" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "Erro ao processar certificado: $_" -ForegroundColor Red
    exit 1
}
