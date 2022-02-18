import { useState } from "react";
import { useContract } from "../hooks/contract";

const Home: React.FC = () => {
  const [address, setAddress] = useState("");
  const [recent, setRecent] = useState<any[]>([])

  const contract = useContract();

  if(contract) {
    contract.queryFilter(contract.filters.NewSubscription(null, null)).then(setRecent)
  }
  return (
    <div>
      <h1>Enter an address to check subscriptions</h1>
      <input value={address} onChange={(e) => setAddress(e.target.value)} />
      <button
        onClick={() => {
          window.location.href = `/creator/${address}`;
        }}
      >
        See Subscriptions
      </button>
      <h2>Recent Subscriptions</h2>
      <div>
        {recent.map((x,i) => <pre key={i}>{x.args}</pre>)}
      </div>
    </div>
  );
};

export { Home };
