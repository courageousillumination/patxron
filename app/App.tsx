import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "subscribeTo",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "refundAddress",
        type: "address",
      },
    ],
    name: "cancelSubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "account",
        type: "address",
      },
    ],
    name: "claimFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "subscribeTo",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "interval",
        type: "uint256",
      },
    ],
    name: "createSubscription",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getSubscriptions",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "subscriber",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "interval",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lastWithdraw",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fundingRemaining",
            type: "uint256",
          },
        ],
        internalType: "struct Patxreon.Subscription[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "subscriptions",
    outputs: [
      {
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "interval",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastWithdraw",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fundingRemaining",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

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

type Subscription = unknown;

const SubscriptionForm: React.FC<{
  contract: Contract;
  address: string;
}> = ({ contract, address }) => {
  const [amount, setAmount] = useState("0");
  const [interval, setInterval] = useState("0");
  const [funding, setFunding] = useState("0");

  return (
    <div>
      <label>Amount</label>
      <input value={amount} onChange={(e) => setAmount(e.target.value)} />

      <label>Interval</label>
      <input value={interval} onChange={(e) => setInterval(e.target.value)} />

      <label>Funding</label>
      <input value={funding} onChange={(e) => setFunding(e.target.value)} />

      <button
        onClick={() => {
          contract.createSubscription(
            address,
            parseInt(amount),
            parseInt(interval),
            {
              value: parseInt(funding),
            }
          );
        }}
      >
        Subscribe!
      </button>
    </div>
  );
};

const PaxtreonSubscribers: React.FC<{ contract: Contract }> = ({
  contract,
}) => {
  const [address, setAddress] = useState("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  return (
    <div>
      <label>Your Address</label>
      <input value={address} onChange={(e) => setAddress(e.target.value)} />
      <button
        onClick={async () => {
          const subs = await contract.getSubscriptions(address);
          setSubscriptions(subs);
        }}
      >
        Load Subscriptions
      </button>
      <div>Subscriptions</div>
      <ul>
        {subscriptions.map((x, i) => (
          <li key={i}>
            <pre>{JSON.stringify(x)}</pre>
          </li>
        ))}
      </ul>
      <div>Create new Subscription</div>
      <SubscriptionForm address={address} contract={contract} />
    </div>
  );
};

export function App() {
  const contract = useContract();

  if (contract === null) {
    return <div>Connecting...</div>;
  }

  return <PaxtreonSubscribers contract={contract} />;
}
