import React from 'react';

interface SpinnerProps {
  size?: number;
  color?: string;
  inline?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 50, color = '#FF4500', inline = false }) => {
  const spinnerStyle = {
    border: `${size / 8}px solid rgba(255, 69, 0, 0.3)`,
    borderLeftColor: color,
    borderRadius: '50%',
    width: `${size}px`,
    height: `${size}px`,
    animation: 'spin 1s linear infinite',
  };

  const containerStyle = inline
    ? { display: 'inline-block' }
    : {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;