import React from 'react';
import { X } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar ação', 
  message = 'Deseja continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning' // 'warning', 'danger', 'info'
}) => {
  // Fechar com ESC
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  const typeStyles = {
    warning: {
      icon: '⚠️',
      gradient: 'from-yellow-600 to-orange-600',
      button: 'from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
    },
    danger: {
      icon: '🗑️',
      gradient: 'from-red-600 to-rose-600',
      button: 'from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
    },
    info: {
      icon: 'ℹ️',
      gradient: 'from-blue-600 to-indigo-600',
      button: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
    }
  };

  const style = typeStyles[type] || typeStyles.warning;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-dark-card rounded-xl shadow-2xl max-w-md w-full border border-dark-border animate-slide-up">
        {/* Header */}
        <div className={`bg-gradient-to-r ${style.gradient} p-4 rounded-t-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{style.icon}</div>
              <h3 className="text-white font-bold text-lg">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-dark-text whitespace-pre-line">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 bg-dark-border text-dark-text py-3 px-4 rounded-lg hover:bg-dark-border/70 transition-all font-semibold"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 bg-gradient-to-r ${style.button} text-white py-3 px-4 rounded-lg transition-all font-semibold`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
