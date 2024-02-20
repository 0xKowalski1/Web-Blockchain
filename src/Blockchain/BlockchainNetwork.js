import MiningNode from "./MiningNode";

class BlockchainNetwork {
  constructor({ miningNodeCount, setMiningNode }) {
    this.miningNodes = Array.from(
      { length: miningNodeCount },
      (_, id) => new MiningNode({ id, miningNetwork: this, setMiningNode })
    );
  }

  init() {
    this.miningNodes.forEach((node) => node.mine());
  }

  broadcastBlock({ block, originNodeId }) {
    this.miningNodes.forEach(
      (node) => node.id !== originNodeId && node.receiveBlock(block)
    );
  }
}

export default BlockchainNetwork;
