'use client'
import React from 'react';

const MeteoriteEffect = () => {
  const meteorites = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5, // Increased delay for fewer meteors at once
    duration: 6 + Math.random() * 3, // Between 6 and 10 seconds for slower movement
    size: 2 + Math.random() * 3, // Size between 2 and 5
    startPosition: Math.random() * 100, // Random start position along the top-left edge
  }));

  return (
    <div className="meteorite-container">
      {meteorites.map(meteorite => (
        <div
          key={meteorite.id}
          className="meteorite"
          style={{
            animationDelay: `${meteorite.delay}s`,
            animationDuration: `${meteorite.duration}s`,
            width: `${meteorite.size * 25}px`,
            height: `${meteorite.size}px`,
            top: `${meteorite.startPosition}%`,
            left: `${-meteorite.startPosition}%`,
          }}
        >
          <div
            className="meteorite-head"
            style={{ width: `${meteorite.size * 2}px`, height: `${meteorite.size * 2}px` }}
          ></div>
        </div>
      ))}
      <style jsx>{`
        .meteorite-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: -1;
        }
        .meteorite {
          position: absolute;
          background: linear-gradient(to right, transparent, rgba(255, 165, 0, 0.4) 50%, transparent);
          transform-origin: right center;
          animation: meteorite linear infinite;
        }
        .meteorite-head {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 50%;
          background-color: #FFA500;
          box-shadow: 0 0 10px 2px #FFA500;
        }
        @keyframes meteorite {
          0% {
            transform: translateX(0) translateY(0) rotate(45deg);
            opacity: 1;
          }
          30% {
            opacity: 1;
          }
          70% {
            opacity: 0;
          }
          100% {
            transform: translateX(150vw) translateY(150vh) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MeteoriteEffect;