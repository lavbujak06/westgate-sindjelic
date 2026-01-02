import React from 'react';

interface CreateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const CreateButton: React.FC<CreateButtonProps> = ({ children = 'Create', ...props }) => {
  return (
    <button 
      {...props}
      className="inline-flex items-center px-6 py-3 bg-[#00ad54] text-white font-semibold rounded-3xl shadow-lg hover:shadow-[0_0_15px_rgba(0,173,84,0.5)] transition-all duration-300 active:scale-95"
    >
      <div className="mr-2">
        <svg viewBox="0 0 50 50" fill="none" width={24}>
          <circle opacity="0.5" cx={25} cy={25} r={23} fill="url(#p0)" />
          <path fillRule="evenodd" clipRule="evenodd" d="M34.42 15.93c.382-1.145-.706-2.234-1.851-1.852l-18.568 6.189c-1.186.395-1.362 2-.29 2.644l5.12 3.072a1.464 1.464 0 001.733-.167l5.394-4.854a1.464 1.464 0 011.958 2.177l-5.154 4.638a1.464 1.464 0 00-.276 1.841l3.101 5.17c.644 1.072 2.25.896 2.645-.29L34.42 15.93z" fill="#fff" />
          <defs>
            <linearGradient id="p0" x1={25} y1={2} x2={25} y2={48} gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" stopOpacity="0.71" />
              <stop offset={1} stopColor="#fff" stopOpacity={0} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span>{children}</span>
    </button>
  );
};

export default CreateButton;