import { ethers } from "ethers";

const initializeEthers = async () => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  await provider.send("eth_requestAccounts", []);
  const balance = await provider.getBalance(
    "0x5fbdb2315678afecb367f032d93f642f64180aa3"
  );
  console.log(balance);
};

initializeEthers();

export function App() {
  return <h1>Hello world!</h1>;
}
