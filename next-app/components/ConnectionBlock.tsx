import React, { useState, useRef, useEffect } from 'react';
import Connection from './Connection';

interface ConnectionBlockProps {
  title: string;
  description: string;
  position: { x: number; y: number };
  isStarter?: boolean;
  onPositionChange: (id: string, newPosition: { x: number; y: number }) => void;
  onConnectionClick: (id: string, position: 'top' | 'right' | 'bottom' | 'left') => void;
  id: string;
  zoom: number;
  gridOffset: { x: number; y: number };
}

const ConnectionBlock: React.FC<ConnectionBlockProps> = ({
  id,
  title,
  description,
  position,
  isStarter,
  onPositionChange,
  onConnectionClick,
  zoom,
  gridOffset
}) => {
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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, onPositionChange, id, zoom, position]);

  const blockStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #FFE0B2',
    borderRadius: '12px',
    cursor: isDragging ? 'grabbing' : 'grab',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    userSelect: 'none',
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    width: '300px',
    minHeight: '150px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '16px',
    marginTop: '10px',
    whiteSpace: 'pre-wrap',
  };

  return (
    <div ref={blockRef} style={blockStyle} onMouseDown={handleMouseDown} className="connection-block">
      <div style={titleStyle}>{title}</div>
      {!isStarter && <div style={descriptionStyle}>{description}</div>}
      <Connection position="top" onConnectionClick={() => onConnectionClick(id, 'top')} />
      <Connection position="right" onConnectionClick={() => onConnectionClick(id, 'right')} />
      <Connection position="bottom" onConnectionClick={() => onConnectionClick(id, 'bottom')} />
      <Connection position="left" onConnectionClick={() => onConnectionClick(id, 'left')} />
    </div>
  );
};

export default ConnectionBlock;
