import * as React from "react";
import BlockchainNetwork from "../Blockchain/BlockchainNetwork";

const RootPage = () => {
  const [miningNodes, setMiningNodes] = React.useState({});

  const setMiningNode = (node) => {
    setMiningNodes((currentNodes) => {
      return { ...currentNodes, [node.id]: node };
    });
  };

  React.useEffect(() => {
    const blockchainNetwork = new BlockchainNetwork({
      miningNodeCount: 2,
      setMiningNode,
    });

    blockchainNetwork.init();
  }, []);

  return (
    <div>
      {Object.keys(miningNodes).length
        ? Object.keys(miningNodes).map((miningNodeId) => (
            <div key={miningNodeId + "-miningNode"}>
              <h2>{"Mining Node Id: " + miningNodeId}</h2>
              <div>
                {miningNodes[miningNodeId].blockchain.chain.map((block) => (
                  <div
                    key={miningNodeId + "-" + block.hash}
                    style={{ padding: "10px" }}
                  >
                    <div>Hash: {block.hash}</div>
                    <div>
                      Timestamp: {new Date(block.timestamp).toLocaleString()}
                    </div>
                    <div>Last Hash: {block.lastHash}</div>
                    <div>Difficulty: {block.difficulty}</div>
                    <div>Nonce: {block.nonce}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        : "No nodes"}
    </div>
  );
};

export default RootPage;
