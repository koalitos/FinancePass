import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Carregando...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizeClasses[size]} border-4 border-dark-border border-t-primary rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-dark-muted">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
