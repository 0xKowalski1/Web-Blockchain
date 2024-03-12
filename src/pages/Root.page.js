import * as React from "react";
import BlockchainNetwork from "../Blockchain/BlockchainNetwork";
import Transaction from "../Blockchain/Transaction";
import Wallet from "../Blockchain/Wallet";
import BlockchainCard from "../components/BlockchainCard";
import TransactionPool from "../components/TransactionPool";
import NewTransactionForm from "../components/NewTransactionForm";

const RootPage = () => {
  const maxThreads = window.navigator.hardwareConcurrency;
  const [miningNodeCount, setMiningNodeCount] = React.useState(1);
  const [wallet, setWallet] = React.useState(null);
  const [miningNodes, setMiningNodes] = React.useState({});
  const [blockchainNetwork, setBlockchainNetwork] = React.useState(null);

  const newTransaction = async () => {
    console.log(wallet, miningNodes[0]);
    const transaction = new Transaction({
      to: miningNodes[0].minerWallet.publicKey,
      from: wallet.publicKey,
      value: 500,
    });

    const signature = await wallet.signTransaction(transaction);
    transaction.signature = signature;

    blockchainNetwork.addTransaction(transaction);
  };

  const refreshNodeChain = ({ nodeId, newChain }) => {
    setMiningNodes((currentNodes) => {
      return {
        ...currentNodes,
        [nodeId]: {
          ...currentNodes[nodeId],
          blockchain: {
            ...currentNodes[nodeId].blockchain,
            chain: newChain,
          },
        },
      };
    });
  };

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    const run = async () => {
      const newWallet = new Wallet();
      await newWallet.generateKeyPair();
      setWallet(newWallet);

      const newBlockChainNetwork = new BlockchainNetwork({
        miningNodeCount: 1,
        refreshNodeChain,
      });

      newBlockChainNetwork.init();

      setBlockchainNetwork(newBlockChainNetwork);

      setMiningNodes(
        newBlockChainNetwork.miningNodes.reduce((acc, miningNode) => {
          acc[miningNode.id] = miningNode;
          return acc;
        }, {})
      );
    };
    run();

    return () => blockchainNetwork && blockchainNetwork.cleanup();
  }, []);

  const changeMiningNodeCount = (changeNum) => {
    if (
      blockchainNetwork.miningNodes.length + changeNum > maxThreads ||
      blockchainNetwork.miningNodes.length + changeNum < 0
    ) {
      return; // Do nothing
    }
    blockchainNetwork.changeMiningNodeCount(changeNum);
  };

  return (
    <div>
      <button onClick={() => changeMiningNodeCount(1)}>add miningNode</button>
      <button onClick={() => changeMiningNodeCount(-1)}>
        remove miningNode
      </button>
      <div>
        <NewTransactionForm />

        <TransactionPool />
      </div>
      {/* <button onClick={() => newTransaction()}>Send Transaction</button> */}

      <div>
        {Object.keys(miningNodes).length ? (
          Object.keys(miningNodes).map((miningNodeId) => (
            <div key={miningNodeId + "-miningNode"}>
              <h2>Mining Node Id: {miningNodeId}</h2>
              <div>
                {miningNodes[miningNodeId].blockchain.chain.map((block) => (
                  <BlockchainCard
                    key={miningNodeId + "-" + block.hash}
                    miningNodeId={miningNodeId}
                    {...block}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>No nodes</div>
        )}
      </div>
    </div>
  );
};

export default RootPage;
