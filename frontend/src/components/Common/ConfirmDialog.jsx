import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'danger' }) => {
  if (!isOpen) return null;

  const typeColors = {
    danger: 'text-danger',
    warning: 'text-warning',
    info: 'text-primary'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-card rounded-lg p-6 w-full max-w-md">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-2 rounded-full bg-${type}/10`}>
            <AlertTriangle className={typeColors[type]} size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-dark-muted">{message}</p>
          </div>
          <button onClick={onClose} className="text-dark-muted hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className={`btn-${type} flex-1`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
