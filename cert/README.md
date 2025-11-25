# 🔐 Certificados de Assinatura de Código

Esta pasta contém os certificados para assinar o aplicativo em diferentes plataformas.

## 📁 Estrutura

```
cert/
├── certificado-lucas.pfx          # Certificado Windows (quando adicionar)
├── apple-developer-cert.p12       # Certificado Apple (quando comprar)
└── README.md                      # Este arquivo
```

---

## 🪟 Windows - Certificado PFX

### Arquivo
- **Nome:** `certificado-lucas.pfx`
- **Tipo:** Code Signing Certificate
- **Uso:** Assinar executáveis `.exe` no Windows

### Configuração

O certificado é configurado no `package.json`:

```json
{
  "build": {
    "win": {
      "certificateFile": "./cert/certificado-lucas.pfx",
      "certificatePassword": "SUA_SENHA_AQUI"
    }
  }
}
```

### Variáveis de Ambiente (Recomendado)

Para não expor a senha no código, use variáveis de ambiente:

```bash
# Windows (PowerShell)
$env:CSC_LINK = "C:\caminho\para\cert\certificado-lucas.pfx"
$env:CSC_KEY_PASSWORD = "sua_senha_aqui"

# Windows (CMD)
set CSC_LINK=C:\caminho\para\cert\certificado-lucas.pfx
set CSC_KEY_PASSWORD=sua_senha_aqui

# Linux/macOS
export CSC_LINK=/caminho/para/cert/certificado-lucas.pfx
export CSC_KEY_PASSWORD=sua_senha_aqui
```

### GitHub Actions

No GitHub Actions, adicione secrets:

1. Vá em: `Settings` → `Secrets and variables` → `Actions`
2. Adicione:
   - `WINDOWS_CERTIFICATE` (conteúdo do .pfx em base64)
   - `WINDOWS_CERTIFICATE_PASSWORD` (senha do certificado)

---

## 🍎 macOS - Certificado Apple

### Requisitos

1. **Apple Developer Account** ($99/ano)
   - Acesse: https://developer.apple.com/programs/

2. **Certificados Necessários:**
   - **Developer ID Application** (para distribuição fora da App Store)
   - **Developer ID Installer** (para criar instaladores)

### Como Obter

#### 1. Criar Certificate Signing Request (CSR)

No macOS:
```bash
# Abrir Keychain Access
# Menu: Keychain Access → Certificate Assistant → Request a Certificate from a Certificate Authority
# Preencher:
# - User Email Address: seu@email.com
# - Common Name: Seu Nome
# - Request is: Saved to disk
```

#### 2. Criar Certificado no Apple Developer

1. Acesse: https://developer.apple.com/account/resources/certificates/list
2. Clique em `+` para criar novo certificado
3. Selecione: **Developer ID Application**
4. Faça upload do CSR criado
5. Baixe o certificado (`.cer`)

#### 3. Instalar no Keychain

```bash
# Duplo clique no arquivo .cer baixado
# Ele será instalado no Keychain Access
```

#### 4. Exportar como .p12

No Keychain Access:
```
1. Encontre o certificado "Developer ID Application"
2. Clique com botão direito → Export
3. Salve como: apple-developer-cert.p12
4. Defina uma senha forte
5. Copie o arquivo para esta pasta (cert/)
```

### Configuração

No `package.json`:

```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Seu Nome (TEAM_ID)",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "assets/entitlements.mac.plist",
      "entitlementsInherit": "assets/entitlements.mac.inherit.plist"
    },
    "afterSign": "scripts/notarize.js"
  }
}
```

### Variáveis de Ambiente

```bash
# macOS
export CSC_LINK=/caminho/para/cert/apple-developer-cert.p12
export CSC_KEY_PASSWORD=senha_do_certificado
export APPLE_ID=seu@email.com
export APPLE_ID_PASSWORD=senha_especifica_do_app
export APPLE_TEAM_ID=seu_team_id
```

### Notarização

Após assinar, é necessário notarizar o app:

```bash
# Será feito automaticamente pelo script scripts/notarize.js
# Requer:
# - APPLE_ID
# - APPLE_ID_PASSWORD (senha específica de app)
# - APPLE_TEAM_ID
```

---

## 🔒 Segurança

### ⚠️ IMPORTANTE

1. **NUNCA** commite certificados no Git
2. **NUNCA** commite senhas no código
3. **SEMPRE** use variáveis de ambiente
4. **SEMPRE** adicione `cert/` no `.gitignore`

### .gitignore

Certifique-se de que está no `.gitignore`:

```gitignore
# Certificados
cert/*.pfx
cert/*.p12
cert/*.cer
cert/*.pem
cert/*.key
```

---

## 📝 Checklist de Configuração

### Windows
- [ ] Certificado PFX obtido
- [ ] Senha do certificado salva em local seguro
- [ ] Variáveis de ambiente configuradas
- [ ] GitHub Secrets configurados
- [ ] Teste de build com assinatura

### macOS
- [ ] Apple Developer Account criado ($99/ano)
- [ ] CSR criado
- [ ] Certificado "Developer ID Application" obtido
- [ ] Certificado instalado no Keychain
- [ ] Certificado exportado como .p12
- [ ] Senha do certificado salva em local seguro
- [ ] App-specific password criado para notarização
- [ ] Variáveis de ambiente configuradas
- [ ] GitHub Secrets configurados
- [ ] Script de notarização configurado
- [ ] Teste de build com assinatura e notarização

---

## 🧪 Testar Assinatura

### Windows

```bash
# Build local
npm run dist:win

# Verificar assinatura
signtool verify /pa dist/FinancePass-Setup-*.exe
```

### macOS

```bash
# Build local
npm run dist:mac

# Verificar assinatura
codesign -dv --verbose=4 dist/mac/FinancePass.app

# Verificar notarização
spctl -a -vv -t install dist/FinancePass-*.dmg
```

---

## 📚 Links Úteis

### Windows
- [Code Signing no Windows](https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)
- [electron-builder - Code Signing](https://www.electron.build/code-signing)

### macOS
- [Apple Developer Program](https://developer.apple.com/programs/)
- [Code Signing Guide](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Introduction/Introduction.html)
- [Notarizing macOS Software](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [electron-builder - macOS](https://www.electron.build/configuration/mac)

---

## 💰 Custos

| Item | Custo | Renovação |
|------|-------|-----------|
| Certificado Windows | ~$100-300/ano | Anual |
| Apple Developer Program | $99/ano | Anual |
| **Total** | **~$200-400/ano** | **Anual** |

---

## 🆘 Troubleshooting

### Windows: "Certificado não encontrado"
```bash
# Verificar se o arquivo existe
dir cert\certificado-lucas.pfx

# Verificar variáveis de ambiente
echo %CSC_LINK%
echo %CSC_KEY_PASSWORD%
```

### macOS: "No identity found"
```bash
# Listar certificados instalados
security find-identity -v -p codesigning

# Deve mostrar algo como:
# 1) ABC123... "Developer ID Application: Seu Nome (TEAM_ID)"
```

### macOS: "Notarization failed"
```bash
# Verificar status da notarização
xcrun altool --notarization-history 0 -u "seu@email.com" -p "senha-app-specific"

# Ver detalhes de um erro
xcrun altool --notarization-info REQUEST_UUID -u "seu@email.com" -p "senha-app-specific"
```
