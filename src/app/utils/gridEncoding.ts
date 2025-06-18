interface GridCell {
  content: string;
  anchor: boolean;
  isEmpty: boolean;
  deleted: boolean;
}

// More compact encoding: we only need to store the content positions
// Since anchors and empty states are deterministic from the date
export function encodeGridCompact(grid: GridCell[]): string {
  // Create a map of content to positions
  const contentArray: string[] = [];
  
  grid.forEach(cell => {
    // Use single character encoding:
    // - Empty: '_'
    // - Letters: as is (lowercase for visible)
    // - Deleted letters: uppercase
    // - Punctuation: as is
    // - Deleted punctuation: special encoding
    if (cell.isEmpty) {
      contentArray.push('_');
    } else if (cell.deleted) {
      if (/[a-z]/.test(cell.content)) {
        contentArray.push(cell.content.toUpperCase());
      } else {
        // For deleted punctuation, use special markers
        switch(cell.content) {
          case ',': contentArray.push('<'); break;
          case '.': contentArray.push('>'); break;
          case '?': contentArray.push('^'); break;
          case '!': contentArray.push('~'); break;
          default: contentArray.push(cell.content);
        }
      }
    } else {
      contentArray.push(cell.content);
    }
  });
  
  // Join all characters (no separator needed since each is 1 char)
  const gridString = contentArray.join('');
  
  // Convert to base64url (URL-safe base64)
  const encoded = btoa(gridString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return encoded;
}

export function decodeGridCompact(encoded: string, anchors: number[], expectedLetters?: string[]): GridCell[] | null {
  try {
    // Convert from base64url back to base64
    const base64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(encoded.length + (4 - encoded.length % 4) % 4, '=');
    
    const gridString = atob(base64);
    
    if (gridString.length !== 81) {
      return null;
    }
    
    const grid: GridCell[] = [];
    const anchorSet = new Set(anchors);
    
    for (let i = 0; i < gridString.length; i++) {
      const char = gridString[i];
      const isUpperCase = /[A-Z]/.test(char);
      let content = '';
      let deleted = false;
      
      if (char === '_') {
        content = '';
      } else if (isUpperCase) {
        content = char.toLowerCase();
        deleted = true;
      } else if (char === '<') {
        content = ',';
        deleted = true;
      } else if (char === '>') {
        content = '.';
        deleted = true;
      } else if (char === '^') {
        content = '?';
        deleted = true;
      } else if (char === '~') {
        content = '!';
        deleted = true;
      } else {
        content = char;
      }
      
      grid.push({
        content: content,
        anchor: anchorSet.has(i),
        isEmpty: char === '_',
        deleted: deleted
      });
    }
    
    // Validate letter inventory if expected letters are provided
    if (expectedLetters) {
      const actualLetters = grid
        .filter(cell => !cell.isEmpty && /[a-z]/.test(cell.content)) // Only count letters (visible or deleted), not punctuation
        .map(cell => cell.content)
        .sort();
      
      const expected = [...expectedLetters].sort();
      
      // Check if arrays are equal (deleted letters still count toward the total)
      if (actualLetters.length !== expected.length || 
          !actualLetters.every((letter, i) => letter === expected[i])) {
        return null; // Invalid - letters don't match what's expected for this date
      }
    }
    
    return grid;
  } catch {
    return null;
  }
}