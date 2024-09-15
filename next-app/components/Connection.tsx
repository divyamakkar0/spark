import React from 'react';

interface ConnectionProps {
  position: 'top' | 'right' | 'bottom' | 'left';
  onConnectionClick: () => void;
}

const Connection: React.FC<ConnectionProps> = ({ position, onConnectionClick }) => {
  const getPosition = () => {
    switch (position) {
      case 'top':
        return { top: '-5px', left: '50%', transform: 'translateX(-50%)' };
      case 'right':
        return { top: '50%', right: '-5px', transform: 'translateY(-50%)' };
      case 'bottom':
        return { bottom: '-5px', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { top: '50%', left: '-5px', transform: 'translateY(-50%)' };
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        cursor: 'pointer',
        ...getPosition(),
      }}
      onClick={onConnectionClick}
    />
  );
};

export default Connection;
