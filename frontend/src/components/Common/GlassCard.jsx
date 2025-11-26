import React from 'react';

const GlassCard = ({ children, className = '', hover = true, gradient = false }) => {
  const baseClasses = `
    card
    ${gradient ? 'bg-gradient-to-br from-primary/10 to-purple-500/10' : ''}
  `;
  
  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
