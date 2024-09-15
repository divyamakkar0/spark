import React, { useRef, useEffect, useCallback } from 'react';

interface InfiniteGridProps {
  children: React.ReactNode;
}

const InfiniteGrid: React.FC<InfiniteGridProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const transform = useRef({ x: 0, y: 0, scale: 1 });

  const updateTransform = useCallback(() => {
    if (contentRef.current) {
      const { x, y, scale } = transform.current;
      contentRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }
  }, []);

  const handleMouseDown = (e: MouseEvent) => {
    isDragging.current = true;
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - lastMousePosition.current.x;
    const deltaY = e.clientY - lastMousePosition.current.y;

    transform.current.x += deltaX;
    transform.current.y += deltaY;
    lastMousePosition.current = { x: e.clientX, y: e.clientY };

    requestAnimationFrame(updateTransform);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const { deltaY, clientX, clientY } = e;
      const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
      const newScale = transform.current.scale * zoomFactor;

      // Calculate the position to zoom towards the mouse pointer
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;

        transform.current.x -= (offsetX / transform.current.scale) * (zoomFactor - 1);
        transform.current.y -= (offsetY / transform.current.scale) * (zoomFactor - 1);
      }

      transform.current.scale = newScale;
      requestAnimationFrame(updateTransform);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [updateTransform]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }} ref={containerRef}>
      <div
        ref={contentRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: isDragging.current ? 'grabbing' : 'grab',
          transform: 'translate(0px, 0px) scale(1)',
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
      <input
        type="range"
        min="0.5"
        max="3"
        step="0.1"
        defaultValue="1"
        onChange={(e) => {
          const newZoom = parseFloat(e.target.value);
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            const offsetX = window.innerWidth / 2 - rect.left;
            const offsetY = window.innerHeight / 2 - rect.top;

            // Adjust position to zoom towards the center
            transform.current.x = -offsetX * (newZoom - transform.current.scale);
            transform.current.y = -offsetY * (newZoom - transform.current.scale);
          }
          transform.current.scale = newZoom;
          updateTransform();
        }}
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