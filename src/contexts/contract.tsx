"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useWeb3 } from "./web3";
import type { Contract } from "web3";

type ContractContextType = {
  contract: Contract<any> | null;
};
import CrowdfundingManagementABI from "@/ABIs/CrowdfundingManagement.json";

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const { web3, account } = useWeb3();
  const [contract, setContract] = useState<Contract<any> | null>(null);

  useEffect(() => {
    const c = new web3.eth.Contract(
      CrowdfundingManagementABI,
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    );
    setContract(c);
  }, [web3]);

  return (
    <ContractContext.Provider value={{ contract }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract deve ser usado dentro de ContractProvider");
  }
  return context;
};
