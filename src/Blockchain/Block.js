import hexToBinary from "hex-to-binary";
import cryptoHash from "./utillities/cryptoHash";

const GENESISBLOCK = {
  data: "GENESIS_DATA",
  lastHash: "-",
  hash: "GENESIS_HASH",
  timestamp: 1,
  nonce: 1,
  difficulty: 3,
};

const MINERATE = 5000;

class Block {
  constructor({ lastHash, hash, timestamp, nonce, difficulty }) {
    this.lastHash = lastHash;
    this.hash = hash;
    this.timestamp = timestamp;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesisBlock = () => new Block(GENESISBLOCK);

  static mineBlock(lastBlock) {
    const lastHash = lastBlock.hash;
    let difficulty = lastBlock.difficulty;
    let hash, timestamp;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();

      const difference = timestamp - lastBlock.timestamp;

      if (difficulty < 1) {
        difficulty = 1;
      } else if (difference > MINERATE) {
        difficulty--;
      } else {
        difficulty++;
      }

      hash = cryptoHash(lastHash, nonce, difficulty, timestamp);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );

    return new Block({ lastHash, hash, timestamp, nonce, difficulty });
  }
}

export default Block;
