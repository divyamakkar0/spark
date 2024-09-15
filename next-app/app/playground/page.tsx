"use client";
import React, { useState, useEffect } from 'react';
import InfiniteGrid from "../../components/infiniteGrid";
import AddBlockButton from "../../components/AddBlockButton";
import ConnectionBlock from "../../components/ConnectionBlock";

interface Block {
  id: string;
  title: string;
  position: { x: number; y: number };
  isStarter?: boolean;
}

export default function PlayGroundPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    const centerX = window.innerWidth / 2 - 100;
    const centerY = window.innerHeight / 2 - 50;
    setBlocks([
      { id: '1', title: 'Starter', position: { x: centerX, y: centerY }, isStarter: true }
    ]);
  }, []);

  const addBlock = (title: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      title,
      position: {
        x: Math.random() * (window.innerWidth - 200) + 100,
        y: Math.random() * (window.innerHeight - 200) + 100
      }
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlockPosition = (id: string, newPosition: { x: number; y: number }) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, position: newPosition } : block
    ));
  };

  return (
    <>
      <InfiniteGrid>
        {({ zoom, gridOffset }) => (
          <>
            {blocks.map((block) => (
              <ConnectionBlock
                key={block.id}
                id={block.id}
                title={block.title}
                position={block.position}
                isStarter={block.isStarter}
                onPositionChange={updateBlockPosition}
                zoom={zoom}
                gridOffset={gridOffset}
              />
            ))}
          </>
        )}
      </InfiniteGrid>
      <AddBlockButton onAddBlock={addBlock} />
    </>
  );
}