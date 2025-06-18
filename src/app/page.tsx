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

const Home = () => {
  const router = useRouter();
  const [grid, setGrid] = useState<GridCell[]>([]);

  useEffect(() => {
    const message = "sixty three letters. swap them. circles are fixed. write a poem, would you?";
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

    // Add random circles to the instruction grid
    const letterIndices = instructionGrid
      .map((cell, i) => cell.content && /[a-z]/.test(cell.content) ? i : null)
      .filter(i => i !== null) as number[];
    
    if (letterIndices.length >= 3) {
      // Random circles on each page load
      const shuffled = [...letterIndices];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      // Take first 3 from shuffled array
      for (let i = 0; i < 3; i++) {
        instructionGrid[shuffled[i]].anchor = true;
      }
    }
    
    setGrid(instructionGrid);
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
      swapsAllowed={false}
      onGridTap={handleGridTap}
      onSwap={() => {}}
    />
  );
};

export default Home;