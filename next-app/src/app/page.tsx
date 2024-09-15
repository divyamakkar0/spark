"use client";
import React, { useState, useMemo } from "react";
import { CSSProperties } from "react";
import { useRouter } from 'next/navigation';
import MeteoriteEffect from "../components/MeteoriteEffect";
import TypewriterEffect from "../components/TypewriterEffect";
import Spinner from "../components/Spinner";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";


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
    fontSize: "96px", // Increased back to 96px
    marginBottom: "30px",
    fontFamily: '"Playfair Display", serif',
    fontWeight: "bold",
    letterSpacing: "-2px",
  },
  description: {
    fontSize: "28px",
    lineHeight: "1.6",
    marginBottom: "60px", // Increased from 40px
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    padding: "15px 30px",
    border: "2px solid #333333",
    borderRadius: "30px",
    background: "none",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
  primaryButton: {
    backgroundColor: "#333333",
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
    padding: '10px 20px',
    border: '2px solid #333333',
    borderRadius: '50px',
    fontSize: '20px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    outline: 'none',
  },
  inputActive: {
    borderColor: '#FF7F50',
  },
  submitButton: {
    padding: '12px 24px', // Reduced padding
    border: '2px solid #000',
    borderRadius: '50px',
    background: 'transparent',
    color: '#000',
    cursor: 'pointer',
    fontSize: '16px', // Reduced from 18px
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    width: '80%', // Reduced from 100%
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  logo: {
    position: "absolute",
    top: "20px",
    left: "20px",
    fontSize: "36px", // Slightly increased from 32px
    fontWeight: "bold",
    color: "#333333",
    fontFamily: '"Playfair Display", serif',
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

  const createNewCompanySearch = useMutation(api.tasks.createNewCompanySearch);

  const submitQuery = async () => {
    setState(State.LOADING);

    console.log("Submitted query:", query);
    const params = query;
    const address = `http://10.39.65.191:4333/get_companies`
    console.log(address);
    const response = await fetch(address, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ params }),
    });

    let data = await response.json();
    data = data.data
    console.log(data);
    createNewCompanySearch({data: data});

    setState(State.SUCCESS);
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
        <div style={styles.logo}>Spark</div>
        <main style={styles.main}>
          <h1 style={styles.title}>
            <span style={{ fontStyle: 'italic', color: '#FF7F50' }}>Spark! </span>
            <TypewriterEffect />
          </h1>
          <p style={styles.description}>
            Web <em>research</em> and <em>outreach</em> tool for <strong>startups</strong>
          </p>
          <div style={styles.buttonContainer}>
            <form onSubmit={submitQuery} style={styles.form}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your query"
                style={{
                  ...styles.input,
                  ...(query ? styles.inputActive : {}),
                }}
              />
              <button
                type="submit"
                style={styles.submitButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FF7F50';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = '#FF7F50';
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
