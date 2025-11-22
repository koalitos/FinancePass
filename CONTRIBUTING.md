# 🤝 Guia de Contribuição - FinancePass

Obrigado por considerar contribuir com o FinancePass! Este projeto é feito pela comunidade, para a comunidade.

## 🎯 Como Posso Contribuir?

Existem várias formas de contribuir:

### 1. 🐛 Reportar Bugs

Encontrou um problema? Ajude-nos a melhorar!

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/seu-usuario/financial-manager/issues)
2. Se não foi, [abra uma nova issue](https://github.com/seu-usuario/financial-manager/issues/new)
3. Use um título claro e descritivo
4. Descreva os passos para reproduzir o problema
5. Inclua screenshots se possível
6. Informe seu sistema operacional e versão do app

**Template de Bug Report:**
```markdown
**Descrição do Bug**
Uma descrição clara do que está acontecendo.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
- OS: [ex: Windows 11]
- Versão do App: [ex: 1.0.0]
```

### 2. 💡 Sugerir Recursos

Tem uma ideia para melhorar o FinancePass?

1. Verifique se a sugestão já não existe nas [Issues](https://github.com/seu-usuario/financial-manager/issues)
2. [Abra uma nova issue](https://github.com/seu-usuario/financial-manager/issues/new) com a tag `enhancement`
3. Descreva claramente o recurso e por que seria útil
4. Se possível, sugira como poderia ser implementado

### 3. 🔧 Contribuir com Código

Quer contribuir com código? Ótimo!

#### Configurando o Ambiente

```bash
# 1. Fork o projeto no GitHub

# 2. Clone seu fork
git clone https://github.com/seu-usuario/financial-manager.git
cd financial-manager

# 3. Adicione o repositório original como upstream
git remote add upstream https://github.com/seu-usuario/financial-manager.git

# 4. Instale as dependências
npm run install-all

# 5. Configure o banco de dados
npm run setup

# 6. Inicie o ambiente de desenvolvimento
npm run dev:simple
```

#### Fluxo de Trabalho

```bash
# 1. Crie uma branch para sua feature
git checkout -b feature/minha-feature

# 2. Faça suas alterações
# ... código ...

# 3. Teste suas alterações
npm test

# 4. Commit suas alterações
git add .
git commit -m "feat: adiciona minha feature"

# 5. Push para seu fork
git push origin feature/minha-feature

# 6. Abra um Pull Request no GitHub
```

#### Padrões de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Formatação, ponto e vírgula, etc
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `chore:` - Tarefas de manutenção

**Exemplos:**
```bash
git commit -m "feat: adiciona filtro por categoria nas transações"
git commit -m "fix: corrige cálculo de saldo mensal"
git commit -m "docs: atualiza README com instruções de instalação"
```

### 4. 📖 Melhorar Documentação

A documentação nunca é perfeita! Você pode:

- Corrigir erros de digitação
- Melhorar explicações
- Adicionar exemplos
- Traduzir para outros idiomas
- Criar tutoriais

### 5. 🌍 Traduzir

Ajude a tornar o FinancePass acessível em mais idiomas:

1. Copie o arquivo `frontend/src/locales/pt-BR.json`
2. Traduza as strings para seu idioma
3. Salve como `frontend/src/locales/[seu-idioma].json`
4. Adicione o idioma em `frontend/src/i18n.js`
5. Envie um Pull Request

### 6. 🎨 Design e UX

Tem habilidades de design? Contribua com:

- Melhorias na interface
- Novos ícones
- Temas personalizados
- Mockups de novas features

### 7. ☕ Apoiar Financeiramente

Se você não pode contribuir com código, considere apoiar financeiramente:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5e5b?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/koalitos)

## 📋 Diretrizes de Código

### JavaScript/React

- Use ES6+ features
- Componentes funcionais com Hooks
- PropTypes para validação de props
- Nomes descritivos para variáveis e funções
- Comentários para lógica complexa

### CSS/TailwindCSS

- Use classes do Tailwind quando possível
- CSS customizado apenas quando necessário
- Mantenha consistência com o design system
- Mobile-first approach

### Node.js/Express

- Use async/await ao invés de callbacks
- Tratamento adequado de erros
- Validação de entrada de dados
- Comentários em APIs complexas

## 🧪 Testes

Antes de enviar um PR:

```bash
# Execute os testes
npm test

# Teste manualmente no app
npm start
```

## 📝 Pull Request

### Checklist

Antes de enviar seu PR, verifique:

- [ ] O código segue os padrões do projeto
- [ ] Todos os testes passam
- [ ] A documentação foi atualizada (se necessário)
- [ ] O commit segue o padrão Conventional Commits
- [ ] Não há conflitos com a branch main
- [ ] O código foi testado manualmente

### Template de PR

```markdown
## Descrição
Descreva suas mudanças aqui.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. ...

## Screenshots (se aplicável)
Adicione screenshots das mudanças visuais.

## Checklist
- [ ] Código testado
- [ ] Documentação atualizada
- [ ] Testes passando
```

## 🚫 O Que NÃO Fazer

- ❌ Não adicione dependências desnecessárias
- ❌ Não remova funcionalidades sem discussão prévia
- ❌ Não faça mudanças que quebrem a compatibilidade
- ❌ Não ignore os padrões de código
- ❌ Não envie código não testado

## 💬 Comunicação

- **Issues**: Para bugs e sugestões
- **Discussions**: Para perguntas e discussões gerais
- **Pull Requests**: Para contribuições de código

## 📜 Código de Conduta

### Nossos Valores

- 🤝 Seja respeitoso e inclusivo
- 💡 Aceite críticas construtivas
- 🎯 Foque no que é melhor para a comunidade
- 🌟 Mostre empatia com outros membros

### Comportamento Inaceitável

- ❌ Linguagem ofensiva ou discriminatória
- ❌ Assédio de qualquer tipo
- ❌ Ataques pessoais
- ❌ Spam ou autopromoção excessiva

## 🎓 Recursos para Iniciantes

Novo em contribuições open source? Comece aqui:

- [Como Contribuir para Open Source](https://opensource.guide/how-to-contribute/)
- [Git e GitHub para Iniciantes](https://www.youtube.com/watch?v=RGOj5yH7evk)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🏆 Reconhecimento

Todos os contribuidores serão reconhecidos no README do projeto!

## ❓ Dúvidas?

Se tiver dúvidas sobre como contribuir:

1. Leia este guia completamente
2. Procure nas [Issues](https://github.com/seu-usuario/financial-manager/issues)
3. Abra uma [Discussion](https://github.com/seu-usuario/financial-manager/discussions)
4. Entre em contato via Ko-fi

---

**Obrigado por contribuir com o FinancePass! Juntos estamos devolvendo a privacidade às pessoas.** 🚀

