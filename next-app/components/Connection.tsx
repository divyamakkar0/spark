import React from 'react';

interface ConnectionProps {
  position: 'top' | 'right' | 'bottom' | 'left';
  onConnectionClick: () => void;
}

const Connection: React.FC<ConnectionProps> = ({ position, onConnectionClick }) => {
  const getPosition = () => {
    switch (position) {
      case 'top':
        return { top: '-6px', left: '50%', transform: 'translate(-50%, -45%)' };
      case 'right':
        return { top: '50%', right: '-6px', transform: 'translate(50%, -50%)' };
      case 'bottom':
        return { bottom: '-6px', left: '50%', transform: 'translate(-50%, 50%)' };
      case 'left':
        return { top: '50%', left: '-6px', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '10px',
        height: '10px',
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        cursor: 'pointer',
        ...getPosition(),
      }}
      onClick={(e) => {
        e.stopPropagation();
        onConnectionClick();
      }}
    />
  );
};

export default Connection;
