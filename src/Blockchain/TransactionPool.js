import Transaction from "./Transaction";

class TransactionPool {
  constructor() {
    this.transactions = {};
  }

  addTransaction(transaction) {
    this.transactions[transaction.id] = transaction;
  }

  removeTransaction(transactionId) {
    if (this.transactions[transactionId])
      delete this.transactions[transactionId];
  }

  removeTransactions(transactions) {
    Object.keys(transactions).forEach((transactionId) =>
      this.removeTransaction(transactionId)
    );
  }

  async validTransactions() {
    const validTransactions = {};

    for (const transactionId in this.transactions) {
      const transaction = new Transaction(this.transactions[transactionId]);
      const validTransaction = await transaction.validTransaction();

      if (validTransaction) {
        validTransactions[transactionId] = transaction;
      } else {
        delete this.transactions[transactionId];
      }
    }

    return validTransactions;
  }

  clear = () => (this.transactions = {});
}

export default TransactionPool;
