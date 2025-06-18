"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import Web3 from "web3";

type Web3ContextType = {
  web3: Web3;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const RPC_SEPOLIA = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [web3] = useState<any>(new Web3(RPC_SEPOLIA));

  return (
    <Web3Context.Provider value={{ web3 }}>{children}</Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 deve ser usado dentro de Web3Provider");
  }
  return context;
};
