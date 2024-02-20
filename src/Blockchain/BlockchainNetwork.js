import MiningNode from "./MiningNode";

class BlockchainNetwork {
  constructor({ miningNodeCount, addBlockToNode }) {
    this.miningNodes = Array.from(
      { length: miningNodeCount },
      (_, id) => new MiningNode({ id, miningNetwork: this, addBlockToNode })
    );
  }

  init() {
    this.miningNodes.forEach((node) => node.mine());
  }

  broadcastBlock({ block, nodeId }) {
    this.miningNodes.forEach(
      (node) => node.id !== nodeId && node.receiveBlock(block)
    );
  }

  cleanup() {
    this.miningNodes.forEach((node) => node.miningWebWorker.terminate());
  }
}

export default BlockchainNetwork;
