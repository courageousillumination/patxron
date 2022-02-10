import { useState } from "react";

const Home: React.FC = () => {
  const [address, setAddress] = useState("");
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
    </div>
  );
};

export { Home };
