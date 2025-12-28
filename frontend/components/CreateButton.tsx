import React from 'react';
import styled from 'styled-components';

interface CreateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const CreateButton: React.FC<CreateButtonProps> = ({ children = 'Create', ...props }) => {
  return (
    <StyledWrapper>
      <button className="button" {...props}>
        <span className="button-decor" />
        <div className="button-content">
          <div className="button__icon">
            <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width={24}>
              <circle opacity="0.5" cx={25} cy={25} r={23} fill="url(#paint0_linear)" />
              <mask id="a" fill="#fff">
                <path fillRule="evenodd" clipRule="evenodd" d="M34.42 15.93c.382-1.145-.706-2.234-1.851-1.852l-18.568 6.189c-1.186.395-1.362 2-.29 2.644l5.12 3.072a1.464 1.464 0 001.733-.167l5.394-4.854a1.464 1.464 0 011.958 2.177l-5.154 4.638a1.464 1.464 0 00-.276 1.841l3.101 5.17c.644 1.072 2.25.896 2.645-.29L34.42 15.93z" />
              </mask>
              <path fillRule="evenodd" clipRule="evenodd" d="M34.42 15.93c.382-1.145-.706-2.234-1.851-1.852l-18.568 6.189c-1.186.395-1.362 2-.29 2.644l5.12 3.072a1.464 1.464 0 001.733-.167l5.394-4.854a1.464 1.464 0 011.958 2.177l-5.154 4.638a1.464 1.464 0 00-.276 1.841l3.101 5.17c.644 1.072 2.25.896 2.645-.29L34.42 15.93z" fill="#fff" />
              <defs>
                <linearGradient id="paint0_linear" x1={25} y1={2} x2={25} y2={48} gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fff" stopOpacity="0.71" />
                  <stop offset={1} stopColor="#fff" stopOpacity={0} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="button__text">{children}</span>
        </div>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    text-decoration: none;
    line-height: 1;
    border-radius: 1.5rem;
    overflow: hidden;
    position: relative;
    box-shadow: 10px 10px 20px rgba(0,0,0,.05);
    background-color: #00ad54;
    color: #fff;
    border: none;
    cursor: pointer;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
  }

  .button:hover {
    box-shadow: 0 0 15px rgba(0, 173, 84, 0.5);
  }

  .button__icon {
    width: 24px;
    height: 24px;
    margin-right: 0.5rem;
    display: grid;
    place-items: center;
  }

  .button__text {
    display: inline-block;
  }
`;

export default CreateButton;
