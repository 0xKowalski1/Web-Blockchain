import Blockchain from "./Blockchain";
import Transaction from "./Transaction";
import Worker from "workerize-loader!./MiningNode.worker.js";
import Wallet from "./Wallet";
import State from "./State";

class MiningNode {
  constructor({ id, miningNetwork }) {
    this.id = id;
    this.blockchain = new Blockchain();
    this.miningNetwork = miningNetwork;
    this.miningWebWorker = new Worker();
    this.miningWebWorker.onmessage = this.handleWorkerMessage.bind(this);
    this.minerWallet = new Wallet();
    this.state = new State();
    this.newState = {};
  }

  async init() {
    await this.minerWallet.generateKeyPair();
    this.mine();
  }

  async mine() {
    console.log("Miner: " + this.id + " is mining.");
    const initialValidTransactions =
      await this.miningNetwork.transactionPool.validTransactions();
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
      console.log("Miner: " + this.id + " found new block, broadcasting...");

      this.miningNetwork.broadcastBlock({ block, nodeId: this.id });
      this.blockchain.addBlock(block);

      this.miningNetwork.refreshNodeChain({
        nodeId: this.id,
        newChain: this.blockchain.chain,
      });
      this.miningNetwork.transactionPool.removeTransactions(block.transactions);

      this.state.stateMap = this.newState;
      this.newState = {};

      this.mine();
    }
  }

  async receiveBlock(block) {
    console.log("Miner: " + this.id + " recieved a new block.");

    for (const transactionId in block.transactions) {
      const transaction = new Transaction(block.transactions[transactionId]);
      if (!(await transaction.validTransaction())) {
        console.log(
          "Miner: " +
            this.id +
            " found new block: " +
            block.hash +
            " to be invalid due to ",
          transaction
        );
        return;
      }
    }

    const { _, invalidTransactions, newState } = this.state.runTransactions(
      block.transactions
    );

    if (Object.keys(invalidTransactions).length) {
      console.log(
        "Miner: " +
          this.id +
          " found new block: " +
          block.hash +
          " to be invalid due to invalid transactions",
        invalidTransactions
      );
      return;
    }

    this.blockchain.addBlock(block);

    this.miningWebWorker.terminate();
    this.miningWebWorker = new Worker();
    this.miningWebWorker.onmessage = this.handleWorkerMessage.bind(this);
    this.miningNetwork.refreshNodeChain({
      nodeId: this.id,
      newChain: this.blockchain.chain,
    });

    this.state.stateMap = newState;
    this.newState = {};

    this.mine();
  }
}

export default MiningNode;
