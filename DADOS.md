# 📁 Localização dos Dados do FinancePass

## Onde seus dados são salvos?

O FinancePass salva todos os seus dados em uma pasta **persistente** que **NÃO é apagada** durante atualizações ou reinstalações.

### Windows
```
C:\Users\[SeuUsuario]\AppData\Roaming\FinancePass\
├── data\
│   └── database.db          # Banco de dados (senhas, gastos, receitas)
└── SessionData\
    └── Local Storage\       # Configurações e preferências
```

### macOS
```
~/Library/Application Support/FinancePass/
├── data/
│   └── database.db
└── SessionData/
    └── Local Storage/
```

### Linux
```
~/.config/FinancePass/
├── data/
│   └── database.db
└── SessionData/
    └── Local Storage/
```

## O que é salvo?

### 📊 Banco de Dados (`database.db`)
- ✅ Senhas criptografadas
- ✅ Gastos e receitas
- ✅ Pessoas e dívidas
- ✅ Categorias personalizadas
- ✅ Contas recorrentes
- ✅ Parcelamentos

### ⚙️ Local Storage
- ✅ Configurações do app
- ✅ Preferências de idioma
- ✅ Tema (claro/escuro)
- ✅ Sessão do usuário

## Atualizações

✅ **Seus dados são preservados** durante atualizações!

O instalador:
1. Baixa a nova versão em background
2. Substitui apenas os arquivos do programa
3. **Mantém intacta** a pasta de dados do usuário
4. Migra automaticamente dados antigos (se necessário)

## Backup Manual

Para fazer backup dos seus dados:

1. Feche o FinancePass
2. Copie a pasta `FinancePass` do local acima
3. Guarde em local seguro (nuvem, HD externo, etc)

Para restaurar:
1. Feche o FinancePass
2. Cole a pasta de backup no local original
3. Abra o FinancePass

## Desinstalação

⚠️ **Importante:** Ao desinstalar o FinancePass, seus dados **NÃO são apagados automaticamente**.

Para remover completamente:
1. Desinstale o app normalmente
2. Delete manualmente a pasta `FinancePass` do local acima

Isso garante que você não perca dados acidentalmente!
