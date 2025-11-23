#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ler versão do package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);

const version = packageJson.version;

// Template das release notes
const releaseNotes = `# 🎉 FinancePass v${version}

> **Gerenciador Financeiro e de Senhas - 100% Gratuito e Open Source**

Retome o controle dos seus dados financeiros e senhas. Tudo armazenado localmente no seu computador, com criptografia AES-256 e zero telemetria.

---

## 📥 Download

Escolha o instalador para seu sistema operacional:

### 🪟 Windows
- **FinancePass-Setup-${version}.exe** (Recomendado)
- Requisitos: Windows 10/11 (64-bit)

### 🍎 macOS
- **FinancePass-${version}-arm64.dmg** (Apple Silicon - M1/M2/M3)
- **FinancePass-${version}-x64.dmg** (Intel)
- Requisitos: macOS 10.15 ou superior

### 🐧 Linux
- **FinancePass-${version}-x64.AppImage** (Universal)
- **FinancePass-${version}-x64.deb** (Debian/Ubuntu)
- Requisitos: Ubuntu 20.04+ ou equivalente

---

## ✨ Recursos Principais

### 💰 Gestão Financeira Completa
- ✅ Controle de receitas e despesas
- ✅ Gestão de dívidas (quem te deve e quem você deve)
- ✅ Parcelamentos e compras a prazo
- ✅ Contas a pagar recorrentes
- ✅ Dashboard com visão geral do mês
- ✅ Relatórios detalhados por pessoa
- ✅ Exportação de relatórios em PDF

### 🔐 Gerenciador de Senhas
- ✅ Armazenamento seguro com criptografia AES-256
- ✅ Organização por pastas
- ✅ Gerador de senhas fortes
- ✅ Proteção com senha mestra
- ✅ Busca rápida

### 👥 Gestão de Pessoas
- ✅ Cadastro de contatos
- ✅ Histórico de transações por pessoa
- ✅ Relatórios individuais

### 🌐 Recursos Adicionais
- ✅ Interface em Português e Inglês
- ✅ Modo escuro/claro
- ✅ Sincronização local via rede (sem nuvem)
- ✅ Backup simples (um único arquivo)
- ✅ Funciona 100% offline

---

## 🔒 Segurança e Privacidade

### 🛡️ Recursos de Segurança
- 🔒 Criptografia AES-256 para senhas
- 💾 Dados armazenados localmente (SQLite)
- 🚫 Sem conexão com servidores externos
- 🔐 Você tem controle total dos seus dados
- 📂 Backup simples (apenas um arquivo)

---

## 📖 Documentação

- [README completo](https://github.com/koalitos/FinancePass/blob/main/README.md)
- [FAQ - Perguntas Frequentes](https://github.com/koalitos/FinancePass/blob/main/FAQ.md)
- [Guia Rápido](https://github.com/koalitos/FinancePass/blob/main/QUICKSTART.md)

---

## 🐛 Suporte

- [Reportar Bug](https://github.com/koalitos/FinancePass/issues/new)
- [Sugerir Funcionalidade](https://github.com/koalitos/FinancePass/issues/new)
- [Discussões](https://github.com/koalitos/FinancePass/discussions)

---

## ☕ Apoiar o Projeto

Se você gosta do FinancePass, considere apoiar o desenvolvimento:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5e5b?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/koalitos)

---

**Feito com ❤️ e ☕ para devolver sua privacidade**

⭐ [Deixe uma estrela no GitHub](https://github.com/koalitos/FinancePass)
`;

// Salvar em arquivo
const outputPath = path.join(__dirname, '../RELEASE_NOTES.md');
fs.writeFileSync(outputPath, releaseNotes);

console.log('✅ Release notes geradas com sucesso!');
console.log('📄 Arquivo:', outputPath);
console.log('');
console.log('📋 Copie o conteúdo para a release no GitHub:');
console.log('   https://github.com/koalitos/FinancePass/releases/new');
