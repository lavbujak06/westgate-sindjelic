import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="spinner" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .spinner {
   width: 6px;
   height: 6px;
   animation: spinner-xp626r 1.1s infinite;
   border-radius: 50%;
   box-shadow: 24px 0 0 6px #004dff, -24px 0 0 6px #004dff;
  }

  @keyframes spinner-xp626r {
   to {
    transform: rotate(360deg);
   }
  }`;

export default Loader;
