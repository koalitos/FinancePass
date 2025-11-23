@echo off
echo =========================================
echo FinancePass - Criar Nova Release
echo =========================================
echo.

:: Verificar se tem mudanças não commitadas
git diff --quiet
if errorlevel 1 (
    echo [AVISO] Voce tem mudancas nao commitadas!
    echo.
    choice /C SN /M "Deseja commitar as mudancas antes de continuar?"
    if errorlevel 2 goto :end
    if errorlevel 1 (
        set /p commit_msg="Digite a mensagem do commit: "
        git add .
        git commit -m "!commit_msg!"
    )
)

echo.
echo Escolha o tipo de versao:
echo   1. Patch (1.0.8 -^> 1.0.9) - Correcoes de bugs
echo   2. Minor (1.0.8 -^> 1.1.0) - Novas funcionalidades
echo   3. Major (1.0.8 -^> 2.0.0) - Mudancas grandes
echo.
choice /C 123 /N /M "Escolha (1/2/3): "

if errorlevel 3 set VERSION_TYPE=major
if errorlevel 2 set VERSION_TYPE=minor
if errorlevel 1 set VERSION_TYPE=patch

echo.
echo [1/4] Atualizando versao (%VERSION_TYPE%)...
node scripts/bump-version.js %VERSION_TYPE%
if errorlevel 1 (
    echo ERRO ao atualizar versao
    pause
    exit /b 1
)

echo.
echo [2/4] Commitando mudancas...
for /f "tokens=*" %%a in ('node -p "require('./package.json').version"') do set NEW_VERSION=%%a
git add package.json frontend/src/config/version.js
git commit -m "v%NEW_VERSION%"
if errorlevel 1 (
    echo ERRO ao commitar
    pause
    exit /b 1
)

echo.
echo [3/4] Criando tag v%NEW_VERSION%...
git tag v%NEW_VERSION%
if errorlevel 1 (
    echo ERRO ao criar tag
    pause
    exit /b 1
)

echo.
echo [4/4] Fazendo push...
git push origin main
git push origin v%NEW_VERSION%
if errorlevel 1 (
    echo ERRO ao fazer push
    pause
    exit /b 1
)

echo.
echo =========================================
echo RELEASE CRIADA COM SUCESSO!
echo =========================================
echo.
echo Versao: v%NEW_VERSION%
echo.
echo A pipeline do GitHub Actions vai iniciar automaticamente.
echo Acesse: https://github.com/koalitos/FinancePass/actions
echo.

:end
pause
