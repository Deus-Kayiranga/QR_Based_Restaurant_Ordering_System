import React, { createContext, useContext, useState } from 'react';

interface TableSessionContextType {
  sessionToken: string | null;
  tableNumber: string | null;
  tableId: number | null;
  isSessionActive: boolean;
  startSession: (tableId: number, tableNumber: string, sessionToken: string) => void;
  endSession: () => void;
}

export const TableSessionContext = createContext<TableSessionContextType | undefined>(undefined);

export const TableSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionToken, setSessionToken] = useState<string | null>(() => sessionStorage.getItem('sessionToken'));
  const [tableNumber, setTableNumber] = useState<string | null>(() => sessionStorage.getItem('tableNumber'));
  const [tableId, setTableId] = useState<number | null>(() => {
    const id = sessionStorage.getItem('tableId');
    return id ? parseInt(id, 10) : null;
  });

  const isSessionActive = !!sessionToken;

  const startSession = (id: number, number: string, token: string) => {
    setTableId(id);
    setTableNumber(number);
    setSessionToken(token);
    
    sessionStorage.setItem('tableId', id.toString());
    sessionStorage.setItem('tableNumber', number);
    sessionStorage.setItem('sessionToken', token);
  };

  const endSession = () => {
    setTableId(null);
    setTableNumber(null);
    setSessionToken(null);
    
    sessionStorage.removeItem('tableId');
    sessionStorage.removeItem('tableNumber');
    sessionStorage.removeItem('sessionToken');
  };

  return (
    <TableSessionContext.Provider
      value={{
        sessionToken,
        tableNumber,
        tableId,
        isSessionActive,
        startSession,
        endSession,
      }}
    >
      {children}
    </TableSessionContext.Provider>
  );
};

export const useTableSession = () => {
  const context = useContext(TableSessionContext);
  if (context === undefined) {
    throw new Error('useTableSession must be used within a TableSessionProvider');
  }
  return context;
};
