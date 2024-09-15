import React, { useState } from 'react';

interface AddBlockButtonProps {
  onAddBlock: (title: string, userQuery: string) => void;
}

const AddBlockButton: React.FC<AddBlockButtonProps> = ({ onAddBlock }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [userQuery, setUserQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption && userQuery) {
      onAddBlock(selectedOption, userQuery);
      setShowForm(false);
      setSelectedOption('');
      setUserQuery('');
    }
  };

  return (
    <>
      <button
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#FF5722',
          color: '#fff',
          fontSize: '28px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          boxShadow: '0 4px 10px rgba(255, 87, 34, 0.3)',
          transition: 'all 0.3s ease',
        }}
        onClick={() => setShowForm(true)}
      >
        +
      </button>
      {showForm && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            backgroundColor: '#fff',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            zIndex: 1001,
            width: '300px',
          }}
        >
          <form onSubmit={handleSubmit}>
            <select 
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              style={{
                marginBottom: '15px',
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #FFE0B2',
                fontSize: '14px',
                color: '#333',
                backgroundColor: '#FFF3E0',
              }}
              required
            >
              <option value="" disabled style={{ color: '#999' }}>Select a block type...</option>
              <option value="Category">Category</option>
              <option value="Web Search">Web Search</option>
              <option value="Find Employees">Find Employees</option>
              <option value="Outreach">Outreach</option>
              <option value="Resume">Resume</option>
            </select>
            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Enter your query..."
              style={{
                width: '100%',
                minHeight: '100px',
                marginBottom: '15px',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #FFE0B2',
                fontSize: '14px',
                resize: 'vertical',
              }}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  backgroundColor: '#FFCCBC',
                  color: '#333',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background-color 0.3s ease',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: '#FF5722',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background-color 0.3s ease',
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddBlockButton;
