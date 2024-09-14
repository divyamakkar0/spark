import React, { useState, useRef, useEffect } from 'react';

interface InfiniteGridProps {
  children: React.ReactNode;
}

const InfiniteGrid: React.FC<InfiniteGridProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [center, setCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        setOffsetX(prev => prev + deltaX / zoom);
        setOffsetY(prev => prev + deltaY / zoom);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [zoom]);

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      setCenter({ x: centerX, y: centerY });
      setZoom(newZoom);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: '#fafafa',
          backgroundImage: 'radial-gradient(#d3d3d3 1px, transparent 1px)',
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${offsetX}px ${offsetY}px`,
        }}
      >
        <div
          style={{
            transform: `scale(${zoom}) translate(${offsetX - center.x * (1 - 1/zoom)}px, ${offsetY - center.y * (1 - 1/zoom)}px)`,
            transformOrigin: '0 0',
            transition: 'transform 0.1s ease-out',
          }}
        >
          {children}
        </div>
      </div>
      <input
        type="range"
        min="0.1"
        max="5"
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