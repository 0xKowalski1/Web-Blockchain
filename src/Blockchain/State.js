import { REWARDADDRESS, REWARDAMOUNT, STARTINGBALANCE } from "./config";

class State {
  constructor() {
    this.stateMap = {};
  }

  newAddress = () => ({ balance: STARTINGBALANCE });

  runTransactions(transactions) {
    const validTransactions = {};
    const invalidTransactions = {};
    const newState = JSON.parse(JSON.stringify(this.stateMap)); // By value, deep copy
    let rewardTransaction = false;

    for (const transactionId in transactions) {
      const transaction = transactions[transactionId];

      if (transaction.from === REWARDADDRESS) {
        if (transaction.value === REWARDAMOUNT && !rewardTransaction) {
          validTransactions[transactionId] = transaction;
          rewardTransaction = true;

          if (!newState[transaction.to]) {
            newState[transaction.to] = this.newAddress();
          }
          newState[transaction.to].balance += transaction.value;

          continue;
        } else {
          invalidTransactions[transactionId] = transaction;
          continue;
        }
      }

      if (transaction.to) {
        if (transaction.data && transaction.data.length) {
          //Calling a contract
        } else {
          //Transfer
          // Check if the sender has enough balance
          // If the sender doesn't exist, initialize their account

          if (!newState[transaction.from]) {
            newState[transaction.from] = this.newAddress();
          }

          if (newState[transaction.from].balance >= transaction.value) {
            // Deduct the transfer amount from the sender's balance
            newState[transaction.from].balance -= transaction.value;

            // If the recipient doesn't exist, initialize their account
            if (!newState[transaction.to]) {
              newState[transaction.to] = this.newAddress();
            }

            // Add the transfer amount to the recipient's balance
            newState[transaction.to].balance += transaction.value;

            // Mark the transaction as valid
            validTransactions[transactionId] = transaction;
          } else {
            // Sender does not have enough balance, mark as invalid
            invalidTransactions[transactionId] = transaction;
          }
        }
      } else {
        //Contract Creation
      }
    }

    return { validTransactions, invalidTransactions, newState };
  }
}

export default State;
