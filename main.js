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
    }

    // will obtain the hash of the block
    getHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
};

// creating a 'Blockchain' class constructor
class BlockChain{
    constructor() {
        // initializes the blockchain
        this.chain = [this.getGenesisBlock()];
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
        newBlock.hash = newBlock.getHash();

        // pushes the new block to the chain
        this.chain.push(newBlock);
    }
};

// creates a coin called wonCoin, and adds multiple block to its chain 
let wonCoin = new BlockChain();
wonCoin.addBlock(new Block(1, "06/08/2022", { amount: 4}));
wonCoin.addBlock(new Block(1, "06/11/2022", { amount: 10}));

console.log(JSON.stringify(wonCoin, null, 4));