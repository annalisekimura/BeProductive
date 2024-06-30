import React, { createContext, useState } from 'react';

export const WeekContext = createContext();

export const WeekProvider = ({ children }) => {
  const [events2, setEvents2] = useState([]);

  return (
    <WeekContext.Provider value={{ events2, setEvents2 }}>
      {children}
    </WeekContext.Provider>
  );
};