// requiring SHA256 
const SHA256 = require('crypto-js/sha256')

// creating a 'Block' class constructor
class Block {
    // index - shows wherre block sits on chain
    // time - when the block is created
    // data -transaction amount, receiver, sender, etc
    // previousHash - the hash of the previous block (validates the block)
    constructor (index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
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
        this.difficulty = 4;
    }

    // create the first block (aka genesis block) of the blockchain, must be manually created 
    getGenesisBlock() {
        // Genesis block does not contain previous hash
        return new Block(0, "06/06/2022", "Genesis Block", "0");
    }

    // returns the last block of the chain
    getRecentBlock() {
        return this.chain[this.chain.length -1];
    }

    // adds new block to the chain
    addBlock(newBlock) {
        // sets the previousHash of the new block to the most recent block of the chain
        newBlock.previousHash = this.getRecentBlock().hash;

        // updates the hash anytime the properites of the block is changed
        newBlock.mineBlock(this.difficulty)

        // pushes the new block to the chain
        this.chain.push(newBlock);
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

console.log('Mining Block 1...');
wonCoin.addBlock(new Block(1, "06/08/2022", { amount: 4}));

console.log('Mining Block 2...');
wonCoin.addBlock(new Block(1, "06/11/2022", { amount: 10}));

// console.log(`Is blockchain of wonCoin valid? ${wonCoin.validateChain()}`);

// console.log(JSON.stringify(wonCoin, null, 4));