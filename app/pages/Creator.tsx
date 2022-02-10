import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useContract } from "../hooks/contract";
import { Subscription } from "../types/Subscription";

const Subscription: React.FC<any> = ({ subscription }) => {
  return <pre>{JSON.stringify(subscription)}</pre>;
};

const Creator: React.FC = () => {
  const { address } = useParams();
  const contract = useContract();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (contract) {
      contract.getSubscriptions(address).then(setSubscriptions);
    }
  }, [contract, address]);

  return (
    <div>
      <h1>{address} Subscriptions</h1>
      {subscriptions.map((x) => (
        <Subscription subscription={x} />
      ))}
    </div>
  );
};

export { Creator };
