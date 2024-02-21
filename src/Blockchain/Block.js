import hexToBinary from "hex-to-binary";
import cryptoHash from "./utillities/cryptoHash";

const GENESISBLOCK = {
  data: "GENESIS_DATA",
  lastHash: "-",
  hash: "GENESIS_HASH",
  timestamp: Date.now(),
  nonce: 1,
  difficulty: 1,
  transactions: {},
};

const MINERATE = 10000;

class Block {
  constructor({ lastHash, hash, timestamp, nonce, difficulty, transactions }) {
    this.lastHash = lastHash;
    this.hash = hash;
    this.timestamp = timestamp;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.transactions = transactions || {};
  }

  static genesisBlock = () => new Block(GENESISBLOCK);

  static async mineBlock({ lastBlock, transactions }) {
    const lastHash = lastBlock.hash;
    let difficulty = lastBlock.difficulty;
    let hash, timestamp;
    let nonce = 1;

    do {
      nonce++;
      timestamp = Date.now();

      const difference = timestamp - lastBlock.timestamp;

      if (difference > MINERATE) {
        difficulty = Math.max(1, difficulty - 1);
      } else {
        difficulty++;
      }

      hash = await cryptoHash(
        lastHash,
        nonce,
        difficulty,
        timestamp,
        transactions
      );
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );

    return new Block({
      lastHash,
      hash,
      timestamp,
      nonce,
      difficulty,
      transactions,
    });
  }
}

export default Block;
