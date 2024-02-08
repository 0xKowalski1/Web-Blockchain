import Blockchain from "./Blockchain";
import hexToBinary from "hex-to-binary";

class MiningNode {
  constructor({ id, miningPool }) {
    this.id = id;
    this.blockchain = new Blockchain();
    this.miningPool = miningPool;
    //miner wallet
  }

  mine() {
    do {
      let block = this.blockchain.addBlock();
      console.log("new block: ", block.difficulty, hexToBinary(block.hash));

      this.miningPool.broadcastBlock({ block, id: this.id });
    } while (true);
  }

  receiveBlock(block) {
    console.log(this.id, " recieved new block: ", block.hash);
  }
}

export default MiningNode;
