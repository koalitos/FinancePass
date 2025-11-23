import { useState } from 'react';

/**
 * Hook para gerenciar modais de confirmação
 * @returns {Object} { isOpen, data, confirm, cancel, ConfirmModal }
 */
export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({
    title: 'Confirmar ação',
    message: 'Deseja continuar?',
    onConfirm: () => {},
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'warning'
  });

  const confirm = ({
    title = 'Confirmar ação',
    message = 'Deseja continuar?',
    onConfirm = () => {},
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'warning'
  }) => {
    setConfirmData({
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      type
    });
    setIsOpen(true);
  };

  const cancel = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    data: confirmData,
    confirm,
    cancel
  };
};

export default useConfirm;
