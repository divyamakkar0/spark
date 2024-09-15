"use client";
import React, { useState, useMemo } from "react";
import { CSSProperties } from "react";
import { useRouter } from 'next/navigation';
import MeteoriteEffect from "../components/MeteoriteEffect";
import Spinner from "../components/Spinner";

const styles: { [key: string]: CSSProperties } = {
  container: {
    fontFamily: "serif",
    backgroundColor: "#fafafa",
    minHeight: "80vh",
    padding: "20px",
    backgroundImage: "radial-gradient(#d3d3d3 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "1200px",
    marginBottom: "40px",
  },
  menuButton: {
    background: "none",
    border: "1px solid #000",
    borderRadius: "4px",
    padding: "10px 15px",
    cursor: "pointer",
    fontSize: "24px",
  },
  main: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontSize: "84px",
    marginBottom: "30px",
    fontFamily: '"Playfair Display", serif',
    fontWeight: "bold",
    letterSpacing: "-2px",
  },
  description: {
    fontSize: "24px",
    lineHeight: "1.6",
    marginBottom: "40px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    padding: "15px 30px",
    border: "2px solid #000",
    borderRadius: "30px",
    background: "none",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
  primaryButton: {
    backgroundColor: "#000",
    color: "#fff",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    width: '100%',
    maxWidth: '500px',
  },
  input: {
    padding: '15px 25px',
    border: '2px solid #000',
    borderRadius: '50px',
    fontSize: '18px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  submitButton: {
    padding: '15px 30px',
    border: '2px solid #000', // Black border
    borderRadius: '50px',
    background: 'transparent', // Transparent background
    color: '#000', // Black text
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    width: '100%',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
};


enum State {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}


export default function Home() {

  const router = useRouter();
  const [query, setQuery] = useState("");
  const [state, setState] = useState(State.IDLE);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted query:", query);
    router.push('/query');
  };

  const submitQuery = async () => {

    setState(State.LOADING);

    console.log("Submitted query:", query);
    const params = query;
    const address = `http://10.39.56.47:4333/get_companies`
    console.log(address);
    const response = await fetch(address, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ params }),
    });

    const data = await response.json();
    console.log(data);


    router.push('/query');
  };

  const memoizedMeteoriteEffect = useMemo(() => <MeteoriteEffect />, []);

  return (
    <>
      {state === State.LOADING && <Spinner />}
      {state === State.SUCCESS && <div>Success</div>}
      {state === State.ERROR && <div>Error</div>}
      {state === State.IDLE && (

        <div style={styles.container}>

          <main style={styles.main}>

            <h1 style={styles.title}>
              <span style={{ fontStyle: 'italic', color: '#FF4500' }}>Spark!</span>

            </h1>
            <p style={styles.description}>
              Ignite your <strong>connections</strong>
            </p>
            <div style={styles.buttonContainer}>
              <form onSubmit={(e) => {
                e.preventDefault();
                submitQuery();
              }} style={styles.form}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your query"
                  style={styles.input}
                />
                <button
                  type="submit"
                  style={styles.submitButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FF4500';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = '#FF4500';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#000';
                    e.currentTarget.style.borderColor = '#000';
                  }}
                >
                  Dive Deeper
                </button>
              </form>
            </div>
            {memoizedMeteoriteEffect}
          </main>
        </div>
      )}
    </>
  );
}
