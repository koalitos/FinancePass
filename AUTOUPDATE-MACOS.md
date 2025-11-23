# 🍎 Auto-Update no macOS

## ❌ Problema

Auto-update funcionando no Windows mas não no macOS.

## 🔍 Causa

O `electron-updater` no macOS precisa de arquivos **ZIP** para funcionar, não apenas DMG.

### Diferenças por Plataforma

| Plataforma | Instalador | Auto-Update |
|------------|-----------|-------------|
| Windows | `.exe` (NSIS) | `.exe` ✅ |
| macOS | `.dmg` | `.zip` ⚠️ |
| Linux | `.AppImage` / `.deb` | `.AppImage` ✅ |

## ✅ Solução Aplicada

### 1. Configuração do package.json

Já estava correto - gerando DMG e ZIP:

```json
"mac": {
  "target": [
    { "target": "dmg", "arch": ["arm64", "x64"] },
    { "target": "zip", "arch": ["arm64", "x64"] }  // ← Necessário!
  ]
}
```

### 2. GitHub Actions - Upload Artifacts

**Arquivo:** `.github/workflows/release.yml`

**ANTES:**
```yaml
- name: Upload macOS Artifacts
  path: |
    dist/*.dmg
    dist/*.dmg.blockmap
    dist/*.yml
```

**DEPOIS:**
```yaml
- name: Upload macOS Artifacts
  path: |
    dist/*.dmg
    dist/*.dmg.blockmap
    dist/*.zip        # ← Adicionado!
    dist/*.yml
```

### 3. GitHub Actions - Release Assets

**ANTES:**
```yaml
artifacts: "release/mac/*.dmg,release/mac/*.yml"
```

**DEPOIS:**
```yaml
artifacts: "release/mac/*.dmg,release/mac/*.zip,release/mac/*.yml"
```

### 4. Electron - Configuração macOS

**Arquivo:** `electron.js`

```javascript
// Configuração específica para macOS
if (process.platform === 'darwin') {
  autoUpdater.allowDowngrade = false;
  autoUpdater.allowPrerelease = false;
}
```

---

## 📦 Arquivos Gerados

### Windows
- `FinancePass-Setup-1.0.22.exe` - Instalador
- `FinancePass-Setup-1.0.22.exe.blockmap` - Para delta updates
- `latest.yml` - Metadados para auto-update

### macOS
- `FinancePass-1.0.22-arm64.dmg` - Instalador (Apple Silicon)
- `FinancePass-1.0.22-x64.dmg` - Instalador (Intel)
- `FinancePass-1.0.22-arm64.zip` - **Auto-update** (Apple Silicon) ⚠️
- `FinancePass-1.0.22-x64.zip` - **Auto-update** (Intel) ⚠️
- `latest-mac.yml` - Metadados para auto-update

### Linux
- `FinancePass-1.0.22-x64.AppImage` - Instalador e auto-update
- `FinancePass-1.0.22-x64.deb` - Instalador Debian/Ubuntu
- `latest-linux.yml` - Metadados para auto-update

---

## 🔄 Como Funciona o Auto-Update no macOS

### 1. Detecção de Atualização
```javascript
autoUpdater.checkForUpdates()
```
- Busca `latest-mac.yml` no GitHub Releases
- Compara versão atual com versão disponível

### 2. Download
```javascript
autoUpdater.downloadUpdate()
```
- Baixa o arquivo **ZIP** (não o DMG!)
- Mostra progresso do download

### 3. Instalação
```javascript
autoUpdater.quitAndInstall()
```
- Extrai o ZIP
- Substitui o app atual
- Reinicia o app
- **Não abre instalador!** ✅

---

## 🧪 Como Testar

### 1. Criar Nova Release
```bash
npm run version:patch
git push && git push --tags
```

### 2. Aguardar Build
- GitHub Actions vai gerar os arquivos
- Verificar se o ZIP foi criado

### 3. Testar no macOS
1. Instalar versão anterior (ex: 1.0.21)
2. Abrir o app
3. Aguardar notificação de atualização
4. Clicar em "Baixar"
5. Aguardar download
6. Clicar em "Reiniciar Agora"
7. App deve atualizar sem abrir instalador

---

## ⚠️ Importante

### DMG vs ZIP

**DMG:**
- ✅ Instalação inicial
- ✅ Distribuição manual
- ❌ Auto-update

**ZIP:**
- ❌ Instalação inicial (usuário precisa extrair)
- ✅ Auto-update
- ✅ Atualização silenciosa

### Recomendação

**Para usuários:**
- Baixar e instalar o **DMG**

**Para auto-update:**
- O app baixa automaticamente o **ZIP**

---

## 🐛 Troubleshooting

### Auto-update não funciona no macOS

**Verificar:**

1. **ZIP está na release?**
   ```
   https://github.com/koalitos/FinancePass/releases/latest
   ```
   Deve ter: `FinancePass-X.X.X-arm64.zip` e `FinancePass-X.X.X-x64.zip`

2. **latest-mac.yml existe?**
   Deve estar na release com informações do ZIP

3. **Versão está correta?**
   ```bash
   # No app
   console.log(app.getVersion())
   
   # Na release
   cat latest-mac.yml
   ```

4. **Logs do auto-updater:**
   ```javascript
   autoUpdater.logger = console;
   ```
   Verificar console do Electron

### Erro: "Update not available"

- Versão instalada é >= versão da release
- Criar nova versão maior

### Erro: "Cannot find update"

- Arquivo ZIP não está na release
- Verificar GitHub Actions

### Erro: "Download failed"

- Problema de rede
- GitHub Releases offline
- Arquivo corrompido

---

## ✅ Checklist

Antes de criar release:

- [ ] `package.json` tem target `zip` para macOS
- [ ] Workflow faz upload do `*.zip`
- [ ] Workflow adiciona ZIP nos artifacts da release
- [ ] Versão foi incrementada (`npm run version:patch`)
- [ ] Tag foi criada e pushed
- [ ] GitHub Actions completou com sucesso
- [ ] Release tem os arquivos ZIP
- [ ] `latest-mac.yml` está na release

---

## 🎯 Resultado Esperado

Após aplicar essas mudanças:

- ✅ Windows: Auto-update funciona
- ✅ macOS: Auto-update funciona
- ✅ Linux: Auto-update funciona
- ✅ Instalação silenciosa (sem abrir instalador)
- ✅ Dados preservados durante atualização

---

## 📚 Referências

- [electron-updater - macOS](https://www.electron.build/auto-update#macos)
- [electron-builder - macOS targets](https://www.electron.build/configuration/mac)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)
