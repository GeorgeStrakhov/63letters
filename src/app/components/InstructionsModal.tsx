"use client"

import React from 'react';

interface InstructionsModalProps {
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: 'var(--font-eb-garamond), "Times New Roman", serif',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '300px',
        padding: '40px',
        color: '#333',
      }}>
        <p style={{ margin: '0 0 15px', fontSize: '1.1rem', lineHeight: '1.5' }}>
          swap letters to write a poem.
        </p>
        <p style={{ margin: '0 0 15px', fontSize: '1.1rem', lineHeight: '1.5' }}>
          circled letters are fixed.
        </p>
        <p style={{ margin: '0 0 25px', fontSize: '1.1rem', lineHeight: '1.5' }}>
          double-tap a letter to hide or show it.
        </p>
        <p style={{ margin: '0 0 30px', fontSize: '1.1rem', lineHeight: '1.5' }}>
          your poem is saved in the url. share it at any time.
        </p>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: '1px solid #999',
            borderRadius: '50%',
            color: '#333',
            cursor: 'pointer',
            fontSize: '1rem',
            height: '40px',
            width: '40px',
            lineHeight: '38px',
            padding: 0,
          }}
        >
          ok
        </button>
      </div>
    </div>
  );
};

export default InstructionsModal;
