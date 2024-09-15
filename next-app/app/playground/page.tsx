"use client";
import React from 'react';
import InfiniteGrid from "../../components/infiniteGrid";
import AddBlockButton from "../../components/AddBlockButton";

export default function PlayGroundPage() {
  return (
    <>
      <InfiniteGrid>
        <div style={{ 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center',
          cursor: 'default',
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px', cursor: 'text' }}>Playground Page</h1>
        </div>
      </InfiniteGrid>
      <AddBlockButton />
    </>
  );
}