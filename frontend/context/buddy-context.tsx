import React, { createContext, useContext, useState, ReactNode } from 'react';

type Buddy = {
  id: number;
  name: string;
  image: any; 
};

type BuddyContextType = {
  selectedBuddy: Buddy | null;
  setSelectedBuddy: (buddy: Buddy) => void;
};

const BuddyContext = createContext<BuddyContextType | undefined>(undefined);

export const BuddyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);

  return (
    <BuddyContext.Provider value={{ selectedBuddy, setSelectedBuddy }}>
      {children}
    </BuddyContext.Provider>
  );
};

export const useBuddy = (): BuddyContextType => {
  const context = useContext(BuddyContext);
  if (!context) {
    throw new Error('useBuddy must be used within a BuddyProvider');
  }
  return context;
};
