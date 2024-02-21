import Block from "./Block";

class Blockchain {
  constructor(chain) {
    this.chain = chain ? chain : [Block.genesisBlock()];
  }

  lastBlock = () => this.chain[this.chain.length - 1];

  addBlock = async (newBlock) => (this.chain = [...this.chain, newBlock]);
}

export default Blockchain;
