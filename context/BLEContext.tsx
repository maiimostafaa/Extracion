import React, { createContext, useContext } from "react";
import useBLE from "../services/useBLE"; // Your existing custom hook

const BLEContext = createContext<ReturnType<typeof useBLE> | null>(null);

export const BLEProvider = ({ children }: { children: React.ReactNode }) => {
  const ble = useBLE();

  return <BLEContext.Provider value={ble}>{children}</BLEContext.Provider>;
};

export const useBLEContext = () => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error("useBLEContext must be used within a BLEProvider");
  }
  return context;
};
