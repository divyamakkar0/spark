"use client";
import React, { useState, useEffect } from "react";
import InfiniteGrid from "../../components/infiniteGrid2";
import AddBlockButton from "../../components/AddBlockButton";
import ConnectionBlock from "../../components/ConnectionBlock";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
interface Block {
  id: string;
  title: string;
  description: string;
  position: { x: number; y: number };
  isStarter?: boolean;
}

interface Connection {
  id: string;
  from: { id: string; position: "top" | "right" | "bottom" | "left" };
  to: { id: string; position: "top" | "right" | "bottom" | "left" };
}

export default function PlayGroundPage() {
  const router = useRouter();
  const companies = useQuery(api.tasks.get);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeConnection, setActiveConnection] = useState<{
    id: string;
    position: "top" | "right" | "bottom" | "left";
    x: number;
    y: number;
  } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const centerX = window.innerWidth / 2 - 150;
    const centerY = window.innerHeight / 2 - 75;
    setBlocks([
      {
        id: "1",
        title: "Company Description",
        description:
          "FinTechs in San Francisco with\n<100 employees that recently raised funding",
        position: { x: centerX, y: centerY },
        isStarter: true,
      },
    ]);
  }, []);

  const [currentPage, setCurrentPage] = useState('playground');

  // Add these Convex mutations
  const processCategoryBlock = useMutation(api.tasks.addCategories);
  // const processCompanyBlock = useMutation(api.blocks.processCompanyBlock);
  // const processProductBlock = useMutation(api.blocks.processProductBlock);

  const togglePage = async () => {
    const newPage = currentPage === 'query' ? 'playground' : 'query';

    console.log("Submitted query:");
    const params = { company_ids: companies?.slice(0, 25).map(company => company._id) || [] };
    const address = `http://10.39.65.191:4333/get_info`
    console.log(address);
    console.log(params);
    const response = await fetch(address, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ params }),
    });

    let data = await response.json();
    data = data.data
    console.log(data);
    // createNewCompanySearch({data: data});
    // resetCategories();

    router.push('/query');
  };

  const toggleDotStyle = {
    position: 'absolute' as const,
    top: '3px',
    left: currentPage === 'query' ? '3px' : '33px',
    width: '24px',
    height: '24px',
    backgroundColor: 'rgba(255, 165, 0, 0.6)', // More transparent
    borderRadius: '50%',
    transition: 'left 0.3s',
  };


  const toggleContainerStyle = {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    width: '60px',
    height: '30px',
    backgroundColor: 'rgba(255, 165, 0, 0.1)', // More transparent
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    zIndex: 1000,
  };

  const addBlock = (title: string, userQuery: string | number | File) => {
    let description = typeof userQuery === 'string' ? userQuery : 'File uploaded';
    if (title === 'Category') {
      description = `${userQuery}`;
    } else if (title === 'Resume') {
      description = `Resume file: ${(userQuery as File).name}`;
    }
    const newBlock: Block = {
      id: Date.now().toString(),
      title,
      description,
      position: {
        x: Math.random() * (window.innerWidth - 300) + 150,
        y: Math.random() * (window.innerHeight - 150) + 75,
      },
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlockPosition = (
    id: string,
    newPosition: { x: number; y: number }
  ) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, position: newPosition } : block
      )
    );
  };

  const handleConnectionClick = (
    id: string,
    position: "top" | "right" | "bottom" | "left",
    x: number,
    y: number
  ) => {
    if (!activeConnection) {
      setActiveConnection({ id, position, x, y });
    } else if (activeConnection.id !== id) {
      const newConnection: Connection = {
        id: Date.now().toString(),
        from: { id: activeConnection.id, position: activeConnection.position },
        to: { id, position },
      };
      setConnections([...connections, newConnection]);
      setActiveConnection(null);
    } else {
      setActiveConnection(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const renderConnections = () => {
    return connections.map((connection) => {
      const fromBlock = blocks.find((block) => block.id === connection.from.id);
      const toBlock = blocks.find((block) => block.id === connection.to.id);
      if (!fromBlock || !toBlock) return null;

      const fromPos = getConnectionPosition(
        fromBlock,
        connection.from.position
      );
      const toPos = getConnectionPosition(toBlock, connection.to.position);

      return (
        <svg
          key={connection.id}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <path
            d={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}
            fill="none"
            stroke="orange"
            strokeWidth="2"
          />
        </svg>
      );
    });
  };

  const renderActiveConnection = () => {
    if (!activeConnection) return null;

    const fromBlock = blocks.find((block) => block.id === activeConnection.id);
    if (!fromBlock) return null;

    const fromPos = getConnectionPosition(fromBlock, activeConnection.position);
    const toPos = { x: mousePosition.x, y: mousePosition.y };

    return (
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <path
          d={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}
          fill="none"
          stroke="rgba(255, 165, 0, 0.5)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
    );
  };

  const getConnectionPosition = (
    block: Block,
    position: "top" | "right" | "bottom" | "left"
  ) => {
    const { x, y } = block.position;
    const width = 300; // Max width of the block
    const height = 150; // Approximate height, adjust as needed

    switch (position) {
      case "top":
        return { x: x + width / 2, y: y - 6 };
      case "right":
        return { x: x + width + 6, y: y + height / 2 };
      case "bottom":
        return { x: x + width / 2, y: y + height + 6 };
      case "left":
        return { x: x - 6, y: y + height / 2 };
    }
  };

  return (
    <div
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      onMouseMove={handleMouseMove}
    >
      <Link href={currentPage === 'query' ? '/playground' : '/query'}>
        <div
          onClick={togglePage}
          style={toggleContainerStyle}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 165, 0, 0.3)'} // More transparent on hover
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 165, 0, 0.1)'}
        >
          <div style={toggleDotStyle} />
        </div>
      </Link>
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
            {renderActiveConnection()}
          </>
        )}
      </InfiniteGrid>
      <AddBlockButton onAddBlock={addBlock} />
    </div>
  );
}
