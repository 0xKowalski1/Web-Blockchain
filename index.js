const hexToBinary = require("hex-to-binary");
const Blockchain = require("./Blockchain/Blockchain");

const blockchain = new Blockchain();

do {
  let block = blockchain.addBlock();
  console.log("new block: ", block.difficulty, hexToBinary(block.hash));
} while (true);
