import React, { useState, useRef, useEffect } from 'react';

interface ConnectionBlockProps {
  title: string;
  position: { x: number; y: number };
  isStarter?: boolean;
  onPositionChange: (id: string, newPosition: { x: number; y: number }) => void;
  id: string;
  zoom: number;
  gridOffset: { x: number; y: number };
}

const ConnectionBlock: React.FC<ConnectionBlockProps> = ({ id, title, position, isStarter, onPositionChange, zoom, gridOffset }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const blockRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = (e.clientX - dragStart.x) / zoom;
        const dy = (e.clientY - dragStart.y) / zoom;
        const newPosition = {
          x: position.x + dx,
          y: position.y + dy
        };
        onPositionChange(id, newPosition);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleGridMove = (e: CustomEvent<{ dx: number; dy: number }>) => {
      const { dx, dy } = e.detail;
      const newPosition = {
        x: position.x + dx,
        y: position.y + dy
      };
      onPositionChange(id, newPosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('gridMove', handleGridMove as EventListener);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('gridMove', handleGridMove as EventListener);
    };
  }, [isDragging, dragStart, onPositionChange, id, zoom, position]);

  const blockStyle = {
    position: 'absolute' as 'absolute',
    left: `${(position.x - gridOffset.x) * zoom}px`,
    top: `${(position.y - gridOffset.y) * zoom}px`,
    padding: isStarter ? '20px 40px' : '10px',
    backgroundColor: '#fff',
    border: '1px solid #FFE0B2',
    borderRadius: isStarter ? '20px' : '8px',
    cursor: isDragging ? 'grabbing' : 'grab',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    fontSize: isStarter ? '24px' : '16px',
    fontWeight: isStarter ? 'bold' : 'normal',
    userSelect: 'none' as 'none',
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
  };

  return (
    <div ref={blockRef} style={blockStyle} onMouseDown={handleMouseDown} className="connection-block">
      {title}
    </div>
  );
};

export default ConnectionBlock;
