# ❓ Perguntas Frequentes (FAQ)

## 📋 Índice

- [Geral](#-geral)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Segurança](#-segurança)
- [Privacidade](#-privacidade)
- [Técnico](#-técnico)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🌟 Geral

### O que é o FinancePass?

O FinancePass é um sistema completo de gerenciamento financeiro pessoal com gerenciador de senhas integrado. É 100% gratuito, open source e funciona completamente offline.

### Por que devo usar o FinancePass?

- ✅ **Gratuito**: Sem assinaturas ou taxas
- ✅ **Privado**: Seus dados ficam apenas no seu computador
- ✅ **Offline**: Funciona sem internet
- ✅ **Open Source**: Código auditável e transparente
- ✅ **Seguro**: Criptografia AES-256 para senhas

### Qual a diferença para outros apps de finanças?

A maioria dos apps de finanças:
- ❌ Cobra assinaturas mensais
- ❌ Armazena seus dados em servidores
- ❌ Requer conexão com internet
- ❌ Rastreia seus hábitos
- ❌ Vende seus dados

O FinancePass:
- ✅ É completamente gratuito
- ✅ Dados apenas no seu computador
- ✅ Funciona 100% offline
- ✅ Zero telemetria
- ✅ Seus dados são seus

---

## 💾 Instalação

### Como instalo o FinancePass?

1. Baixe o instalador para seu sistema operacional na [página de releases](https://github.com/koalitos/FinancePass/releases)
2. Execute o instalador
3. Siga as instruções na tela
4. Pronto!

### Quais sistemas operacionais são suportados?

- Windows 10/11
- macOS 10.15 (Catalina) ou superior
- Linux (Ubuntu 18.04+, Debian 10+, ou equivalente)

### Preciso de internet para instalar?

Você precisa de internet apenas para baixar o instalador. Depois disso, o app funciona 100% offline.

### Como atualizo o FinancePass?

O app verifica automaticamente por atualizações. Quando houver uma nova versão, você será notificado e poderá atualizar com um clique.

---

## 🎯 Uso

### Como faço backup dos meus dados?

Seus dados estão em um único arquivo SQLite. Para fazer backup:

**Windows**: `C:\Users\[seu-usuario]\AppData\Roaming\FinancePass\database.db`
**macOS**: `~/Library/Application Support/FinancePass/database.db`
**Linux**: `~/.config/FinancePass/database.db`

Copie este arquivo para um local seguro (pen drive, HD externo, etc).

### Como restauro um backup?

1. Feche o FinancePass
2. Substitua o arquivo `database.db` pelo seu backup
3. Abra o FinancePass novamente

### Posso usar em múltiplos computadores?

Sim! Você pode copiar o arquivo `database.db` entre computadores. Em breve teremos sincronização automática via rede local.

### Como exporto meus dados?

Atualmente, seus dados estão no formato SQLite. Você pode usar ferramentas como [DB Browser for SQLite](https://sqlitebrowser.org/) para exportar para CSV, JSON, etc.

Estamos trabalhando em funcionalidades nativas de exportação (PDF, Excel) para versões futuras.

---

## 🔒 Segurança

### Minhas senhas estão seguras?

Sim! As senhas são criptografadas com AES-256, o mesmo padrão usado por bancos e militares. A chave de criptografia é derivada da sua senha mestra usando PBKDF2.

### O que é a senha mestra?

A senha mestra é uma senha que você cria para proteger suas senhas armazenadas. Ela nunca é armazenada e é usada apenas para derivar a chave de criptografia.

### E se eu esquecer minha senha mestra?

Infelizmente, se você esquecer sua senha mestra, não há como recuperar suas senhas criptografadas. Isso é por design - nem nós podemos acessar suas senhas.

**Dica**: Anote sua senha mestra em um local seguro físico.

### O app coleta algum dado meu?

**NÃO!** O FinancePass não coleta nenhum dado. Não há telemetria, analytics ou rastreamento de qualquer tipo. Seus dados são 100% seus.

### Como posso verificar que o app é seguro?

O código é open source! Você pode:
1. Revisar o código no [GitHub](https://github.com/koalitos/FinancePass)
2. Auditar a segurança
3. Compilar você mesmo a partir do código fonte

---

## 🔐 Privacidade

### Meus dados são enviados para algum servidor?

**NÃO!** Todos os seus dados ficam apenas no seu computador. O app funciona 100% offline e não se conecta a nenhum servidor.

### O app usa analytics ou telemetria?

**NÃO!** Não coletamos nenhum dado de uso, analytics ou telemetria. Sua privacidade é total.

### Vocês vendem meus dados?

**NÃO!** Não temos acesso aos seus dados, então não há nada para vender. Seus dados são seus e apenas seus.

### Como vocês ganham dinheiro então?

O FinancePass é um projeto open source mantido pela comunidade. Aceitamos doações voluntárias via [Ko-fi](https://ko-fi.com/koalitos), mas o app sempre será gratuito.

---

## 🛠️ Técnico

### Quais tecnologias são usadas?

- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express
- **Desktop**: Electron
- **Banco de Dados**: SQLite
- **Criptografia**: AES-256 (Node.js crypto)

### Posso contribuir com código?

Sim! Veja nosso [Guia de Contribuição](CONTRIBUTING.md).

### Como compilo o app do código fonte?

```bash
# Clone o repositório
git clone https://github.com/koalitos/FinancePass.git
cd FinancePass

# Instale dependências
npm run install-all

# Configure o banco de dados
npm run setup

# Inicie em modo desenvolvimento
npm run dev:simple

# Ou compile para produção
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:linux # Linux
```

### O app funciona em ARM (M1/M2)?

Sim! O app funciona em processadores ARM, incluindo Apple Silicon (M1/M2/M3).

### Qual o tamanho do app?

- **Windows**: ~150MB
- **macOS**: ~180MB
- **Linux**: ~160MB

---

## 🤝 Contribuição

### Como posso ajudar o projeto?

Várias formas:
1. 🐛 Reportar bugs
2. 💡 Sugerir recursos
3. 🔧 Contribuir com código
4. 📖 Melhorar documentação
5. 🌍 Traduzir para outros idiomas
6. ⭐ Dar uma estrela no GitHub
7. ☕ Apoiar financeiramente

Veja o [Guia de Contribuição](CONTRIBUTING.md) para mais detalhes.

### Preciso saber programar para contribuir?

Não! Você pode ajudar com:
- Documentação
- Traduções
- Design
- Testes
- Divulgação
- Sugestões

### Como reporto um bug?

1. Verifique se já não foi reportado nas [Issues](https://github.com/koalitos/FinancePass/issues)
2. [Abra uma nova issue](https://github.com/koalitos/FinancePass/issues/new)
3. Use o template de bug report
4. Inclua o máximo de detalhes possível

---

## 📜 Licença

### Qual a licença do FinancePass?

Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

### O que posso fazer com o código?

✅ **PODE:**
- Usar gratuitamente
- Modificar o código
- Distribuir modificações
- Estudar como funciona
- Contribuir melhorias

❌ **NÃO PODE:**
- Vender o software
- Usar comercialmente
- Cobrar pelo uso
- Remover créditos

### Posso usar em minha empresa?

Para uso pessoal dos funcionários, sim. Para uso comercial (vender ou cobrar), não.

### E se eu quiser usar comercialmente?

Entre em contato conosco para discutir uma licença comercial.

---

## 📱 App Mobile

### Haverá versão mobile?

Sim! Estamos desenvolvendo apps para Android e iOS. Eles funcionarão 100% offline e sincronizarão com seu PC via rede local.

### Quando será lançado?

Ainda não temos data definida, mas estamos trabalhando nisso. Acompanhe no [GitHub](https://github.com/koalitos/FinancePass) para novidades.

### Será gratuito também?

Sim! O app mobile será 100% gratuito, assim como a versão desktop.

---

## 💬 Suporte

### Onde posso obter ajuda?

- 📖 [Documentação](README.md)
- 💬 [GitHub Discussions](https://github.com/koalitos/FinancePass/discussions)
- 🐛 [Issues](https://github.com/koalitos/FinancePass/issues)
- ☕ [Ko-fi](https://ko-fi.com/koalitos)

### Encontrei um problema, o que faço?

1. Verifique este FAQ
2. Procure nas [Issues](https://github.com/seu-usuario/financial-manager/issues)
3. Se não encontrar solução, [abra uma nova issue](https://github.com/seu-usuario/financial-manager/issues/new)

### Como entro em contato?

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- Ko-fi: [koalitos](https://ko-fi.com/koalitos)
- Email: [seu-email@exemplo.com]

---

## 🎁 Outras Perguntas

### Por que o projeto foi criado?

Para devolver às pessoas um pouco da privacidade que as big techs tiraram. Acreditamos que você deve ter controle total sobre seus dados financeiros.

### O projeto vai continuar gratuito?

**SIM!** O FinancePass sempre será gratuito e open source. Isso é uma promessa.

### Como posso apoiar o projeto?

- ⭐ Dê uma estrela no [GitHub](https://github.com/seu-usuario/financial-manager)
- 🗣️ Divulgue para amigos e família
- ☕ Faça uma doação no [Ko-fi](https://ko-fi.com/koalitos)
- 🤝 Contribua com código ou documentação

---

## ❓ Não encontrou sua resposta?

Abra uma [Discussion](https://github.com/seu-usuario/financial-manager/discussions) no GitHub ou entre em contato conosco!

---

<div align="center">

**Feito com ❤️ e ☕ para devolver sua privacidade**

[⬆ Voltar ao topo](#-perguntas-frequentes-faq)

</div>
