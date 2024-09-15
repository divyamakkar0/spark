import React, { useState, useRef } from 'react';

interface AddBlockButtonProps {
  onAddBlock: (title: string, userQuery: string | number | File) => void;
}

const AddBlockButton: React.FC<AddBlockButtonProps> = ({ onAddBlock }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [categoryNumber, setCategoryNumber] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption) {
      let submitValue: string | number | File = userQuery;
      if (selectedOption === 'Category') {
        submitValue = parseInt(categoryNumber);
      } else if (selectedOption === 'Resume' && fileInputRef.current?.files?.[0]) {
        submitValue = fileInputRef.current.files[0];
      }
      onAddBlock(selectedOption, submitValue);
      setShowForm(false);
      setSelectedOption('');
      setUserQuery('');
      setCategoryNumber('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getPlaceholder = () => {
    switch (selectedOption) {
      case 'Web Search':
        return 'Enter research question about the companies';
      case 'Find Employees':
        return 'Gather specific employee type';
      case 'Outreach':
        return 'Enter specific resume features to include';
      default:
        return 'Enter your query...';
    }
  };

  const renderInput = () => {
    if (selectedOption === 'Category') {
      return (
        <select
          value={categoryNumber}
          onChange={(e) => setCategoryNumber(e.target.value)}
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
          <option value="" disabled>Select a category...</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      );
    } else if (selectedOption === 'Resume') {
      return (
        <input
          type="file"
          ref={fileInputRef}
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
        />
      );
    } else if (['Web Search', 'Find Employees', 'Outreach'].includes(selectedOption)) {
      return (
        <textarea
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder={getPlaceholder()}
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
      );
    }
    return null;
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
              <option value="" disabled>Select a block type...</option>
              <option value="Category">Category</option>
              <option value="Web Search">Web Search</option>
              <option value="Find Employees">Find Employees</option>
              <option value="Outreach">Outreach</option>
              <option value="Resume">Resume</option>
            </select>
            {renderInput()}
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
