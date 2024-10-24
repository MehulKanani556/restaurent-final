import React, { useState, useEffect } from 'react';

const ElapsedTimeDisplay = ({ createdAt }) => {
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    const calculateElapsedTime = () => {
      const now = new Date();
      const created = new Date(createdAt);
      const diff = now - created;

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      return `${minutes} min ${seconds} seg`;
    };

    const timer = setInterval(() => {
      setElapsedTime(calculateElapsedTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt]);

  return (
    <p className="mb-0 ms-2 me-3 text-white j-tbl-font-6 ak-input">
      {elapsedTime}
    </p>
  );
};

export default ElapsedTimeDisplay;