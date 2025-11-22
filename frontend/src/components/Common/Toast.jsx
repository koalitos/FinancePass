import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={24} />,
    error: <XCircle size={24} />,
    warning: <AlertCircle size={24} />,
    info: <Info size={24} />
  };

  const colors = {
    success: 'from-green-600 to-emerald-600',
    error: 'from-red-600 to-rose-600',
    warning: 'from-yellow-600 to-orange-600',
    info: 'from-blue-600 to-indigo-600'
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
      <div className={`bg-gradient-to-r ${colors[type]} text-white rounded-xl shadow-2xl p-4 min-w-[300px] max-w-md`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
