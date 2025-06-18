"use client"

import React, { useState, useEffect } from 'react';
import GameGrid from '@/app/components/GameGrid';
import { getDateAnchors, getDateLetters, isValidDateString, getTodayDateString, dateToGrid } from '@/app/utils/dateToSeed';
import { encodeGridCompact, decodeGridCompact } from '@/app/utils/gridEncoding';
import { useParams, useRouter } from 'next/navigation';

interface GridCell {
  content: string;
  anchor: boolean;
  isEmpty: boolean;
  deleted: boolean;
}

const HashLetters = () => {
  const params = useParams();
  const router = useRouter();
  const dateStr = params.date as string;
  const hash = params.hash as string;
  
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [swapsAllowed, setSwapsAllowed] = useState(true);
  const [isValidDate, setIsValidDate] = useState(true);
  const [isCheating, setIsCheating] = useState(false);

  // Initialize grid from hash
  useEffect(() => {
    // Validate date
    if (!isValidDateString(dateStr)) {
      setIsValidDate(false);
      return;
    }

    // Get anchors and expected letters for this date
    const anchors = getDateAnchors(dateStr);
    const expectedLetters = getDateLetters(dateStr);
    
    // Decode grid from hash with validation
    const decodedGrid = decodeGridCompact(hash, anchors, expectedLetters);
    if (decodedGrid) {
      setGrid(decodedGrid);
    } else {
      // This is a cheating attempt - letters don't match this date
      setIsCheating(true);
    }
  }, [dateStr, hash, router]);

  // Update URL when grid changes
  useEffect(() => {
    if (grid.length > 0) {
      const encoded = encodeGridCompact(grid);
      if (encoded !== hash) {
        const newUrl = `/${dateStr}/${encoded}`;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [grid, dateStr, hash]);

  const handleSwap = (fromIndex: number, toIndex: number) => {
    if (!swapsAllowed) return;
    
    const newGrid = [...grid];
    const temp = newGrid[fromIndex];
    newGrid[fromIndex] = newGrid[toIndex];
    newGrid[toIndex] = temp;
    setGrid(newGrid);
  };

  const handleDelete = (index: number) => {
    if (!swapsAllowed) return;
    if (grid[index].anchor || grid[index].isEmpty) return;
    
    const newGrid = [...grid];
    newGrid[index] = {
      ...newGrid[index],
      deleted: !newGrid[index].deleted
    };
    setGrid(newGrid);
  };

  if (!isValidDate) {
    return <InvalidDateGrid />;
  }

  if (isCheating) {
    return <NoCheatingGrid dateStr={dateStr} />;
  }

  return (
    <GameGrid 
      grid={grid}
      swapsAllowed={swapsAllowed}
      onGridTap={() => {}}
      onSwap={handleSwap}
      onDelete={handleDelete}
    />
  );
};

// Component to show when cheating is detected
const NoCheatingGrid = ({ dateStr }: { dateStr: string }) => {
  const [grid, setGrid] = useState<GridCell[]>([]);
  const router = useRouter();

  useEffect(() => {
    const message = "nice try, but this poem belongs to another day. click to play today's puzzle...";
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

    // Add some random circles
    const letterIndices = messageGrid
      .map((cell, i) => cell.content && /[a-z]/.test(cell.content) ? i : null)
      .filter(i => i !== null) as number[];
    
    if (letterIndices.length >= 3) {
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

  const handleClick = () => {
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
      onGridTap={handleClick}
      onSwap={() => {}}
    />
  );
};

// Component to show when date is invalid
const InvalidDateGrid = () => {
  const router = useRouter();
  const [grid, setGrid] = useState<GridCell[]>([]);

  useEffect(() => {
    const message = "time seems twisted here, the date you seek does not exist in our calendar...";
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

    // Add some random circles
    const letterIndices = messageGrid
      .map((cell, i) => cell.content && /[a-z]/.test(cell.content) ? i : null)
      .filter(i => i !== null) as number[];
    
    if (letterIndices.length >= 3) {
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

export default HashLetters;