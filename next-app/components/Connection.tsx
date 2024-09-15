import React from 'react';

interface ConnectionProps {
  position: 'top' | 'right' | 'bottom' | 'left';
  onConnectionClick: () => void;
}

const Connection: React.FC<ConnectionProps> = ({ position, onConnectionClick }) => {
  const getPosition = () => {
    switch (position) {
      case 'top':
        return { top: '0', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'right':
        return { top: '50%', right: '0', transform: 'translate(50%, -50%)' };
      case 'bottom':
        return { bottom: '0', left: '50%', transform: 'translate(-50%, 50%)' };
      case 'left':
        return { top: '50%', left: '0', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '12px',
        height: '12px',
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        cursor: 'pointer',
        ...getPosition(),
      }}
      onClick={onConnectionClick}
    />
  );
};

export default Connection;
