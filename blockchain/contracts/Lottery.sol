pragma solidity ^0.4.17; 

contract Lottery {
    address public manager; // using public or private enforces no security
    address[] public players; 
    
    function Lottery() public {
        manager = msg.sender; 
    }
    
    function enter() public payable {
        require(msg.value > 0.01 ether); 
        // put in players array 
        players.push(msg.sender); 

    }
    
    function random() private view returns (uint){
        return uint(keccak256(block.difficulty, now, players)); // hash is hex #
    }
    
    // public or private not used to enforce security
    // require used to enforce security 
    function pickWinner() public restricted{
        //require(msg.sender == manager); // no one can call this function except the person who created the contract 
        
        uint index = random() % players.length; 
        players[index].transfer(this.balance); // need to send ether represented in contract 
        // might try to reset contract after picking a winner, infinite series of lotteries
        // empty out list of addresses
        players = new address[](0); // new brand new dymanic array, (0) initial size of 0
    }
    
    modifier restricted(){
        require(msg.sender == manager);
        _; 
    }
    
    function getPlayers() public view returns (address[]) {
        return players; 
    }
}


