import React, { createContext, useState, ReactNode } from "react";
import { fetchWalletResponse } from "../lib/utils";

interface DataContextType {
  apiData: fetchWalletResponse []| null;
  setApiData: React.Dispatch<
    React.SetStateAction<fetchWalletResponse[] | null>
  >;
}

export const DataContext = createContext<DataContextType | undefined>(
  undefined,
);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [apiData, setApiData] = useState<fetchWalletResponse[]>([]);
  return (
    <DataContext.Provider value={{ apiData, setApiData }}>
      {children}
    </DataContext.Provider>
  );
};
