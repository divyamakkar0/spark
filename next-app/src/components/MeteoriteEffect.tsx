'use client'
import React from 'react';

const MeteoriteEffect = () => {
  const meteorites = Array.from({ length: 5 }, (_, i) => {
    const isFromTop = Math.random() > 0.5;
    const angle = 30; // Uniform angle between 30 and 45 degrees

    return {
      id: i,
      delay: Math.random() * 15, // Increased delay range for more randomness
      duration: 8 + Math.random() * 4, // Between 8 and 12 seconds for slower movement
      size: 2 + Math.random() * 3, // Size between 2 and 5
      startPosition: Math.random() * 80 + 10, // Avoid spawning too close to the edges
      isFromTop, // Randomly choose between top and left origin
      angle,
    };
  });

  return (
    <div className="meteorite-container">
      {meteorites.map((meteorite) => (
        <div
          key={meteorite.id}
          className="meteorite"
          style={{
            animationDelay: `${meteorite.delay}s`,
            animationDuration: `${meteorite.duration}s`,
            width: `${meteorite.size * 25}px`,
            height: `${meteorite.size}px`,
            top: meteorite.isFromTop ? `-${meteorite.size * 2}px` : `${meteorite.startPosition}%`,
            left: meteorite.isFromTop ? `${meteorite.startPosition}%` : `-${meteorite.size * 2}px`,
            '--angle': `${meteorite.angle}deg`,
            transformOrigin: meteorite.isFromTop ? 'right center' : 'left center',
          } as React.CSSProperties}
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
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 165, 0, 0.4) 50%,
            transparent
          );
          opacity: 0; /* Hide meteorites initially */
          animation: meteorite linear infinite;
          will-change: transform, opacity; /* Optimize for performance */
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
            transform: translateX(0) translateY(0) rotate(var(--angle));
            opacity: 1; /* Make meteorite visible at the start of animation */
          }
          30% {
            opacity: 1;
          }
          70% {
            opacity: 0;
          }
          100% {
            transform: translateX(200vw) translateY(200vh) rotate(var(--angle));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MeteoriteEffect;