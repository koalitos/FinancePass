import React from 'react';

const GlassCard = ({ children, className = '', hover = true, gradient = false }) => {
  const baseClasses = `
    rounded-xl p-5 border border-white/10 transition-all duration-300 overflow-visible
    ${gradient 
      ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10' 
      : 'bg-white/5'
    }
  `;
  
  const hoverClasses = hover ? `
    hover:bg-white/10 hover:border-blue-500/30 
    hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1
  ` : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      style={{
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        overflow: 'visible'
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
