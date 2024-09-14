"use client";
import React from 'react';
import InfiniteGrid from "@/components/infiniteGrid";

export default function QueryPage() {
  return (
    <InfiniteGrid>
      <div style={{ 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Query appears at the top here</h1>
        <p style={{ fontSize: '24px' }}>Extra context appears here.</p>
      </div>
      
    </InfiniteGrid>
  );
}