import React, { createContext, useState, FC } from 'react';

export interface OverlayData {
  explanation: string;
  audioFile?: string;
}

interface OverlayContextProps {
  text: OverlayData | null;
  setText: (text: OverlayData | null) => void;
}

export const OverlayContext = createContext<OverlayContextProps>({
  text: null,
  setText: () => {},
});

interface OverlayProviderProps {
  children: React.ReactNode;
}

export const OverlayProvider: FC<OverlayProviderProps> = ({ children }) => {
  const [text, setText] = useState<OverlayData | null>(null);
  return (
    <OverlayContext.Provider value={{ text, setText }}>
      {children}
    </OverlayContext.Provider>
  );
};
