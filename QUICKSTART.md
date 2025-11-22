# 🚀 Guia Rápido - FinancePass

Comece a usar o FinancePass em menos de 5 minutos!

## 📥 1. Instalação

### Opção A: Instalador (Recomendado)

1. **Baixe o instalador** para seu sistema:
   - [Windows](https://github.com/seu-usuario/financial-manager/releases) - `.exe`
   - [macOS](https://github.com/seu-usuario/financial-manager/releases) - `.dmg`
   - [Linux](https://github.com/seu-usuario/financial-manager/releases) - `.AppImage`

2. **Execute o instalador** e siga as instruções

3. **Abra o FinancePass** - Pronto! 🎉

### Opção B: Código Fonte

```bash
git clone https://github.com/seu-usuario/financial-manager.git
cd financial-manager
npm run install-all
npm run setup
npm start
```

---

## 🎯 2. Primeiro Uso

### Configuração Inicial

1. **Abra o FinancePass**
2. **Escolha o idioma** (PT-BR ou EN)
3. **Crie uma senha mestra** (para o gerenciador de senhas)
   - ⚠️ **IMPORTANTE**: Anote esta senha! Não há como recuperá-la.

### Interface Principal

O FinancePass tem 4 seções principais:

```
┌─────────────────────────────────────┐
│  💰 Dashboard                       │  ← Visão geral
├─────────────────────────────────────┤
│  💸 Transações                      │  ← Receitas e despesas
├─────────────────────────────────────┤
│  💳 Dívidas                         │  ← Quem deve/você deve
├─────────────────────────────────────┤
│  🔐 Senhas                          │  ← Gerenciador de senhas
└─────────────────────────────────────┘
```

---

## 💰 3. Gerenciar Finanças

### Adicionar Receita

1. Vá para **Transações**
2. Clique em **+ Nova Transação**
3. Selecione **Receita**
4. Preencha:
   - Descrição (ex: "Salário")
   - Valor (ex: 5000.00)
   - Data
   - Categoria (opcional)
5. Clique em **Salvar**

### Adicionar Despesa

1. Vá para **Transações**
2. Clique em **+ Nova Transação**
3. Selecione **Despesa**
4. Preencha:
   - Descrição (ex: "Aluguel")
   - Valor (ex: 1500.00)
   - Data
   - Categoria (opcional)
5. Clique em **Salvar**

### Ver Balanço

O **Dashboard** mostra automaticamente:
- 💰 Total de receitas
- 💸 Total de despesas
- 📊 Balanço (receitas - despesas)

---

## 💳 4. Gerenciar Dívidas

### Registrar Quem Te Deve

1. Vá para **Dívidas**
2. Clique em **+ Nova Dívida**
3. Selecione **Receber**
4. Preencha:
   - Nome da pessoa
   - Valor
   - Data
   - Descrição (opcional)
5. Clique em **Salvar**

### Registrar Quem Você Deve

1. Vá para **Dívidas**
2. Clique em **+ Nova Dívida**
3. Selecione **Pagar**
4. Preencha os dados
5. Clique em **Salvar**

### Registrar Pagamento Parcial

1. Clique na dívida
2. Clique em **Registrar Pagamento**
3. Digite o valor pago
4. Clique em **Confirmar**

---

## 🔐 5. Gerenciar Senhas

### Adicionar Senha

1. Vá para **Senhas**
2. Digite sua **senha mestra**
3. Clique em **+ Nova Senha**
4. Preencha:
   - Nome/Site (ex: "Gmail")
   - Usuário (ex: "seu@email.com")
   - Senha
   - URL (opcional)
   - Notas (opcional)
5. Clique em **Salvar**

### Gerar Senha Forte

1. Ao adicionar senha, clique em **Gerar Senha**
2. Escolha as opções:
   - Tamanho (8-32 caracteres)
   - Incluir números
   - Incluir símbolos
   - Incluir maiúsculas
3. Clique em **Gerar**
4. Copie a senha gerada

### Copiar Senha

1. Encontre a senha na lista
2. Clique no ícone de **copiar** 📋
3. A senha é copiada para a área de transferência

---

## 👥 6. Gerenciar Pessoas

### Adicionar Pessoa

1. Vá para **Pessoas**
2. Clique em **+ Nova Pessoa**
3. Preencha:
   - Nome
   - Telefone (opcional)
   - Email (opcional)
   - Notas (opcional)
4. Clique em **Salvar**

### Ver Histórico

1. Clique em uma pessoa
2. Veja todas as transações e dívidas relacionadas

---

## 💾 7. Backup

### Fazer Backup

Seus dados estão em um único arquivo:

**Windows**:
```
C:\Users\[seu-usuario]\AppData\Roaming\FinancePass\database.db
```

**macOS**:
```
~/Library/Application Support/FinancePass/database.db
```

**Linux**:
```
~/.config/FinancePass/database.db
```

**Copie este arquivo** para um local seguro!

### Restaurar Backup

1. Feche o FinancePass
2. Substitua o arquivo `database.db` pelo backup
3. Abra o FinancePass

---

## 🎨 8. Personalizar

### Mudar Idioma

1. Vá para **Configurações** ⚙️
2. Selecione **Idioma**
3. Escolha PT-BR ou EN
4. Reinicie o app

### Categorias

Você pode criar categorias personalizadas:

1. Vá para **Configurações** ⚙️
2. Clique em **Categorias**
3. Adicione suas categorias

---

## 🔒 9. Segurança

### Dicas de Segurança

✅ **Use uma senha mestra forte**
- Mínimo 12 caracteres
- Misture letras, números e símbolos
- Não use palavras comuns

✅ **Faça backup regularmente**
- Semanalmente ou mensalmente
- Guarde em local seguro
- Considere múltiplos backups

✅ **Mantenha o app atualizado**
- Verifique atualizações regularmente
- Instale patches de segurança

✅ **Proteja seu computador**
- Use antivírus atualizado
- Não deixe o computador desbloqueado
- Use senha no sistema operacional

---

## ❓ 10. Problemas Comuns

### "Esqueci minha senha mestra"

❌ **Não há como recuperar**. A senha mestra não é armazenada.

✅ **Solução**: Você precisará redefinir o gerenciador de senhas (perderá as senhas salvas).

### "O app não abre"

1. Verifique se tem permissões de execução
2. Tente executar como administrador
3. Reinstale o app
4. Verifique os logs em `AppData/FinancePass/logs`

### "Perdi meus dados"

Se você tem backup:
1. Feche o app
2. Restaure o arquivo `database.db`
3. Abra o app

Se não tem backup:
❌ Não há como recuperar. **Faça backups regularmente!**

### "Como exportar dados?"

Atualmente, use [DB Browser for SQLite](https://sqlitebrowser.org/) para exportar.

Funcionalidade nativa de exportação virá em versões futuras.

---

## 📚 11. Próximos Passos

Agora que você sabe o básico:

1. 📖 Leia o [README completo](README.md)
2. ❓ Veja o [FAQ](FAQ.md)
3. 🤝 Contribua no [GitHub](https://github.com/seu-usuario/financial-manager)
4. ☕ Apoie o projeto no [Ko-fi](https://ko-fi.com/koalitos)

---

## 💬 12. Ajuda

Precisa de ajuda?

- 📖 [Documentação Completa](README.md)
- ❓ [FAQ](FAQ.md)
- 💬 [GitHub Discussions](https://github.com/seu-usuario/financial-manager/discussions)
- 🐛 [Reportar Bug](https://github.com/seu-usuario/financial-manager/issues)

---

## 🎉 Pronto!

Você está pronto para usar o FinancePass! 

**Dicas finais:**
- ✅ Faça backup regularmente
- ✅ Use senhas fortes
- ✅ Mantenha o app atualizado
- ✅ Divulgue para amigos!

---

<div align="center">

**Feito com ❤️ e ☕ para devolver sua privacidade**

⭐ Se você gostou, deixe uma estrela no [GitHub](https://github.com/seu-usuario/financial-manager)!

[⬆ Voltar ao topo](#-guia-rápido---financepass)

</div>
