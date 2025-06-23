
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import './SimpleThemeToggle.css';

interface SimpleThemeToggleProps {
  isDarkMode: boolean;
  onToggle: (isDark: boolean) => void;
}

const SimpleThemeToggle: React.FC<SimpleThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <div className="theme">
      <input
        type="checkbox"
        className="input"
        checked={isDarkMode}
        onChange={(e) => onToggle(e.target.checked)}
      />
      <Moon className="icon icon-moon" size={26} />
      <Sun className="icon icon-sun" size={26} />
    </div>
  );
};

export default SimpleThemeToggle;
