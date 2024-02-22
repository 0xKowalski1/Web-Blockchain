import MiningNode from "./MiningNode";
import TransactionPool from "./TransactionPool";

class BlockchainNetwork {
  constructor({ miningNodeCount, addBlockToNode }) {
    this.miningNodes = Array.from(
      { length: miningNodeCount },
      (_, id) => new MiningNode({ id, miningNetwork: this, addBlockToNode })
    );
    this.transactionPool = new TransactionPool();
  }

  init() {
    this.miningNodes.forEach((node) => node.init());
  }

  broadcastBlock({ block, nodeId }) {
    this.miningNodes.forEach(
      (node) => node.id !== nodeId && node.receiveBlock(block)
    );
  }

  addTransaction(transaction) {
    this.transactionPool.addTransaction(transaction);
  }

  cleanup() {
    this.miningNodes.forEach((node) => node.miningWebWorker.terminate());
  }
}

export default BlockchainNetwork;
