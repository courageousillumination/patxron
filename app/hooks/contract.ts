import { Contract, ethers } from "ethers";
import { useState, useEffect } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

const useContract = () => {
  const [contract, setContract] = useState<Contract | null>(null);
  useEffect(() => {
    const f = async () => {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      setContract(contract);
    };
    f();
  }, [setContract]);
  return contract;
};

export { useContract };
