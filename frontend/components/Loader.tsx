import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-2">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-[spinner_1.1s_infinite] shadow-[24px_0_0_6px_#004dff,-24px_0_0_6px_#004dff]" />
      <style jsx>{`
        @keyframes spinner {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;