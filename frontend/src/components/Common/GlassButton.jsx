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
    primary: `
      bg-gradient-to-r from-blue-500 to-purple-500 text-white
      shadow-lg shadow-blue-500/50
      hover:shadow-xl hover:shadow-blue-500/60 hover:-translate-y-0.5
      active:translate-y-0
    `,
    secondary: `
      bg-white/5 text-gray-300 border border-white/10
      hover:bg-white/10 hover:border-white/20
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-pink-500 text-white
      shadow-lg shadow-red-500/50
      hover:shadow-xl hover:shadow-red-500/60 hover:-translate-y-0.5
      active:translate-y-0
    `,
    success: `
      bg-gradient-to-r from-green-500 to-emerald-500 text-white
      shadow-lg shadow-green-500/50
      hover:shadow-xl hover:shadow-green-500/60 hover:-translate-y-0.5
      active:translate-y-0
    `,
    ghost: `
      bg-transparent text-gray-300 border border-transparent
      hover:bg-white/5
    `
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      style={{
        backdropFilter: 'blur(10px)'
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;
