import React from 'react';
import { Search } from 'lucide-react';

const SearchFilter = ({ value, onChange, placeholder = "Buscar..." }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted" size={20} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-10"
      />
    </div>
  );
};

export default SearchFilter;
