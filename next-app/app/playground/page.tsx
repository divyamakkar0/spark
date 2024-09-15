"use client";
import React, { useState, useEffect } from 'react';
import InfiniteGrid from "../../components/infiniteGrid";
import AddBlockButton from "../../components/AddBlockButton";
import ConnectionBlock from "../../components/ConnectionBlock";

interface Block {
  id: string;
  title: string;
  description: string;
  position: { x: number; y: number };
  isStarter?: boolean;
}

interface Connection {
  id: string;
  from: { id: string; position: 'top' | 'right' | 'bottom' | 'left' };
  to: { id: string; position: 'top' | 'right' | 'bottom' | 'left' };
}

export default function PlayGroundPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeConnection, setActiveConnection] = useState<{ id: string; position: 'top' | 'right' | 'bottom' | 'left' } | null>(null);

  useEffect(() => {
    const centerX = window.innerWidth / 2 - 150;
    const centerY = window.innerHeight / 2 - 75;
    setBlocks([
      { 
        id: '1', 
        title: 'Company Description', 
        description: 'FinTechs in San Francisco with\n<100 employees that recently raised funding', 
        position: { x: centerX, y: centerY }, 
        isStarter: true 
      }
    ]);
  }, []);

  const addBlock = (title: string, userQuery: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      title,
      description: userQuery, // The new line will be added in the ConnectionBlock component
      position: {
        x: Math.random() * (window.innerWidth - 300) + 150,
        y: Math.random() * (window.innerHeight - 150) + 75
      }
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlockPosition = (id: string, newPosition: { x: number; y: number }) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, position: newPosition } : block
    ));
  };

  const handleConnectionClick = (id: string, position: 'top' | 'right' | 'bottom' | 'left') => {
    if (!activeConnection) {
      setActiveConnection({ id, position });
    } else if (activeConnection.id !== id) {
      const newConnection: Connection = {
        id: Date.now().toString(),
        from: activeConnection,
        to: { id, position },
      };
      setConnections([...connections, newConnection]);
      setActiveConnection(null);
    } else {
      setActiveConnection(null);
    }
  };

  const renderConnections = () => {
    return connections.map((connection) => {
      const fromBlock = blocks.find(block => block.id === connection.from.id);
      const toBlock = blocks.find(block => block.id === connection.to.id);
      if (!fromBlock || !toBlock) return null;

      const fromPos = getConnectionPosition(fromBlock, connection.from.position);
      const toPos = getConnectionPosition(toBlock, connection.to.position);

      return (
        <svg key={connection.id} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <line
            x1={fromPos.x}
            y1={fromPos.y}
            x2={toPos.x}
            y2={toPos.y}
            stroke="orange"
            strokeWidth="2"
          />
        </svg>
      );
    });
  };

  const getConnectionPosition = (block: Block, position: 'top' | 'right' | 'bottom' | 'left') => {
    const { x, y } = block.position;
    const width = 200; // Assuming block width
    const height = 100; // Assuming block height

    switch (position) {
      case 'top':
        return { x: x + width / 2, y };
      case 'right':
        return { x: x + width, y: y + height / 2 };
      case 'bottom':
        return { x: x + width / 2, y: y + height };
      case 'left':
        return { x, y: y + height / 2 };
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <InfiniteGrid>
        {({ zoom, gridOffset }) => (
          <>
            {blocks.map((block) => (
              <ConnectionBlock
                key={block.id}
                id={block.id}
                title={block.title}
                description={block.description}
                position={block.position}
                isStarter={block.isStarter}
                onPositionChange={updateBlockPosition}
                onConnectionClick={handleConnectionClick}
                zoom={zoom}
                gridOffset={gridOffset}
              />
            ))}
            {renderConnections()}
          </>
        )}
      </InfiniteGrid>
      <AddBlockButton onAddBlock={addBlock} />
    </div>
  );
}