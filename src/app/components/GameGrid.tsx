import React, { useState } from 'react';

interface GridCell {
  content: string;
  anchor: boolean;
  isEmpty: boolean;
  deleted: boolean;
}

interface GameGridProps {
  grid: GridCell[];
  swapsAllowed: boolean;
  onGridTap: () => void;
  onSwap: (fromIndex: number, toIndex: number) => void;
  onDelete?: (index: number) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ 
  grid, 
  swapsAllowed, 
  onGridTap, 
  onSwap,
  onDelete 
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [swappingCells, setSwappingCells] = useState<Set<number>>(new Set());
  const [lastTap, setLastTap] = useState<{ index: number; time: number } | null>(null);

  const handleCellClick = (index: number) => {
    if (!swapsAllowed) {
      // If swaps not allowed (instruction mode), tap anywhere to trigger grid tap
      onGridTap();
      return;
    }
    
    if (grid[index].anchor) return;

    // Check for double tap
    const now = Date.now();
    if (lastTap && lastTap.index === index && now - lastTap.time < 300) {
      // Double tap detected - toggle delete state if not empty
      if (!grid[index].isEmpty && onDelete) {
        onDelete(index);
      }
      setLastTap(null);
      setSelectedIndex(null);
      return;
    }
    
    setLastTap({ index, time: now });

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      // Swap cells with animation
      setSwappingCells(new Set([selectedIndex, index]));
      
      setTimeout(() => {
        onSwap(selectedIndex, index);
        setSelectedIndex(null);
        setSwappingCells(new Set());
      }, 200);
    }
  };

  return (
    <div style={{
      fontFamily: 'var(--font-eb-garamond), "Times New Roman", serif',
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)',
        gap: '4px',
        maxWidth: '400px',
        width: '100%'
      }}>
        {grid.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleCellClick(index)}
            style={{
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              lineHeight: '1',
              color: cell.deleted ? '#ddd' : '#000',
              cursor: !swapsAllowed ? 'pointer' : (cell.anchor ? 'default' : 'pointer'),
              userSelect: 'none',
              minHeight: '35px',
              border: cell.anchor ? '1px dotted #999' : 'none',
              borderRadius: cell.anchor || selectedIndex === index ? '50%' : '0',
              backgroundColor: selectedIndex === index ? '#f9f9f9' : 'transparent',
              transform: swappingCells.has(index) ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              position: 'relative',
              opacity: cell.deleted ? 0.6 : 1
            }}
          >
            <span style={{ position: 'relative', top: '-1px' }}>
              {cell.content}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameGrid; 