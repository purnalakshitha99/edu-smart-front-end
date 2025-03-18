import React, { useState, useEffect } from "react";

const Test = () => {
  // State to store emotion from localStorage
  const [emotion, setEmotion] = useState<string | null>(() => {
    // Retrieve emotion from localStorage when the component first mounts
    const savedEmotion = localStorage.getItem("emotion");
    return savedEmotion ? savedEmotion : null;
  });

  // Set up an effect to update emotion whenever localStorage changes
  useEffect(() => {
    // Create an event listener for changes in localStorage
    const handleStorageChange = () => {
      const savedEmotion = localStorage.getItem("emotion");
      if (savedEmotion) {
        setEmotion(savedEmotion); // Update state when localStorage changes
      }
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <p>Emotion: {emotion}</p>
    </div>
  );
};

export default Test;
