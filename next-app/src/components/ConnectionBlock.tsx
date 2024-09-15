import React, { useState, useRef, useEffect } from 'react';

interface ConnectionBlockProps {
  title: string;
  position: { x: number; y: number };
  isStarter?: boolean;
  onPositionChange: (id: string, newPosition: { x: number; y: number }) => void;
  id: string;
}

const ConnectionBlock: React.FC<ConnectionBlockProps> = ({ id, title, position, isStarter, onPositionChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const blockRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - offset.x,
          y: e.clientY - offset.y
        };
        onPositionChange(id, newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset, onPositionChange, id]);

  const blockStyle = {
    position: 'absolute' as 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    padding: isStarter ? '20px 40px' : '10px',
    backgroundColor: '#fff',
    border: '1px solid #FFE0B2',
    borderRadius: isStarter ? '20px' : '8px',
    cursor: isDragging ? 'grabbing' : 'grab',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    fontSize: isStarter ? '24px' : '16px',
    fontWeight: isStarter ? 'bold' : 'normal',
    userSelect: 'none' as 'none',
  };

  return (
    <div ref={blockRef} style={blockStyle} onMouseDown={handleMouseDown}>
      {title}
    </div>
  );
};

export default ConnectionBlock;
