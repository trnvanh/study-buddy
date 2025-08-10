import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Pet } from '../types/pet'; 

type BuddyContextType = {
  selectedBuddy: Pet | null;
  setSelectedBuddy: (buddy: Pet) => void;
};

const BuddyContext = createContext<BuddyContextType | undefined>(undefined);

export const BuddyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBuddy, setSelectedBuddy] = useState<Pet | null>(null);

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
