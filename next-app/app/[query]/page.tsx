
"use client";
import React from 'react';
import InfiniteGrid from "@/components/infiniteGrid";

export default function QueryPage() {
  return (
    <InfiniteGrid>
      <div style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Query Page</h1>
        <p style={{ fontSize: '24px' }}>This content will move with zoom and pan.</p>
      </div>
    </InfiniteGrid>
  );
}