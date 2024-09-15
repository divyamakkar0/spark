import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface InfiniteGridProps {
  children: (props: { zoom: number; gridOffset: { x: number; y: number } }) => ReactNode;
}

const InfiniteGrid: React.FC<InfiniteGridProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.connection-block')) return;
      setIsDragging(true);
      setStartX(e.clientX);
      setStartY(e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      setOffsetX(prev => prev + dx / zoom);
      setOffsetY(prev => prev + dy / zoom);
      setStartX(e.clientX);
      setStartY(e.clientY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, startY, zoom]);

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
  };

  return (
    <>
      <div style={{ 
        position: 'relative', 
        width: '1000vw', 
        height: '1000vh', 
        overflow: 'hidden',
      }}>
        <div
          ref={containerRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: isDragging ? 'grabbing' : 'grab',
            background: '#fafafa',
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
            transformOrigin: '0 0',
            userSelect: 'none',
          }}
        >
          {children({ zoom, gridOffset: { x: offsetX, y: offsetY } })}
        </div>
        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%) rotate(-90deg)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={zoom}
            onChange={handleZoomChange}
            style={{
              width: '150px',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default InfiniteGrid;