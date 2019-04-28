const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3'); 
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
    // pass in account mneumonic 
    'juice quarter trust tent nerve degree truth knee enable hobby action trust',
    // a URL of what network we want to connect to 
    'https://rinkeby.infura.io/v3/1fd8c7ce6bf14756916218256ee8288d'
); 

// take provider, pass it to Web3 constructor
// specified network to connect to and 
// a source of ether
// send ether, deploy ether, send contracts, update contracts
const web3 = new Web3(provider);

//const result = await new web3.eth.Contract(JSON.parse(interface))
//    .deploy({ data: bytecode, arguments: ['Hi there!'] })
//    .send({ gas: '1000000', from: accounts[0] });

// write a function so we can use the async/await syntax
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attemping to deploy from account', accounts[0]);
    
    // interface is API 
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data:bytecode, arguments: ['President']})
        .send({gas:'1000000', from: accounts[0]});

    // we need the interface (the ABI: translates JS to bytecode)
    console.log(interface); 
    // we need the address of the contract
    console.log('Contract deployed to ', result.options.address);

};
// first get a list of all accounts that have been unlocked
deploy(); 
