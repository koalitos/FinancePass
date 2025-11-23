# GitHub Actions Workflows

## 📦 Build and Release (`build.yml`)

Cria builds para Windows, macOS e Linux e publica uma release no GitHub.

### Como usar:

**Opção 1: Criar uma tag (recomendado)**
```bash
git tag v1.0.0
git push origin v1.0.0
```

**Opção 2: Executar manualmente**
1. Vá em: `Actions` → `Build and Release`
2. Clique em `Run workflow`
3. Selecione a branch e clique em `Run workflow`

### O que faz:
- ✅ Builda para Windows (`.exe`)
- ✅ Builda para macOS (`.dmg`)
- ✅ Builda para Linux (`.AppImage` e `.deb`)
- ✅ Cria uma release no GitHub com todos os instaladores
- ✅ Gera release notes automaticamente

---

## 🧪 CI - Build Test (`ci.yml`)

Testa o build em cada push/PR para garantir que está funcionando.

### Quando roda:
- Push na branch `main` ou `develop`
- Pull Requests para `main` ou `develop`

### O que faz:
- ✅ Instala dependências
- ✅ Builda o frontend
- ✅ Roda testes do backend
- ✅ Testa o build do Electron (sem criar instalador completo)

---

## 📋 Requisitos

Para que os workflows funcionem, você precisa:

1. **Habilitar GitHub Actions** no repositório
2. **Permissões de escrita** para o GITHUB_TOKEN:
   - Vá em: `Settings` → `Actions` → `General`
   - Em "Workflow permissions", selecione: `Read and write permissions`
   - Marque: `Allow GitHub Actions to create and approve pull requests`

---

## 🚀 Como criar uma release

1. **Atualize a versão no `package.json`:**
   ```json
   "version": "1.0.0"
   ```

2. **Commit e push:**
   ```bash
   git add package.json
   git commit -m "chore: bump version to 1.0.0"
   git push
   ```

3. **Crie e push a tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. **Aguarde o build:**
   - Vá em `Actions` e acompanhe o progresso
   - Quando terminar, a release será criada automaticamente em `Releases`

---

## 📥 Download dos builds

Após o workflow terminar:

- **Com tag (release):** Os instaladores estarão em `Releases`
- **Sem tag (CI):** Os instaladores estarão em `Actions` → workflow → `Artifacts`

---

## 🔧 Troubleshooting

### Build falha no Windows
- Verifique se o `icon.ico` existe em `assets/`
- Execute localmente: `npm run dist:win`

### Build falha no macOS
- Verifique se o `icon.icns` existe em `assets/`
- Para assinar o app, adicione certificados nas secrets

### Build falha no Linux
- Verifique se o `icon.png` existe em `assets/`
- Execute localmente: `npm run dist:linux`

### Release não é criada
- Verifique as permissões do GITHUB_TOKEN
- Certifique-se de que a tag começa com `v` (ex: `v1.0.0`)
