const Block = require("./Block");

class Blockchain {
  constructor() {
    this.chain = [Block.genesisBlock()];
  }

  addBlock = () => {
    const lastBlock = this.chain[this.chain.length - 1];

    const newBlock = Block.mineBlock(lastBlock);

    this.chain = [...this.chain, newBlock];

    return newBlock;
  };
}

module.exports = Blockchain;
