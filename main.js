// requiring SHA256 
const SHA256 = require('crypto-js/sha256')

// creating a 'Transaction' class constructor
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

// creating a 'Block' class constructor
class Block {
    constructor (timestamp, transactions, previousHash = '') {
        // order of blocks is determined by position in the array
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.getHash();
        // nonce value is a random number that does not effect the chain if changed
        this.nonce = 0;
    }

    // will obtain the hash of the block
    getHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // implementing Proof of Work, puts limit to how many blocks can be created, 
        // requires hash of the block to start with certain amount of zeros
    mineBlock(difficulty) {
        //  will set the first set of numbers (amount depending on the difficulty set) and will produce zeros infront
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.getHash();
        }

        console.log(`Block Mined: ${this.hash}`);
    }
};

// creating a 'Blockchain' class constructor
class BlockChain{
    constructor() {
        // initializes the blockchain
        this.chain = [this.getGenesisBlock()];
        // raising the difficulty will take more time for blocks to be created
        this.difficulty = 2;
        // all the transactions made between the time the block is created, is store in this array
        this.pendingTransaction = [];
        // rewards 50 coins if successfully mined
        this.miningReward = 50;
    }

    // create the first block (aka genesis block) of the blockchain, must be manually created 
    getGenesisBlock() {
        // Genesis block does not contain previous hash
        return new Block("06/06/2022", "Genesis Block", "0");
    }

    // returns the last block of the chain
    getRecentBlock() {
        return this.chain[this.chain.length -1];
    }

    // mining new blocks
    minePendingTransaction(rewardAddress) {
        let block = new Block(Date.now(), this.pendingTransaction);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        // ressets the pendiongTransaction array and give miner the reward
        this.pendingTransaction = [
            new Transaction(null, rewardAddress, this.miningReward)
        ];
    }

    // recieve a transaction and add to pendingTransaction array
    createTransaction(transaction) {
        this.pendingTransaction.push(transaction)
    }

    // checks the balance of the address(transaction is sorted in blockchain)
    getAddressBalance(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount
                }

                if (trans.toAddress === address) {
                    balance += trans.amount
                }
            }
        }

        return balance
    }

    // validate the integretiy of the chain 
    validateChain() {
        // loops over the chain, starting from the block after the geneis block
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i -1]

            // validates the hash
            if (currentBlock.hash !== currentBlock.getHash()) {
                return false;
            }

            // validates the previoushash
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
};

// creates a coin called wonCoin, and adds multiple block to its chain 
let wonCoin = new BlockChain();

wonCoin.createTransaction(new Transaction('address1', 'address2', 100));
wonCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
wonCoin.minePendingTransaction('pauls-address')

console.log('\n Balance of Paul is', wonCoin.getAddressBalance('pauls-address'));

console.log('\n Starting the  second miner...');
wonCoin.minePendingTransaction('pauls-address')

console.log('\n Balance of Paul is', wonCoin.getAddressBalance('pauls-address'));

