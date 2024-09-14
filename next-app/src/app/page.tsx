"use client";
import React, { useState, useMemo } from "react";
import { CSSProperties } from "react";
import { useRouter } from 'next/navigation';
import MeteoriteEffect from "../components/MeteoriteEffect";

const styles: { [key: string]: CSSProperties } = {
  container: {
    fontFamily: "serif",
    backgroundColor: "#fafafa",
    minHeight: "100vh",
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
    display: "flex",
    gap: "10px",
  },
  input: {
    padding: "15px",
    border: "2px solid #000",
    borderRadius: "30px",
    fontSize: "18px",
    width: "200px",
  },
};

export default function Home() {

  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted query:", query);
    router.push('/query');
  };

  const memoizedMeteoriteEffect = useMemo(() => <MeteoriteEffect />, []);

  return (
    <>
      <div style={styles.container}>

        <main style={styles.main}>
          <h1 style={styles.title}>
            <span style={{ fontStyle: 'italic', color: '#FF4500' }}>Spark!</span>

          </h1>
          <p style={styles.description}>
            Ignite your <strong>connections</strong>
          </p>
          <div style={styles.buttonContainer}> !
            <button style={{ ...styles.button, ...styles.primaryButton }}>
              ATTEND A SESSION
            </button>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your query"
                style={styles.input}
              />
              <button type="submit"  style={styles.button}>
                DIVE DEEPER
              </button>
            </form>
          </div>
          {memoizedMeteoriteEffect}
        </main>
      </div>
    </>
  );
}