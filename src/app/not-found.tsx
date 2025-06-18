"use client"

import React, { useState, useEffect } from 'react';
import GameGrid from '@/app/components/GameGrid';
import { useRouter } from 'next/navigation';
import { getTodayDateString, dateToGrid } from './utils/dateToSeed';
import { encodeGridCompact } from './utils/gridEncoding';

interface GridCell {
  content: string;
  anchor: boolean;
  isEmpty: boolean;
  deleted: boolean;
}

const NotFound = () => {
  const router = useRouter();
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [swapsAllowed, setSwapsAllowed] = useState(false);

  // Initialize grid
  useEffect(() => {
      const message = "lost in the labyrinth of links, you wandered here where pages fear to dwell...";
      const instructionGrid: GridCell[] = [];
      
      // Create 81 cell grid (9x9) with the message
      for (let i = 0; i < 81; i++) {
        if (i < message.length) {
          instructionGrid.push({
            content: message[i] === ' ' ? '' : message[i],
            anchor: false,
            isEmpty: message[i] === ' ',
            deleted: false
          });
        } else {
          instructionGrid.push({
            content: '',
            anchor: false,
            isEmpty: true,
            deleted: false
          });
        }
      }

      // Add some circles to the instruction grid (at positions with letters)
      const letterIndices = instructionGrid
        .map((cell, i) => cell.content && /[a-z]/.test(cell.content) ? i : null)
        .filter(i => i !== null) as number[];
      
      if (letterIndices.length >= 3) {
        // Shuffle and take first 3
        for (let i = letterIndices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [letterIndices[i], letterIndices[j]] = [letterIndices[j], letterIndices[i]];
        }
        
        for (let i = 0; i < 3; i++) {
          instructionGrid[letterIndices[i]].anchor = true;
        }
      }
      
      setGrid(instructionGrid);
      setSwapsAllowed(false);
  }, []);

  const handleGridTap = () => {
    // Get today's date and initial grid
    const today = getTodayDateString();
    const { grid: todayGrid } = dateToGrid(today);
    const encoded = encodeGridCompact(todayGrid);
    router.push(`/${today}/${encoded}`);
  };

  return (
    <GameGrid 
      grid={grid}
      swapsAllowed={swapsAllowed}
      onGridTap={handleGridTap}
      onSwap={() => {}}
    />
  );
};

export default NotFound; 