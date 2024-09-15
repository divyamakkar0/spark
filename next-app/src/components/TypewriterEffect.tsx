import React, { useState, useEffect } from "react";

const words = ["Connections", "Networks", "People"];

const TypewriterEffect: React.FC = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(130); 
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (isWaiting) {
      const timer = setTimeout(() => {
        setIsWaiting(false);
        setLoopNum(0); // Reset to start from the first word
        setIsDeleting(false);
        setCurrentWord("");
      }, 6000); 
      return () => clearTimeout(timer);
    }

    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullWord = words[i];

      setCurrentWord((prev) =>
        isDeleting ? prev.slice(0, -1) : fullWord.slice(0, prev.length + 1)
      );

      setTypingSpeed(isDeleting ? 75 : 150); // Increased from 50 and 100 to 75 and 150 respectively

      if (!isDeleting && currentWord === fullWord) {
        setTimeout(() => setIsDeleting(true), 1000); // Increased from 500 to 1000 for a longer pause at the end of each word
      } else if (isDeleting && currentWord === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        if (loopNum === words.length - 1) {
          setIsWaiting(true); // Set waiting state after completing all words
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentWord, isDeleting, loopNum, typingSpeed, isWaiting]);

  return <span style={{ color: "#333" }}>{currentWord}</span>;
};

export default TypewriterEffect;
