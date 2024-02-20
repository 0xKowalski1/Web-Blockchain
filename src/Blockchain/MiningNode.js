import Blockchain from "./Blockchain";
import Worker from "workerize-loader!./MiningNode.worker";

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
    this.miningWebWorker.postMessage({
      action: "MINE",
      lastBlock: this.blockchain.lastBlock(),
    });
  }

  handleWorkerMessage(event) {
    const { action, block } = event.data;
    if (action === "MINED" && !this.receiving) {
      this.miningNetwork.broadcastBlock({ block, nodeId: this.id });
      this.blockchain.addBlock(block);
      this.addBlockToNode({ nodeId: this.id, newChain: this.blockchain.chain });
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
