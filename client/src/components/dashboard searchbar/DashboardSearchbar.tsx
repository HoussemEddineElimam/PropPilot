import React from 'react';
import './DashboardSearchbar.css';
import { Search } from 'lucide-react';

interface DashboardSearchbarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const DashboardSearchbar: React.FC<DashboardSearchbarProps> = ({ placeholder, value, onChange }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={handleInputChange}
        className="searchbar-input"
      />
      <span className="searchbar-icon"><Search/></span>
    </div>
  );
};

export default DashboardSearchbar;