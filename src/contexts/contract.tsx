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

const CONTRACT_ADDRESS = "0x11345C742cBF00C3DE5206cc4d0A9f3E65cc72a6";

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const { web3 } = useWeb3();
  const [contract, setContract] = useState<Contract<any> | null>(null);

  useEffect(() => {
    const c = new web3.eth.Contract(
      CrowdfundingManagementABI,
      CONTRACT_ADDRESS
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
