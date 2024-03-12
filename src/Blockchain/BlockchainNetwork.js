import MiningNode from "./MiningNode";
import TransactionPool from "./TransactionPool";

class BlockchainNetwork {
  constructor({ miningNodeCount, setBlockchainNetwork }) {
    this.miningNodes = Array.from(
      { length: miningNodeCount },
      (_, id) => new MiningNode({ id, miningNetwork: this })
    );
    this.transactionPool = new TransactionPool();
    this.setBlockchainNetwork = setBlockchainNetwork;
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

  // Change by +/- 1
  changeMiningNodeCount(changeNum) {
    const curCount = this.miningNodes.length;
    const newCount = curCount + changeNum;
    if (newCount < curCount) {
      this.miningNodes[curCount - 1].miningWebWorker.terminate();
      this.miningNodes.pop();
    } else {
      this.miningNodes = [
        ...this.miningNodes,
        new MiningNode({
          id: newCount - 1,
          miningNetwork: this,
        }),
      ];
      console.log(this.miningNodes);
      this.miningNodes[newCount - 1].init();
    }
  }
}

export default BlockchainNetwork;
