# 💰 FinancePass - Gerenciador Financeiro Open Source

<div align="center">

![License](https://img.shields.io/badge/license-CC%20BY--NC%204.0-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

**Retome o controle dos seus dados financeiros e senhas**

[Download](#-download) • [Recursos](#-recursos) • [Instalação](#-instalação) • [Documentação](#-documentação) • [Apoiar](#-apoie-o-projeto)

</div>

---

## 🎯 Sobre o Projeto

O **FinancePass** é um sistema completo de gerenciamento financeiro pessoal com gerenciador de senhas integrado, criado para devolver às pessoas um pouco da **privacidade que as grandes empresas de tecnologia tiraram**.

### Por que este projeto existe?

Estamos cansados de:
- 🚫 Pagar assinaturas mensais para gerenciar nosso próprio dinheiro
- 🚫 Ter nossos dados financeiros armazenados em servidores de terceiros
- 🚫 Depender de conexão com internet para acessar nossas informações
- 🚫 Não ter controle sobre nossos próprios dados

**FinancePass** é a resposta: 100% gratuito, open source, e seus dados ficam apenas no seu computador.

---

## ✨ Recursos

### 💰 Gestão Financeira Completa
- Controle de receitas e despesas
- Dashboard com visão geral do balanço mensal
- Categorização de transações
- Histórico completo de movimentações

### 💳 Gestão de Dívidas
- Controle de quem te deve e quem você deve
- Sistema de pagamentos parciais
- Histórico de transações por pessoa
- Cálculo automático de saldos

### 🔐 Gerenciador de Senhas
- Armazenamento seguro com criptografia AES-256
- Gerador de senhas fortes
- Organização por categorias
- Busca rápida

### 👥 Cadastro de Pessoas
- Gerenciamento de contatos
- Histórico de transações
- Notas e observações

### 🌐 Interface Moderna
- Design intuitivo e responsivo
- Tema escuro
- Multi-idioma (PT-BR e EN)
- Experiência fluida

---

## 🔒 Privacidade e Segurança

### Seus dados, seu controle

- ✅ **100% Offline**: Funciona sem internet, seus dados nunca saem do seu computador
- ✅ **Criptografia AES-256**: Senhas protegidas com criptografia de nível militar
- ✅ **Armazenamento Local**: Banco de dados SQLite no seu próprio disco
- ✅ **Sem Telemetria**: Não coletamos nenhum dado seu
- ✅ **Sem Servidores**: Não há servidores externos, tudo roda localmente
- ✅ **Backup Simples**: Seus dados estão em um único arquivo, fácil de fazer backup

### O que as big techs fazem com seus dados?

Quando você usa aplicativos de finanças online:
- 📊 Analisam seus hábitos de consumo
- 🎯 Criam perfis para publicidade direcionada
- 💰 Vendem seus dados para terceiros
- 🔍 Monitoram cada transação que você faz

**Com FinancePass, isso não acontece. Seus dados são SEUS.**

---

## 📱 Em Breve: App Mobile

Estamos trabalhando em um **aplicativo para celular** que:
- 📱 Funcionará 100% offline
- 🔄 Sincronizará com seu PC via rede local (sem internet)
- 🔐 Manterá a mesma segurança e privacidade
- 📊 Permitirá registrar transações em qualquer lugar

**Fique ligado para novidades!**

---

## 💾 Download

### Windows
```
FinancePass-Setup-1.0.0.exe
```
[⬇️ Download para Windows](https://github.com/koalitos/FinancePass/releases)

### macOS
```
FinancePass-1.0.0.dmg
```
[⬇️ Download para macOS](https://github.com/koalitos/FinancePass/releases)

> ⚠️ **macOS:** Se aparecer "está danificado", veja [instruções de instalação](INSTALACAO-MACOS.md)

### Linux
```
FinancePass-1.0.0.AppImage
```
[⬇️ Download para Linux](https://github.com/koalitos/FinancePass/releases)

---

## 🚀 Instalação

### Instalação via Executável (Recomendado)

#### Windows
1. Baixe `FinancePass-Setup-[versão].exe`
2. Execute o instalador
3. Siga as instruções na tela
4. Pronto! O FinancePass está instalado

#### macOS

1. Baixe `FinancePass-[versão]-[arch].dmg`
2. Abra o DMG e arraste para Aplicativos
3. Abra o FinancePass
4. **Na primeira vez:** O app vai pedir permissão para executar
   - Clique em **"Permitir"**
   - Digite sua senha de administrador
   - Pronto! Não precisará fazer isso novamente

> 💡 **Detecção Automática:** O FinancePass detecta automaticamente quando está bloqueado pelo macOS e pede permissão para corrigir. Você não precisa abrir o Terminal! [Saiba mais](ALTERNATIVAS-CODE-SIGNING.md)

> ⚠️ **Por que isso acontece?** O app não está assinado com certificado Apple Developer (custo de $99/ano para projetos open source). [Entenda melhor](MACOS-GATEKEEPER.md)

📖 [Instruções detalhadas para macOS](INSTALACAO-MACOS.md)

#### Linux
1. Baixe `FinancePass-[versão]-[arch].AppImage`
2. Dê permissão de execução: `chmod +x FinancePass-*.AppImage`
3. Execute o arquivo
4. Pronto!

### Instalação via Código Fonte

```bash
# Clone o repositório
git clone https://github.com/koalitos/FinancePass.git
cd FinancePass

# Instale as dependências
npm run install-all

# Configure o banco de dados
npm run setup

# Inicie o aplicativo
npm start
```

---

## 📖 Documentação

### Requisitos do Sistema

- **Windows**: Windows 10 ou superior
- **macOS**: macOS 10.15 (Catalina) ou superior
- **Linux**: Ubuntu 18.04+, Debian 10+, ou equivalente

### Tecnologias Utilizadas

- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express
- **Desktop**: Electron
- **Banco de Dados**: SQLite
- **Criptografia**: AES-256

### Estrutura do Projeto

```
financial-manager/
├── frontend/          # Interface React
├── backend/           # API Node.js
├── electron.js        # Aplicação Electron
├── docs/             # Site do projeto
└── assets/           # Ícones e recursos
```

---

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Este é um projeto open source feito pela comunidade, para a comunidade.

### Formas de Contribuir

1. 🐛 **Reportar Bugs**: Encontrou um problema? [Abra uma issue](https://github.com/koalitos/FinancePass/issues)
2. 💡 **Sugerir Recursos**: Tem uma ideia? Compartilhe conosco!
3. 🔧 **Enviar Pull Requests**: Quer contribuir com código? Faça um fork e envie um PR
4. 📖 **Melhorar Documentação**: Ajude a tornar a documentação mais clara
5. 🌍 **Traduzir**: Ajude a traduzir para outros idiomas
6. ☕ **Apoiar Financeiramente**: [Ko-fi](https://ko-fi.com/koalitos)

### Guia de Contribuição

```bash
# 1. Fork o projeto
# 2. Clone seu fork
git clone https://github.com/koalitos/FinancePass.git

# 3. Crie uma branch para sua feature
git checkout -b minha-feature

# 4. Faça suas alterações e commit
git commit -m "Adiciona minha feature"

# 5. Push para seu fork
git push origin minha-feature

# 6. Abra um Pull Request
```

---

## ☕ Apoie o Projeto

Se você gosta do FinancePass e quer apoiar seu desenvolvimento:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5e5b?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/koalitos)

Seu apoio ajuda a:
- ⚡ Manter o projeto ativo
- 🚀 Desenvolver novos recursos
- 📱 Criar o app mobile
- 🐛 Corrigir bugs mais rapidamente
- 📖 Melhorar a documentação

**O projeto continuará sempre gratuito e open source!**

---

## 📜 Licença

Este projeto está licenciado sob a **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**.

### O que isso significa?

✅ **VOCÊ PODE:**
- Usar gratuitamente para uso pessoal
- Modificar o código-fonte
- Distribuir suas modificações
- Estudar como funciona
- Contribuir com melhorias

❌ **VOCÊ NÃO PODE:**
- Vender este software
- Usar em produtos comerciais
- Cobrar pelo uso
- Remover os créditos

Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🌟 Roadmap

### Versão Atual (1.0.0)
- ✅ Gestão financeira completa
- ✅ Gerenciador de senhas
- ✅ Interface moderna
- ✅ Multi-idioma

### Próximas Versões
- 📱 **v1.1.0**: App mobile (Android/iOS)
- 🔄 **v1.2.0**: Sincronização local entre dispositivos
- 📊 **v1.3.0**: Gráficos e relatórios avançados
- 🎨 **v1.4.0**: Temas personalizáveis
- 📤 **v1.5.0**: Exportação de dados (PDF, Excel)

---

## 💬 Comunidade

- 💬 [Discussões no GitHub](https://github.com/koalitos/FinancePass/discussions)
- 🐛 [Reportar Bugs](https://github.com/koalitos/FinancePass/issues)
- ☕ [Ko-fi](https://ko-fi.com/koalitos)

---

## 📞 Contato

Tem dúvidas ou sugestões? Entre em contato:

- GitHub: [@koalitos](https://github.com/koalitos)
- Ko-fi: [koalitos](https://ko-fi.com/koalitos)

---

<div align="center">

**Feito com ❤️ e ☕ para devolver sua privacidade**

⭐ Se você gostou do projeto, deixe uma estrela no GitHub!

[⬆ Voltar ao topo](#-financepass---gerenciador-financeiro-open-source)

</div>
