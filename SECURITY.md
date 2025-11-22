# 🔒 Política de Segurança

## 🛡️ Versões Suportadas

Atualmente, as seguintes versões do FinancePass recebem atualizações de segurança:

| Versão | Suportada          |
| ------ | ------------------ |
| 1.0.x  | ✅ Sim             |
| < 1.0  | ❌ Não             |

## 🚨 Reportar uma Vulnerabilidade

A segurança dos seus dados é nossa prioridade máxima. Se você descobriu uma vulnerabilidade de segurança no FinancePass, por favor nos ajude a corrigi-la de forma responsável.

### Como Reportar

**NÃO** abra uma issue pública para vulnerabilidades de segurança.

Em vez disso, envie um email para: **[seu-email@exemplo.com]**

Ou use a funcionalidade de [Security Advisories](https://github.com/koalitos/FinancePass/security/advisories) do GitHub.

### Informações a Incluir

Por favor, inclua o máximo de informações possível:

1. **Tipo de vulnerabilidade** (ex: SQL injection, XSS, etc)
2. **Localização** do código vulnerável (arquivo e linha)
3. **Passos para reproduzir** a vulnerabilidade
4. **Impacto potencial** da vulnerabilidade
5. **Sugestões de correção** (se tiver)
6. **Seu nome/handle** (para créditos, se desejar)

### O Que Esperar

1. **Confirmação**: Responderemos em até 48 horas confirmando o recebimento
2. **Avaliação**: Avaliaremos a vulnerabilidade em até 7 dias
3. **Correção**: Trabalharemos em uma correção o mais rápido possível
4. **Divulgação**: Coordenaremos a divulgação pública com você
5. **Créditos**: Você será creditado na correção (se desejar)

## 🔐 Práticas de Segurança do FinancePass

### Criptografia

- **Senhas**: Criptografadas com AES-256
- **Chave de criptografia**: Derivada da senha mestra do usuário
- **Algoritmo**: AES-256-CBC com PBKDF2

### Armazenamento de Dados

- **Banco de dados**: SQLite local
- **Localização**: Apenas no computador do usuário
- **Backup**: Responsabilidade do usuário
- **Sem cloud**: Nenhum dado é enviado para servidores externos

### Autenticação

- **Senha mestra**: Requerida para acessar senhas criptografadas
- **Sem armazenamento**: A senha mestra nunca é armazenada
- **Derivação**: Usada apenas para derivar a chave de criptografia

### Privacidade

- ✅ **Sem telemetria**: Não coletamos nenhum dado
- ✅ **Sem analytics**: Não rastreamos uso
- ✅ **Sem servidores**: Tudo funciona offline
- ✅ **Sem third-party**: Sem serviços de terceiros
- ✅ **Open source**: Código auditável por qualquer um

## 🔍 Auditoria de Segurança

O FinancePass é open source e pode ser auditado por qualquer pessoa. Encorajamos:

- Revisão de código
- Testes de penetração
- Análise de segurança
- Sugestões de melhorias

## 📋 Checklist de Segurança para Usuários

Para manter seus dados seguros:

- ✅ Use uma senha mestra forte e única
- ✅ Faça backup regular do banco de dados
- ✅ Mantenha o app atualizado
- ✅ Use antivírus atualizado
- ✅ Não compartilhe sua senha mestra
- ✅ Verifique a integridade dos downloads
- ✅ Baixe apenas de fontes oficiais

## 🛠️ Ferramentas de Segurança Usadas

- **SQLite**: Banco de dados local seguro
- **crypto (Node.js)**: Módulo de criptografia nativo
- **bcrypt**: Hash de senhas (se aplicável)
- **helmet**: Proteção de headers HTTP
- **express-validator**: Validação de entrada

## 📚 Recursos de Segurança

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Electron Security](https://www.electronjs.org/docs/latest/tutorial/security)

## 🏆 Hall da Fama de Segurança

Agradecemos às seguintes pessoas por reportarem vulnerabilidades de forma responsável:

<!-- Lista será atualizada conforme reportes -->

*Nenhum reporte ainda. Seja o primeiro!*

## 📞 Contato

Para questões de segurança:
- Email: **[seu-email@exemplo.com]**
- GitHub Security: [Security Advisories](https://github.com/koalitos/FinancePass/security/advisories)

Para outras questões:
- Issues: [GitHub Issues](https://github.com/koalitos/FinancePass/issues)
- Discussions: [GitHub Discussions](https://github.com/koalitos/FinancePass/discussions)

---

**Obrigado por ajudar a manter o FinancePass seguro!** 🔒

*Última atualização: 22 de Novembro de 2025*
