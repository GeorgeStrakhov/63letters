"use client"

import React, { useState, useEffect } from 'react';
import GameGrid from '@/app/components/GameGrid';
import { useRouter } from 'next/navigation';
import { getTodayDateString, dateToGrid } from '../utils/dateToSeed';
import { encodeGridCompact } from '../utils/gridEncoding';

interface GridCell {
  content: string;
  anchor: boolean;
  isEmpty: boolean;
  deleted: boolean;
}

const InvalidDateGrid = () => {
  const router = useRouter();
  const [grid, setGrid] = useState<GridCell[]>([]);

  useEffect(() => {
    const message = "time slips through fingers like sand, this date does not exist in our realm...";
    const messageGrid: GridCell[] = [];
    
    // Create 81 cell grid (9x9) with the message
    for (let i = 0; i < 81; i++) {
      if (i < message.length) {
        messageGrid.push({
          content: message[i] === ' ' ? '' : message[i],
          anchor: false,
          isEmpty: message[i] === ' ',
          deleted: false
        });
      } else {
        messageGrid.push({
          content: '',
          anchor: false,
          isEmpty: true,
          deleted: false
        });
      }
    }

    // Add some random circles to the message grid
    const letterIndices = messageGrid
      .map((cell, i) => cell.content && /[a-z]/.test(cell.content) ? i : null)
      .filter(i => i !== null) as number[];
    
    if (letterIndices.length >= 3) {
      // Shuffle and take first 3
      for (let i = letterIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letterIndices[i], letterIndices[j]] = [letterIndices[j], letterIndices[i]];
      }
      
      for (let i = 0; i < 3; i++) {
        messageGrid[letterIndices[i]].anchor = true;
      }
    }
    
    setGrid(messageGrid);
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

export default InvalidDateGrid;