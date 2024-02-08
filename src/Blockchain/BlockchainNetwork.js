import MiningNode from "./MiningNode";

class BlockchainNetwork {
  constructor(miningNodeCount) {
    this.miningNodes = Array.from(
      { length: miningNodeCount },
      (_, id) => new MiningNode({ id, miningPool: this })
    );
  }

  init() {
    console.log(this.miningNodes);
    this.miningNodes.forEach((node) => node.mine());
  }

  broadcastBlock({ block, originNodeId }) {
    this.miningNodes.forEach(
      (node) => node.id !== originNodeId && node.receiveBlock(block)
    );
  }
}

export default BlockchainNetwork;
