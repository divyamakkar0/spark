import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
  container: {
    fontFamily: 'serif',
    backgroundColor: '#fafafa', // More beige background
    minHeight: '100vh',
    padding: '20px',
    backgroundImage: 'radial-gradient(#d3d3d3 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    marginBottom: '40px',
  },
  menuButton: {
    background: 'none',
    border: '1px solid #000',
    borderRadius: '4px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontSize: '24px',
  },
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  title: {
    fontSize: '84px',
    marginBottom: '30px',
    fontFamily: '"Playfair Display", serif',
    fontWeight: 'bold',
    letterSpacing: '-2px',
  },
  description: {
    fontSize: '24px',
    lineHeight: '1.6',
    marginBottom: '40px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  button: {
    padding: '15px 30px',
    border: '2px solid #000',
    borderRadius: '30px',
    background: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  primaryButton: {
    backgroundColor: '#000',
    color: '#fff',
  },
};

export default function Home() {
  return (
    
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{fontSize: '36px'}}>Spark</h1>
        <button style={styles.menuButton}>☰</button>
      </header>
      

      
      <main style={styles.main}>
        <h1 style={styles.title}>
          Spark
          <span style={{fontSize: '0.5em', verticalAlign: 'top', marginLeft: '5px'}}>⦿</span>
        </h1>
        
        <p style={styles.description}>
          We host weekly co-working sessions for you to<br />
          work on your <em>passion projects</em> with likeminded<br />
          people.
        </p>
        
        <div style={styles.buttonContainer}>
          <button style={{...styles.button, ...styles.primaryButton}}>
            ATTEND A SESSION
          </button>
          <button style={styles.button}>
            DIVE DEEPER
          </button>
        </div>
      </main>
    </div>
  );
}