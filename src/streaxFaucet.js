import { ethers } from "ethers";

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "sendTokens",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const streaxFaucet = (signer) => {
  return new ethers.Contract(
    "0x4E292289F8b76B731c9C92B6234fEf684C215f7D",
    abi,
    signer
  );
};

export default streaxFaucet;
