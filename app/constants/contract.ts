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

export { CONTRACT_ABI, CONTRACT_ADDRESS };
