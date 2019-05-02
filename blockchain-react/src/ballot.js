import web3 from './web3';

//const address = '0x3A7fFdb5eCD5dd9e1b1ACDc146018F60d826309A'; 
//const address = '0x8c7d4023d24E964e5163a531499c87eD4ec6Fc2D';
//const address = '0x26F662dc00A250C10Cb57797E6c6899c9B67F66B'; 
//
//const address = '0x0c0A3B67F430AefC1a741d4dF400445D02AB7658';
//
const address = '0xeB30e1F5C364F66350FF0d5a17c6EB40c779040b';
//
//const address = '0x1a555555EBF2c9CC5f661A79f29b5B4c4AfdA465' ;
const abi = [
    {
        "constant":true,
        "inputs":[],
        "name":"getCandidates",
        "outputs":[{"name":"", "type":"uint256[]"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[],
        "name":"position",
        "outputs":[{"name":"","type":"string"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    {
        "constant":false,
        "inputs":[{"name":"cand_num","type":"uint256"}],
        "name":"submitVote",
        "outputs":[],
        "payable":true,
        "stateMutability":"payable",
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[{"name":"cand_num","type":"uint256"}],
        "name":"getCandidate",
        "outputs":[{"name":"","type":"string"}, {"name":"","type":"uint256"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[{"name":"","type":"uint256"}],
        "name":"candidateIdxs",
        "outputs":[{"name":"","type":"uint256"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[],
        "name":"numCandidates",
        "outputs":[{"name":"","type":"uint256"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    {
        "constant":false,
        "inputs":[],
        "name":"pickWinner",
        "outputs":[],
        "payable":false,
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "constant":false,
        "inputs":[{"name":"_name","type":"string"}],
        "name":"createCandidate",
        "outputs":[],
        "payable":false,
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[{"name":"","type":"uint256"}],
        "name":"winners",
        "outputs":[{"name":"","type":"uint256"}],
        "payable":false,
        "stateMutability":"view","type":"function"
    },
    {
        "constant":true,"inputs":[],
        "name":"getVoters",
        "outputs":[{"name":"","type":"address[]"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[],
        "name":"voteKeeper",
        "outputs":[{"name":"","type":"address"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[{"name":"","type":"uint256"}],
        "name":"voters",
        "outputs":[{"name":"","type":"address"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    {
        "constant":true,
        "inputs":[],
        "name":"getWinners",
        "outputs":[{"name":"","type":"uint256[]"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[{"name":"pos","type":"string"}],
        "payable":false,
        "stateMutability":"nonpayable",
        "type":"constructor"
    }
]

// local JS object to represent our ballot contract instance
// complete copy of contract that we can work with in our react code
export default new web3.eth.Contract(abi, address);
