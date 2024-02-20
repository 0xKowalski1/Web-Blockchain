import Blockchain from "./Blockchain";
import Worker from "workerize-loader!./MiningNode.worker";

class MiningNode {
  constructor({ id, miningNetwork, setMiningNode }) {
    this.id = id;
    this.blockchain = new Blockchain();
    this.miningNetwork = miningNetwork;

    //Web worker stuff
    this.miningWebWorker = new Worker();
    this.miningWebWorker.onmessage = this.handleWorkerMessage.bind(this);
    this.setMiningNode = setMiningNode;

    this.receiving = false;
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
      this.miningNetwork.broadcastBlock({ block, originNodeId: this.id });
      this.blockchain.addBlock(block);
      this.setMiningNode(this);
      this.mine();
    }
  }

  receiveBlock(block) {
    this.blockchain.addBlock(block);

    this.miningWebWorker.terminate();
    this.miningWebWorker = new Worker();
    this.miningWebWorker.onmessage = this.handleWorkerMessage.bind(this);
    this.setMiningNode(this);

    this.mine();
  }
}

export default MiningNode;
