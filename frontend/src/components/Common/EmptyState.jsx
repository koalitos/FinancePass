import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-dark-bg flex items-center justify-center mb-4">
          <Icon size={32} className="text-dark-muted" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-dark-muted mb-4">{description}</p>}
      {action && action}
    </div>
  );
};

export default EmptyState;
