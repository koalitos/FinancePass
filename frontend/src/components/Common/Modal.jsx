import React from 'react';
import { X } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  icon,
  gradient = 'from-primary to-blue-600',
  children,
  maxWidth = 'max-w-2xl'
}) => {
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`w-full ${maxWidth}`}>
        <div className={`bg-gradient-to-r ${gradient} rounded-t-xl p-6 text-white`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {title}
              </h2>
              {subtitle && <p className="text-white/90 mt-1">{subtitle}</p>}
            </div>
            <button 
              onClick={onClose} 
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="bg-dark-card rounded-b-xl shadow-xl p-8 border border-dark-border max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
