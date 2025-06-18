interface GridCell {
  content: string;
  anchor: boolean;
  isEmpty: boolean;
  deleted: boolean;
}

// Simple deterministic random number generator based on seed
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Linear congruential generator
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 2147483647;
    return this.seed / 2147483647;
  }

  // Get random integer between min (inclusive) and max (exclusive)
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }
}

export function dateToGrid(dateStr: string): { grid: GridCell[], anchors: number[] } {
  // Convert date string (YYYYMMDD) to numeric seed
  const seed = parseInt(dateStr, 10);
  const rng = new SeededRandom(seed);

  // Define letter distribution (only letters now)
  const letters = [
    ...'aaaaaaaeeeeeeeiiiiiooouuuu'.split(''),
    ...'rrrrssssttttlllnnnnddddmmmmmhhhhbbbbccccffffggggppppwwwwyyy'.split(''),
    ...'kkkvvjjxxqqzzz'.split('')
  ];

  // Define punctuation marks separately  
  const punctuation = [',', '.', '?', '!'];

  // Deterministic shuffle of letters using seeded random
  const shuffledLetters = [...letters];
  for (let i = shuffledLetters.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i + 1);
    [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
  }

  // Take exactly 63 letters
  const selectedLetters = shuffledLetters.slice(0, 63);

  // Deterministic shuffle of punctuation and select 3-5 marks
  const shuffledPunctuation = [...punctuation];
  for (let i = shuffledPunctuation.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i + 1);
    [shuffledPunctuation[i], shuffledPunctuation[j]] = [shuffledPunctuation[j], shuffledPunctuation[i]];
  }
  const numPunctuation = rng.nextInt(3, 6); // 3-5 punctuation marks
  const selectedPunctuation = shuffledPunctuation.slice(0, numPunctuation);

  // Create 81 cell grid (9x9) - 63 letters + some punctuation + empty spaces
  const grid: GridCell[] = [];
  
  // Add 63 letters
  for (let i = 0; i < 63; i++) {
    grid.push({
      content: selectedLetters[i],
      anchor: false,
      isEmpty: false,
      deleted: false
    });
  }
  
  // Add punctuation marks
  for (let i = 0; i < selectedPunctuation.length; i++) {
    grid.push({
      content: selectedPunctuation[i],
      anchor: false,
      isEmpty: false,
      deleted: false
    });
  }
  
  // Fill remaining cells with empty spaces (81 total - 63 letters - punctuation count)
  const remainingCells = 81 - 63 - selectedPunctuation.length;
  for (let i = 0; i < remainingCells; i++) {
    grid.push({
      content: '',
      anchor: false,
      isEmpty: true,
      deleted: false
    });
  }

  // Deterministic shuffle of entire grid
  for (let i = grid.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i + 1);
    [grid[i], grid[j]] = [grid[j], grid[i]];
  }

  // Set three random letters as anchors (excluding punctuation)
  const letterIndices = grid
    .map((cell, i) => cell.content && /[a-z]/.test(cell.content) ? i : null)
    .filter(i => i !== null) as number[];
  
  const anchors: number[] = [];
  
  if (letterIndices.length >= 3) {
    // Deterministic shuffle and take first 3
    const shuffledIndices = [...letterIndices];
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
      const j = rng.nextInt(0, i + 1);
      [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
    
    for (let i = 0; i < 3; i++) {
      grid[shuffledIndices[i]].anchor = true;
      anchors.push(shuffledIndices[i]);
    }
  }

  return { grid, anchors };
}

// Get just the letters for a specific date (for validation)
export function getDateLetters(dateStr: string): string[] {
  const seed = parseInt(dateStr, 10);
  const rng = new SeededRandom(seed);

  // Define letter distribution (same as in dateToGrid, only letters)
  const letters = [
    ...'aaaaaaaeeeeeeeiiiiiooouuuu'.split(''),
    ...'rrrrssssttttlllnnnnddddmmmmmhhhhbbbbccccffffggggppppwwwwyyy'.split(''),
    ...'kkkvvjjxxqqzzz'.split('')
  ];

  // Deterministic shuffle using seeded random
  const shuffledLetters = [...letters];
  for (let i = shuffledLetters.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i + 1);
    [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
  }

  // Return exactly 63 letters
  return shuffledLetters.slice(0, 63);
}

// Get anchors for a specific date (without generating full grid)
export function getDateAnchors(dateStr: string): number[] {
  const { anchors } = dateToGrid(dateStr);
  return anchors;
}

// Get today's date in YYYYMMDD format
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// Validate date string format
export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{8}$/.test(dateStr)) return false;
  
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10);
  const day = parseInt(dateStr.substring(6, 8), 10);
  
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  
  // More precise date validation
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
}