import React, { createContext, useState, ReactNode } from 'react';

interface OverlayContextType {
  text: string;
  setText: (text: string) => void;
}

export const OverlayContext = createContext<OverlayContextType>({
  text: '',
  setText: () => {}
});

export const OverlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [text, setText] = useState('');
  return (
    <OverlayContext.Provider value={{ text, setText }}>
      {children}
    </OverlayContext.Provider>
  );
};
