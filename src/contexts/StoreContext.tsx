import { createContext, useContext, useState, ReactNode } from 'react';

interface StoreContextType {
  storeName: string;
  storeAddress: string;
  setStoreName: (name: string) => void;
  setStoreAddress: (address: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [storeName, setStoreName] = useState('name of store');
  const [storeAddress, setStoreAddress] = useState('address of store');

  return (
    <StoreContext.Provider value={{ 
      storeName, 
      storeAddress, 
      setStoreName, 
      setStoreAddress 
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}