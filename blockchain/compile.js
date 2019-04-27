const path = require('path'); 
const fs = require('fs'); 
const solc = require('solc'); 

const ballotPath = path.resolve(__dirname, 'contracts', 'Ballot.sol');
const source = fs.readFileSync(ballotPath, 'utf8');

//console.log(solc.compile(source, 1)); 

// two properties
// interface: javascript API
// bytecode: raw compiled contract 
module.exports = solc.compile(source, 1).contracts[':Ballot']; 





