// context/buddy-context.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types/pet';
import { API_BASE_URL } from '@/config/constants';

type BuddyContextType = {
  buddies: Pet[];
  setBuddies: (b: Pet[]) => void;
  selectedBuddy: Pet | null;
  setSelectedBuddy: (b: Pet) => void;
  loading: boolean;
};

const BuddyContext = createContext<BuddyContextType | undefined>(undefined);

export const BuddyProvider = ({ children }: { children: ReactNode }) => {
  const [buddies, setBuddies] = useState<Pet[]>([]);
  const [selectedBuddy, setSelectedBuddy] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBuddies = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pets`);
        const data: Pet[] = await res.json();
        const unlocked = data.filter(p => p.unlocked);

        setBuddies(unlocked);

        // restore previously selected, else pick the first
        const savedId = await AsyncStorage.getItem('selectedBuddyId');
        const restored = unlocked.find(p => String(p.id) === savedId);
        setSelectedBuddy(restored ?? unlocked[0] ?? null);
      } catch (e) {
        console.error('Failed to load pets:', e);
      } finally {
        setLoading(false);
      }
    };
    loadBuddies();
  }, []);

  // persist when selection changes
  useEffect(() => {
    if (selectedBuddy) {
      AsyncStorage.setItem('selectedBuddyId', String(selectedBuddy.id)).catch(() => {});
    }
  }, [selectedBuddy]);

  return (
    <BuddyContext.Provider value={{ buddies, setBuddies, selectedBuddy, setSelectedBuddy, loading }}>
      {children}
    </BuddyContext.Provider>
  );
};

export const useBuddy = (): BuddyContextType => {
  const ctx = useContext(BuddyContext);
  if (!ctx) throw new Error('useBuddy must be used within a BuddyProvider');
  return ctx;
};
