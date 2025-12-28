'use client';

import React from 'react';
import styled from 'styled-components';

interface SwitchProps {
  checked: boolean;
  onToggle?: () => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onToggle }) => {
  return (
    <SwitchWrapper>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <div className="slider" />
      </label>
    </SwitchWrapper>
  );
};

const SwitchWrapper = styled.div`
  .switch {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 24px;
  }

  .switch input {
    display: none;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    background-color: #838383;
    border-radius: 24px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: 0.2s;
  }

  .slider::before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.2s;
  }

  input:checked + .slider {
    background-color: #00da50;
  }

  input:checked + .slider::before {
    transform: translateX(22px);
  }
`;

export default Switch;
