import React, { useState, useRef, useEffect, ReactNode, useLayoutEffect } from 'react';
import Head from 'next/head';

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

  useLayoutEffect(() => {
    const preventDefault = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    document.addEventListener('wheel', preventDefault, { passive: false });
    return () => document.removeEventListener('wheel', preventDefault);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.connection-block')) return;
      setIsDragging(true);
      setStartX(e.clientX);
      setStartY(e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = (e.clientX - startX) / zoom;
      const dy = (e.clientY - startY) / zoom;
      setOffsetX(prevOffsetX => prevOffsetX + dx);
      setOffsetY(prevOffsetY => prevOffsetY + dy);
      setStartX(e.clientX);
      setStartY(e.clientY);

      // Update all blocks' positions
      const event = new CustomEvent('gridMove', { detail: { dx, dy } });
      window.dispatchEvent(event);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [zoom, isDragging, offsetX, offsetY]);

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <div style={{ 
        position: 'relative', 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
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
            backgroundImage: 'radial-gradient(#d3d3d3 1px, transparent 1px)',
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${offsetX * zoom}px ${offsetY * zoom}px`,
            overflow: 'hidden',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
              transformOrigin: '0 0',
              transition: 'transform 0.1s ease-out',
            }}
          >
            {children({ zoom, gridOffset: { x: offsetX, y: offsetY } })}
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
    </>
  );
};

export default InfiniteGrid;