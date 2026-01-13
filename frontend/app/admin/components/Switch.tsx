'use client';
import React from 'react';

interface SwitchProps {
  checked: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ checked, onToggle, disabled }) => {
  return (
    <div className="flex items-center">
      <label
        className={`relative inline-block w-12 h-6 cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={!disabled ? onToggle : undefined}
          className="sr-only peer"
          disabled={disabled}
        />
        <div className="absolute inset-0 bg-slate-700 rounded-full transition-colors duration-200 peer-checked:bg-green-500" />
        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-6" />
      </label>
    </div>
  );
};

export default Switch;
