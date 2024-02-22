import Blockchain from "./Blockchain";
import Transaction from "./Transaction";
import Worker from "workerize-loader!./MiningNode.worker.js";
import Wallet from "./Wallet";
import State from "./State";

class MiningNode {
  constructor({ id, miningNetwork, addBlockToNode }) {
    this.id = id;
    this.blockchain = new Blockchain();
    this.miningNetwork = miningNetwork;
    this.miningWebWorker = new Worker();
    this.miningWebWorker.onmessage = this.handleWorkerMessage.bind(this);
    this.addBlockToNode = addBlockToNode;
    this.minerWallet = new Wallet();
    this.state = new State();
    this.newState = {};
  }

  async init() {
    await this.minerWallet.generateKeyPair();
    this.mine();
  }

  mine() {
    const initialValidTransactions =
      this.miningNetwork.transactionPool.validTransactions();
    const rewardTransaction = Transaction.rewardTransaction(
      this.minerWallet.publicKey
    );

    const transactionsToRun = {
      ...initialValidTransactions,
      [rewardTransaction.id]: rewardTransaction,
    };

    const { validTransactions, invalidTransactions, newState } =
      this.state.runTransactions(transactionsToRun);
    this.newState = newState;

    this.miningNetwork.transactionPool.removeTransactions(invalidTransactions);

    this.miningWebWorker.postMessage({
      action: "MINE",
      lastBlock: this.blockchain.lastBlock(),
      //Web workers are picky about what data types you give them
      transactions: JSON.parse(JSON.stringify(validTransactions)),
    });
  }

  handleWorkerMessage(event) {
    const { action, block } = event.data;

    if (action === "MINED") {
      this.miningNetwork.broadcastBlock({ block, nodeId: this.id });
      this.blockchain.addBlock(block);

      this.addBlockToNode({ nodeId: this.id, newChain: this.blockchain.chain });
      this.miningNetwork.transactionPool.removeTransactions(block.transactions);

      this.state.stateMap = this.newState;
      this.newState = {};

      this.mine();
    }
  }

  receiveBlock(block) {
    let validBlock = true;

    for (const transactionId in block.transactions) {
      const transaction = new Transaction(block.transactions[transactionId]);
      if (!transaction.validTransaction()) {
        validBlock = false;
        return;
      }
    }

    const { _, invalidTransactions, newState } = this.state.runTransactions(
      block.transactions
    );

    if (Object.keys(invalidTransactions).length) {
      validBlock = false;
      return;
    }

    if (validBlock) {
      //Wont be hit if block invalid, but just incase
      this.blockchain.addBlock(block);

      this.miningWebWorker.terminate();
      this.miningWebWorker = new Worker();
      this.miningWebWorker.onmessage = this.handleWorkerMessage.bind(this);
      this.addBlockToNode({
        nodeId: this.id,
        newChain: this.blockchain.chain,
      });

      this.state.stateMap = newState;
      this.newState = {};

      this.mine();
    }
  }
}

export default MiningNode;
