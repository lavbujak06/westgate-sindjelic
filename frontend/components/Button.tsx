'use client';

import React from 'react';
import styled from 'styled-components';

const Button = ({ text, onClick }: { text: string, onClick?: () => void }) => {
  return (
    <StyledWrapper>
      <button className="animated-button" onClick={onClick}>
        <svg viewBox="0 0 24 24" className="arr-2">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
        <span className="text">{text}</span>
        <span className="circle" />
        <svg viewBox="0 0 24 24" className="arr-1">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* paste all your previous Button CSS here */
`;

export default Button;
