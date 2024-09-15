import React from 'react';

interface ConnectionProps {
  position: 'top' | 'right' | 'bottom' | 'left';
  onConnectionClick: () => void;
}

const Connection: React.FC<ConnectionProps> = ({ position, onConnectionClick }) => {
  const getPosition = () => {
    switch (position) {
      case 'top':
        return { top: '-6px', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'right':
        return { top: '50%', right: '-6px', transform: 'translate(50%, -50%)' };
      case 'bottom':
        return { bottom: '-6px', left: '50%', transform: 'translate(-50%, 50%)' };
      case 'left':
        return { top: '50%', left: '-6px', transform: 'translate(-50%, -50%)' };
      default:
        return {};
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '12px',
        height: '12px',
        backgroundColor: 'rgba(255, 165, 0, 0.6)',
        borderRadius: '50%',
        opacity: '0',
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
