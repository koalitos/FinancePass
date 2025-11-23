# 🍎 Instalação no macOS

## Erro: "FinancePass está danificado e não pode ser aberto"

Este erro acontece porque o app não está assinado com certificado de desenvolvedor Apple (que custa $99/ano). O app é **100% seguro e open source**, mas o macOS bloqueia por padrão.

### ✅ Solução 1: Remover quarentena (Recomendado)

Abra o Terminal e execute:

```bash
xattr -cr /Applications/FinancePass.app
```

Depois abra o app normalmente.

### ✅ Solução 2: Permitir nas Configurações

1. Tente abrir o FinancePass
2. Quando aparecer o erro, vá em **Preferências do Sistema** > **Segurança e Privacidade**
3. Na aba **Geral**, clique em **Abrir Assim Mesmo**
4. Confirme que deseja abrir

### ✅ Solução 3: Usar arquivo ZIP

Se o DMG não funcionar, baixe a versão ZIP:

1. Baixe `FinancePass-[versão]-[arch].zip`
2. Extraia o arquivo
3. Arraste `FinancePass.app` para a pasta Aplicativos
4. Execute o comando do Terminal (Solução 1)

### ✅ Solução 4: Desabilitar Gatekeeper (Temporário)

⚠️ **Use com cuidado** - isso desabilita a proteção do macOS temporariamente:

```bash
# Desabilitar
sudo spctl --master-disable

# Instalar o FinancePass

# Reabilitar (IMPORTANTE!)
sudo spctl --master-enable
```

## Por que isso acontece?

O macOS Gatekeeper bloqueia apps não assinados por desenvolvedores registrados na Apple. Para assinar o app, seria necessário:

1. Pagar $99/ano para conta de desenvolvedor Apple
2. Configurar certificados e notarização
3. Enviar o app para análise da Apple

Como o FinancePass é **gratuito e open source**, optamos por não fazer isso. O código está disponível no GitHub para você verificar que é seguro!

## É seguro?

✅ **Sim!** O FinancePass é:
- 🔓 **Open Source** - código aberto no GitHub
- 🔒 **Offline** - não envia dados para internet
- 🛡️ **Criptografado** - senhas protegidas localmente
- 🆓 **Gratuito** - sem custos ou assinaturas

Você pode verificar o código-fonte completo em: https://github.com/koalitos/FinancePass
