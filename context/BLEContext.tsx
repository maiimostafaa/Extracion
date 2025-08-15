// README
// Bluetooth Low Energy (BLE) Context for sharing BLE state across the app.
// Features:
// - Wraps the app (or relevant parts) with BLEProvider to make BLE state accessible.
// - Uses a custom `useBLE` hook to manage scanning, connecting, and data streaming.
// - Provides the BLE state and methods to any child component via `useBLEContext` hook.
// Notes:
// - `useBLE` must be implemented separately in ../services/useBLE.
// - Components using `useBLEContext` must be wrapped inside BLEProvider.

// -------------------- Imports --------------------
import React, { createContext, useContext } from "react";
import useBLE from "../services/useBLE"; // Custom hook for BLE logic (scanning, connecting, streaming data, etc.)

// -------------------- Context Creation --------------------
// The context stores the return type of `useBLE` or null if not yet provided.
const BLEContext = createContext<ReturnType<typeof useBLE> | null>(null);

// -------------------- Provider Component --------------------
export const BLEProvider = ({ children }: { children: React.ReactNode }) => {
  const ble = useBLE(); // Initialize BLE hook (manages state & actions)

  return <BLEContext.Provider value={ble}>{children}</BLEContext.Provider>;
};

// -------------------- Hook for Consuming BLE Context --------------------
export const useBLEContext = () => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error("useBLEContext must be used within a BLEProvider");
  }
  return context; // Return the BLE hook's state & methods
};
