import * as React from "react";
import BlockchainNetwork from "../Blockchain/BlockchainNetwork";

const RootPage = () => {
  const [miningNodes, setMiningNodes] = React.useState({});

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
    const blockchainNetwork = new BlockchainNetwork({
      miningNodeCount: 2,
      addBlockToNode,
    });

    blockchainNetwork.init();

    setMiningNodes(
      blockchainNetwork.miningNodes.reduce((acc, miningNode) => {
        acc[miningNode.id] = miningNode;
        return acc;
      }, {})
    );

    return () => blockchainNetwork.cleanup();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
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
