const path = require('path'); 
const fs = require('fs'); 
const solc = require('solc'); 

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

//console.log(solc.compile(source, 1)); 

// two properties
// interface: javascript API
// bytecode: raw compiled contract 
module.exports = solc.compile(source, 1).contracts[':Lottery']; 





