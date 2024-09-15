import React from 'react';

const AddBlockButton: React.FC = () => {
  return (
    <button
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#000',
        color: '#fff',
        fontSize: '24px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={() => alert('Add block functionality coming soon!')}
    >
      +
    </button>
  );
};

export default AddBlockButton;
