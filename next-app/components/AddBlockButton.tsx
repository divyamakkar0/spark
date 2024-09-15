import React, { useState } from 'react';

const AddBlockButton: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your submit logic here
    console.log('Form submitted');
    setShowForm(false);
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
            >
              <option value="">Select an option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
            <textarea
              style={{
                marginBottom: '15px',
                width: '100%',
                minHeight: '120px',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #FFE0B2',
                fontSize: '14px',
                color: '#333',
                resize: 'vertical',
                backgroundColor: '#FFF3E0',
              }}
              placeholder="Enter text here"
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
