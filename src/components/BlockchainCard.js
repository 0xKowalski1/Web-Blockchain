import React from "react";
import TransactionCard from "./TransactionCard";

const BlockchainCard = ({
  miningNodeId,
  hash,
  timestamp,
  lastHash,
  difficulty,
  nonce,
  transactions,
}) => (
  <div>
    <div>Hash: {hash}</div>
    <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
    <div>Last Hash: {lastHash}</div>
    <div>Difficulty: {difficulty}</div>
    <div>Nonce: {nonce}</div>

    <div>
      Transactions:{" "}
      {Object.keys(transactions).map((transactionId) => (
        <TransactionCard
          key={miningNodeId + "-" + transactionId}
          {...transactions[transactionId]}
        />
      ))}
    </div>
  </div>
);
export default BlockchainCard;
