# 🎉 FinancePass v1.0.0

> **Gerenciador Financeiro e de Senhas - 100% Gratuito e Open Source**

Retome o controle dos seus dados financeiros e senhas. Tudo armazenado localmente no seu computador, com criptografia AES-256 e zero telemetria.

---

## 📥 Download

Escolha o instalador para seu sistema operacional:

### 🪟 Windows
- **[FinancePass-Setup-1.0.0.exe](link)** (Recomendado)
- Requisitos: Windows 10/11 (64-bit)
- Tamanho: ~150 MB

### 🍎 macOS
- **[FinancePass-1.0.0-arm64.dmg](link)** (Apple Silicon - M1/M2/M3)
- **[FinancePass-1.0.0-x64.dmg](link)** (Intel)
- Requisitos: macOS 10.15 ou superior
- Tamanho: ~150 MB

### 🐧 Linux
- **[FinancePass-1.0.0-x64.AppImage](link)** (Universal)
- **[FinancePass-1.0.0-x64.deb](link)** (Debian/Ubuntu)
- Requisitos: Ubuntu 20.04+ ou equivalente
- Tamanho: ~150 MB

---

## ✨ Novidades desta versão

### 🎯 Recursos Principais

#### 💰 Gestão Financeira Completa
- ✅ Controle de receitas e despesas
- ✅ Gestão de dívidas (quem te deve e quem você deve)
- ✅ Parcelamentos e compras a prazo
- ✅ Contas a pagar recorrentes
- ✅ Dashboard com visão geral do mês
- ✅ Relatórios detalhados por pessoa
- ✅ Exportação de relatórios em PDF

#### 🔐 Gerenciador de Senhas
- ✅ Armazenamento seguro com criptografia AES-256
- ✅ Organização por pastas
- ✅ Gerador de senhas fortes
- ✅ Proteção com senha mestra
- ✅ Busca rápida

#### 👥 Gestão de Pessoas
- ✅ Cadastro de contatos
- ✅ Histórico de transações por pessoa
- ✅ Relatórios individuais

#### 🌐 Recursos Adicionais
- ✅ Interface em Português e Inglês
- ✅ Modo escuro/claro
- ✅ Sincronização local via rede (sem nuvem)
- ✅ Backup simples (um único arquivo)
- ✅ Funciona 100% offline

---

## 🔒 Segurança e Privacidade

### Por que o FinancePass é diferente?

| ❌ Apps Comerciais | ✅ FinancePass |
|-------------------|----------------|
| Dados em servidores de terceiros | Dados apenas no seu computador |
| Análise de hábitos de consumo | Zero telemetria ou rastreamento |
| Venda de dados para publicidade | 100% gratuito e open source |
| Assinaturas mensais caras | Sempre gratuito |
| Dependência de internet | Funciona completamente offline |

### 🛡️ Recursos de Segurança
- 🔒 Criptografia AES-256 para senhas
- 💾 Dados armazenados localmente (SQLite)
- 🚫 Sem conexão com servidores externos
- 🔐 Você tem controle total dos seus dados
- 📂 Backup simples (apenas um arquivo)

---

## 🚀 Instalação

### Windows
1. Baixe o arquivo `.exe`
2. Execute o instalador
3. Siga as instruções na tela
4. Pronto! O FinancePass estará no menu Iniciar

### macOS
1. Baixe o arquivo `.dmg`
2. Abra o arquivo
3. Arraste o FinancePass para a pasta Aplicativos
4. Na primeira execução, vá em Preferências do Sistema → Segurança e clique em "Abrir mesmo assim"

### Linux (AppImage)
1. Baixe o arquivo `.AppImage`
2. Torne-o executável: `chmod +x FinancePass-1.0.0-x64.AppImage`
3. Execute: `./FinancePass-1.0.0-x64.AppImage`

### Linux (Debian/Ubuntu)
1. Baixe o arquivo `.deb`
2. Instale: `sudo dpkg -i FinancePass-1.0.0-x64.deb`
3. Execute: `financepass` ou procure no menu de aplicativos

---

## 📖 Primeiros Passos

### 1️⃣ Primeiro Acesso
- Ao abrir o app pela primeira vez, você verá o dashboard vazio
- Comece cadastrando suas receitas e despesas do mês

