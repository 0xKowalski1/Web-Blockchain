import * as React from "react";
import BlockchainNetwork from "../Blockchain/BlockchainNetwork";
import Transaction from "../Blockchain/Transaction";
import Wallet from "../Blockchain/Wallet";

const RootPage = () => {
  const [wallet, setWallet] = React.useState(null);
  const [miningNodes, setMiningNodes] = React.useState({});
  const [blockchainNetwork, setBlockchainNetwork] = React.useState(null);

  const newTransaction = async (minerWallet = "dog") => {
    const transaction = new Transaction({
      to: minerWallet,
      from: await wallet.publicKey(true),
      value: 2000,
    });

    const signature = await wallet.signTransaction(transaction);
    transaction.signature = signature;

    blockchainNetwork.addTransaction(transaction);
  };

  const addBlockToNode = ({ nodeId, newChain }) => {
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

  React.useEffect(() => {
    const run = async () => {
      const newWallet = new Wallet();
      await newWallet.generateKeyPair();
      setWallet(newWallet);

      const newBlockChainNetwork = new BlockchainNetwork({
        miningNodeCount: 2,
        addBlockToNode,
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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <button onClick={() => newTransaction()}>Send Transaction</button>
      {Object.keys(miningNodes).length ? (
        Object.keys(miningNodes).map((miningNodeId) => (
          <div
            key={miningNodeId + "-miningNode"}
            className="max-w-6xl mx-auto mb-10"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Mining Node Id: {miningNodeId}
            </h2>
            <div className="flex flex-wrap -mx-2 justify-center">
              {miningNodes[miningNodeId].blockchain.chain.map((block) => (
                <div
                  key={miningNodeId + "-" + block.hash}
                  className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                >
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
                    <div className="p-6">
                      <div className="font-medium text-indigo-600 break-words">
                        Hash: {block.hash}
                      </div>
                      <div className="text-sm text-gray-600 mt-2 break-words">
                        Timestamp: {new Date(block.timestamp).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 mt-2 break-words">
                        Last Hash: {block.lastHash}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Difficulty: {block.difficulty}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Nonce: {block.nonce}
                      </div>

                      <div>
                        Transactions:{" "}
                        {Object.keys(block.transactions).map(
                          (transactionId) =>
                            block.transactions[transactionId].to
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No nodes</div>
      )}
    </div>
  );
};

export default RootPage;
