import Blockchain from "./Blockchain";
import Transaction from "./Transaction";
import Worker from "workerize-loader!./MiningNode.worker.js";

class MiningNode {
  constructor({ id, miningNetwork, addBlockToNode }) {
    this.id = id;
    this.blockchain = new Blockchain();
    this.miningNetwork = miningNetwork;
    this.miningWebWorker = new Worker();
    this.miningWebWorker.onmessage = this.handleWorkerMessage.bind(this);
    this.addBlockToNode = addBlockToNode;
  }

  mine() {
    const validTransactions =
      this.miningNetwork.transactionPool.validTransactions();
    const rewardTransaction = Transaction.rewardTransaction("mineraddress");

    this.miningWebWorker.postMessage({
      action: "MINE",
      lastBlock: this.blockchain.lastBlock(),
      //Web workers are picky about what data types you give them
      transactions: JSON.parse(
        JSON.stringify({
          ...validTransactions,
          [rewardTransaction.id]: rewardTransaction,
        })
      ),
    });
  }

  handleWorkerMessage(event) {
    const { action, block } = event.data;

    if (action === "MINED") {
      this.miningNetwork.broadcastBlock({ block, nodeId: this.id });
      this.blockchain.addBlock(block);
      this.addBlockToNode({ nodeId: this.id, newChain: this.blockchain.chain });
      this.miningNetwork.transactionPool.removeTransactions(block.transactions);
      this.mine();
    }
  }

  receiveBlock(block) {
    this.blockchain.addBlock(block);

    this.miningWebWorker.terminate();
    this.miningWebWorker = new Worker();
    this.miningWebWorker.onmessage = this.handleWorkerMessage.bind(this);
    this.addBlockToNode({ nodeId: this.id, newChain: this.blockchain.chain });

    this.mine();
  }
}

export default MiningNode;