### 2️⃣ Configurar Senha Mestra (Opcional)
- Vá em **Senhas** → **Configurar Proteção**
- Defina uma senha mestra para proteger suas senhas
- ⚠️ **Importante**: Não esqueça esta senha! Não há recuperação.

### 3️⃣ Fazer Backup
- Vá em **Sistema** → **Backup**
- Clique em **Criar Backup**
- Salve o arquivo em um local seguro (pen drive, HD externo, etc.)

---

## 🆘 Suporte

### 📚 Documentação
- [README completo](https://github.com/koalitos/FinancePass/blob/main/README.md)
- [FAQ - Perguntas Frequentes](https://github.com/koalitos/FinancePass/blob/main/FAQ.md)
- [Guia Rápido](https://github.com/koalitos/FinancePass/blob/main/QUICKSTART.md)

### 🐛 Encontrou um bug?
- [Reportar Bug](https://github.com/koalitos/FinancePass/issues/new?template=bug_report.md)

### 💡 Tem uma sugestão?
- [Sugerir Funcionalidade](https://github.com/koalitos/FinancePass/issues/new?template=feature_request.md)

### 💬 Comunidade
- [Discussões no GitHub](https://github.com/koalitos/FinancePass/discussions)

---

## 🤝 Contribuir

O FinancePass é open source! Contribuições são bem-vindas:

1. 🐛 Reportar bugs
2. 💡 Sugerir melhorias
3. 🔧 Enviar Pull Requests
4. ⭐ Dar uma estrela no GitHub
5. 📢 Compartilhar com amigos

[Ver como contribuir](https://github.com/koalitos/FinancePass/blob/main/CONTRIBUTING.md)

---

## ☕ Apoiar o Projeto

Se você gosta do FinancePass, considere apoiar o desenvolvimento:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5e5b?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/koalitos)

Seu apoio ajuda a manter o projeto ativo e gratuito para todos! 💙

---

## 📝 Notas Técnicas

### Tecnologias Utilizadas
- **Frontend**: React 19, TailwindCSS
- **Backend**: Node.js, Express, SQLite
- **Desktop**: Electron 27
- **Criptografia**: AES-256-GCM

### Requisitos do Sistema
- **Windows**: Windows 10/11 (64-bit)
- **macOS**: macOS 10.15 Catalina ou superior
- **Linux**: Ubuntu 20.04+ ou equivalente (64-bit)
- **RAM**: 4 GB mínimo (8 GB recomendado)
- **Espaço**: 500 MB livres

### Arquivos de Dados
- **Windows**: `%APPDATA%\FinancePass\`
- **macOS**: `~/Library/Application Support/FinancePass/`
- **Linux**: `~/.config/FinancePass/`

---

## 🔄 Atualizações Futuras

### Em Breve
- 📱 App mobile (Android e iOS)
- 🔄 Sincronização entre dispositivos (local, sem nuvem)
- 📊 Mais gráficos e relatórios
- 🎨 Temas personalizáveis
- 🌍 Mais idiomas

[Ver Roadmap Completo](https://github.com/koalitos/FinancePass/blob/main/ROADMAP.md)

---

## 📜 Licença

Este projeto está licenciado sob a **Creative Commons BY-NC 4.0**.

- ✅ Uso pessoal gratuito
- ✅ Modificação e distribuição
- ❌ Uso comercial (requer permissão)

[Ver licença completa](https://github.com/koalitos/FinancePass/blob/main/LICENSE)

---

## 🙏 Agradecimentos

Obrigado a todos que contribuíram, testaram e apoiaram o projeto!

**Feito com ❤️ e ☕ para devolver sua privacidade**

---

## 🔗 Links Úteis

- 🌐 [Site](https://koalitos.github.io/FinancePass/)
- 🌐 [Site Pessoal](https://lamaral.dev.br/)
- 📦 [GitHub](https://github.com/koalitos/FinancePass)
- 💬 [Discussões](https://github.com/koalitos/FinancePass/discussions)
- 🐛 [Issues](https://github.com/koalitos/FinancePass/issues)
- ☕ [Ko-fi](https://ko-fi.com/koalitos)

---

**⭐ Se você gostou, deixe uma estrela no GitHub!**

[⬆ Voltar ao topo](#-financepass-v100)
