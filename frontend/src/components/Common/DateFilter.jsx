import React from 'react';
import { Calendar } from 'lucide-react';

const DateFilter = ({ startDate, endDate, onStartChange, onEndChange }) => {
  return (
    <div className="flex gap-3 items-center">
      <div className="relative flex-1">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted" size={18} />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="input pl-10 text-sm"
        />
      </div>
      <span className="text-dark-muted">até</span>
      <div className="relative flex-1">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted" size={18} />
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="input pl-10 text-sm"
        />
      </div>
    </div>
  );
};

export default DateFilter;
