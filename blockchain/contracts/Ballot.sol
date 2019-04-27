pragma solidity ^0.4.17; 

contract Ballot {
    address public voteKeeper; // using public or private enforces no security
    address[] public voters; 
    
    function Ballot() public {
        voteKeeper = msg.sender; 
    }
    
    // 
    // Here we push the user's vote 
    // and also check that this voter hasn't voted before 
    //
    function submitVote() public payable {
        require(!hasAlreadyVoted(msg.sender)); 
        // put in voters array 
        voters.push(msg.sender); 
    }
    
    function hasAlreadyVoted(address addr) private view returns (bool){
        for(uint i = 0; i < voters.length; i++){
            if(addr == voters[i]){
                return true; 
            }
        }
        
        return false; 
    }
    
    // public or private not used to enforce security
    // require used to enforce security 
    function pickWinner() public restricted{
        //require(msg.sender == manager); // no one can call this function except the person who created the contract 
        
        //uint index = random() % voters.length; 
        //voters[index].transfer(this.balance); // need to send ether represented in contract 
        // might try to reset contract after picking a winner, infinite series of lotteries
        // empty out list of addresses
        voters = new address[](0); // new brand new dymanic array, (0) initial size of 0
    }
    
    modifier restricted(){
        require(msg.sender == voteKeeper);
        _; 
    }
    
    function getVoters() public view returns (address[]) {
        return voters; 
    }
}



