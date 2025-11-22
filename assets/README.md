# 🎨 Assets - FinancePass

Esta pasta contém os ícones e recursos visuais do aplicativo.

## 📁 Estrutura

```
assets/
├── icon.png       # Ícone principal (512x512)
├── icon.ico       # Ícone para Windows
├── icon.icns      # Ícone para macOS
└── README.md      # Este arquivo
```

## 🎨 Especificações dos Ícones

### icon.png
- **Tamanho**: 512x512 pixels
- **Formato**: PNG com transparência
- **Uso**: Linux AppImage, web, documentação

### icon.ico
- **Tamanho**: Multi-resolução (16x16, 32x32, 48x48, 256x256)
- **Formato**: ICO
- **Uso**: Aplicativo Windows

### icon.icns
- **Tamanho**: Multi-resolução
- **Formato**: ICNS
- **Uso**: Aplicativo macOS

## 🛠️ Como Criar os Ícones

### Opção 1: Ferramentas Online

1. Crie uma imagem PNG de 1024x1024 pixels
2. Use ferramentas online para converter:
   - **Para .ico**: [icoconvert.com](https://icoconvert.com/)
   - **Para .icns**: [cloudconvert.com](https://cloudconvert.com/png-to-icns)

### Opção 2: Electron Icon Maker (Recomendado)

```bash
# Instalar globalmente
npm install -g electron-icon-maker

# Gerar todos os ícones a partir de um PNG
electron-icon-maker --input=icon.png --output=./assets
```

## 💡 Sugestão de Design

Um ícone que combine elementos de:
- 💰 **Dinheiro/Moeda**: Representa finanças
- 🔐 **Cadeado**: Representa segurança e privacidade
- 📊 **Gráfico**: Representa análise e controle

### Recomendações de Design

- ✅ Use uma imagem quadrada de alta resolução (1024x1024 ou maior)
- ✅ Fundo transparente
- ✅ Design simples e reconhecível em tamanhos pequenos
- ✅ Cores que representem finanças e segurança (verde, azul, roxo)
- ✅ Contraste adequado para tema claro e escuro

### Paleta de Cores Sugerida

```
Primary: #6366f1 (Azul/Roxo)
Secondary: #8b5cf6 (Roxo)
Success: #10b981 (Verde)
Accent: #f59e0b (Dourado)
```

## 📜 Licença

Os ícones seguem a mesma licença do projeto: **CC BY-NC 4.0**

✅ Você pode modificar e redistribuir
❌ Não pode usar comercialmente

---

**Dica**: Se você criar um ícone legal para o projeto, considere contribuir! Abra um PR no GitHub.
