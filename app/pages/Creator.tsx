import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useContract } from "../hooks/contract";
import { Subscription } from "../types/Subscription";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(duration);
dayjs.extend(relativeTime);

const Subscription: React.FC<any> = ({ subscription }) => {
  console.log();
  const sub = subscription as any;
  return (
    <tr>
      <td>{sub.subscriber}</td>
      <td>{sub.amount.div(ethers.constants.WeiPerEther).toString()}</td>
      <td>{dayjs.duration(sub.interval.toNumber(), "seconds").humanize()}</td>
      <td>
        {sub.fundingRemaining.div(ethers.constants.WeiPerEther).toString()}
      </td>
    </tr>
  );
};

const Creator: React.FC = () => {
  const { address } = useParams();
  const contract = useContract();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invalidate, setInvalidate] = useState(0);

  useEffect(() => {
    if (contract) {
      contract.getSubscriptions(address).then(setSubscriptions);
    }
  }, [contract, address, invalidate]);

  return (
    <div>
      <h1>{address} Subscriptions</h1>
      <table>
        <thead>
          <tr>
            <th>Subscriber</th>
            <th>Amount</th>
            <th>Interval</th>
            <th>Funding Remaining</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((x, i) => (
            <Subscription key={i} subscription={x} />
          ))}
        </tbody>
      </table>
      <button
        onClick={async () => {
          if (contract) {
            await contract.createSubscription(
              address,
              ethers.constants.WeiPerEther,
              60 * 60 * 24 * 7, // 1 week
              { value: ethers.constants.WeiPerEther.mul(4) }
            );
            setInvalidate((x) => x + 1);
          }
        }}
      >
        Subscribe at 1 Eth/Week
      </button>
    </div>
  );
};

export { Creator };
