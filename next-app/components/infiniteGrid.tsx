import React, { useState, useRef, useEffect } from 'react';

interface InfiniteGridProps {
  children: React.ReactNode;
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
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartX(e.clientX - offsetX);
      setStartY(e.clientY - offsetY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newOffsetX = (e.clientX - startX) / zoom;
      const newOffsetY = (e.clientY - startY) / zoom;
      setOffsetX(newOffsetX);
      setOffsetY(newOffsetY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', preventZoom, { passive: false });

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', preventZoom);
    };
  }, [zoom, isDragging, offsetX, offsetY, startX, startY]);

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
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
          backgroundImage: 'radial-gradient(#d3d3d3 1px, transparent 1px)',
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${offsetX * zoom}px ${offsetY * zoom}px`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
            transformOrigin: '0 0',
            transition: 'transform 0.1s ease-out',
          }}
        >
          {children}
        </div>
      </div>
      <input
        type="range"
        min="0.5"
        max="3"
        step="0.1"
        value={zoom}
        onChange={handleZoomChange}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          transformOrigin: 'right center',
          height: '200px',
        }}
      />
    </div>
  );
};

export default InfiniteGrid;