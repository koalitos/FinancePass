import React from 'react';

const GlassButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'bg-success hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-medium',
    ghost: 'bg-transparent hover:bg-dark-border text-dark-text px-4 py-2 rounded-lg transition font-medium'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;
