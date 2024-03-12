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
  const [blockchainNetwork, setBlockchainNetwork] = React.useState(null);

  const newTransaction = async () => {
    console.log(wallet, blockchainNetwork.miningNodes[0]);
    const transaction = new Transaction({
      to: blockchainNetwork.miningNodes[0].minerWallet.publicKey,
      from: wallet.publicKey,
      value: 500,
    });

    const signature = await wallet.signTransaction(transaction);
    transaction.signature = signature;

    blockchainNetwork.addTransaction(transaction);
  };

  React.useEffect(() => {
    const run = async () => {
      const newWallet = new Wallet();
      await newWallet.generateKeyPair();
      setWallet(newWallet);

      const newBlockChainNetwork = new BlockchainNetwork({
        miningNodeCount: 1,
        setBlockchainNetwork,
      });

      newBlockChainNetwork.init();

      setBlockchainNetwork(newBlockChainNetwork);

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
      console.log(blockchainNetwork);
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
        {blockchainNetwork && blockchainNetwork.miningNodes ? (
          blockchainNetwork.miningNodes.map((miningNode) => (
            <div key={miningNode.id + "-miningNode"}>
              <h2>Mining Node Id: {miningNode.id}</h2>
              <div>
                {miningNode.blockchain.chain.map((block) => (
                  <BlockchainCard
                    key={miningNode.id + "-" + block.hash}
                    miningNodeId={miningNode.id}
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
