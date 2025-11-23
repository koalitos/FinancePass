# 🎣 Custom Hooks

## useEscapeKey

Hook para fechar modais/componentes ao pressionar a tecla ESC.

### Uso Básico

```jsx
import { useEscapeKey } from '../../hooks/useEscapeKey';

const MyModal = ({ onClose }) => {
  // Fechar modal com ESC
  useEscapeKey(onClose);
  
  return (
    <div className="modal">
      {/* conteúdo do modal */}
    </div>
  );
};
```

### Uso Condicional

```jsx
import { useEscapeKey } from '../../hooks/useEscapeKey';

const MyComponent = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Só ativa o hook quando o modal está aberto
  useEscapeKey(() => setShowModal(false), showModal);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>Abrir</button>
      {showModal && <Modal />}
    </>
  );
};
```

### Múltiplos Modais

```jsx
import { useEscapeKey } from '../../hooks/useEscapeKey';

const MyComponent = () => {
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  
  // Fechar qualquer modal aberto com ESC
  useEscapeKey(() => {
    if (showModal1) setShowModal1(false);
    if (showModal2) setShowModal2(false);
  }, showModal1 || showModal2);
  
  return (
    <>
      {showModal1 && <Modal1 />}
      {showModal2 && <Modal2 />}
    </>
  );
};
```

### Com Limpeza de Estado

```jsx
import { useEscapeKey } from '../../hooks/useEscapeKey';

const MyModal = ({ onClose }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  
  // Fechar e limpar estado
  useEscapeKey(() => {
    onClose();
    setFormData({});
    setError('');
  });
  
  return <div className="modal">{/* ... */}</div>;
};
```

## Componentes já atualizados

- ✅ `PasswordForm` - Fechar formulário de senha com ESC
- ✅ `PersonForm` - Fechar formulário de pessoa com ESC
- ✅ `BackupManager` - Fechar modais de backup/restore com ESC

## Para aplicar em outros componentes

1. Importe o hook:
```jsx
import { useEscapeKey } from '../../hooks/useEscapeKey';
```

2. Use no componente:
```jsx
useEscapeKey(onClose);
```

3. Se for condicional:
```jsx
useEscapeKey(() => setShowModal(false), showModal);
```

## Componentes que ainda precisam

- [ ] `ExpenseForm`
- [ ] `IncomeForm`
- [ ] `DebtForm`
- [ ] `BillForm`
- [ ] `InstallmentForm`
- [ ] `SystemStatus` (modais de backup/restore)
- [ ] Outros modais de confirmação
