const Transaction = require('./transaction')
class TransactionPool{
    constructor() {
        this.transactionMap = {};
    }

    clear(){
        this.transactionMap = {};
    }

    setTransaction(transaction){
        this.transactionMap[transaction.id] = transaction;
    }

    existingTransaction({inputAddress}){
        const transasctions = Object.values(this.transactionMap);

        return transasctions.find(transaction => transaction.input.address === inputAddress);
    }

    validTransactions() {
        return Object.values(this.transactionMap).filter(
          transaction => Transaction.validTransaction(transaction)
        );
      }

      clearBlockchainTransactions({ chain }) {
        for (let i=1; i<chain.length; i++) {
          const block = chain[i];
    
          for (let transaction of block.data) {
            if (this.transactionMap[transaction.id]) {
              delete this.transactionMap[transaction.id];
            }
          }
        }
      }
}

module.exports = TransactionPool;