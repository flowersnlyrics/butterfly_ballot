pragma solidity ^0.4.17; 

contract Ballot {

    address public voteKeeper; // using public or private enforces no security
    address[] public voters; 
    uint [] public winners; 
    
    string public position; 
    uint   public numCandidates; 
    
    struct Candidate {
        string name; 
        uint   votes; 
    }
    
    mapping(uint => Candidate) candidates; 
    uint[] public candidateIdxs; 
    
    function Ballot(string pos) public {
        position = pos; 
        voteKeeper = msg.sender; 
        numCandidates = 0; 
    }
    
    // 
    // Here we push the user's vote 
    // and also check that this voter hasn't voted before 
    //
    function submitVote(uint cand_num) public payable {
        require(!hasAlreadyVoted(msg.sender)); 
        // put in voters array 
        voters.push(msg.sender); 
        candidates[cand_num].votes = candidates[cand_num].votes + 1; 
    }
    
    //
    // Submit a candidate to the ballot for htis position
    //
    function createCandidate(string _name) public {
        require(msg.sender == voteKeeper); 
        
        var candidate = candidates[numCandidates]; // numCandidates is the key, bind candidate to candidates mapping 
        
        candidate.name = _name; 
        candidate.votes = 0; 
        
        candidateIdxs.push(numCandidates) - 1; // push the new candidate index to the array of indexes 
        numCandidates = numCandidates + 1; 
    }

    function getCandidates() view public returns (uint[]){
        return candidateIdxs;
    }
    
    function getCandidate(uint cand_num) view public returns (string, uint){
        return(candidates[cand_num].name, candidates[cand_num].votes ); 
    }
    
    
    //
    // Check is user has already voted 
    //
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
    function pickWinner() public restricted {
        require(msg.sender == voteKeeper); // no one can call this function except the person who created the contract 
      
        uint win_idx = 0;
        uint i = 0; 
        
        for(i = 0; i < numCandidates; i++){
            if(candidates[i].votes >= candidates[win_idx].votes){
                win_idx = i; 
            }
        }
        winners.push(win_idx) - 1;
        

        for(i = 0; i < numCandidates; i++){
            if(candidates[i].votes == candidates[win_idx].votes){
                if(i != win_idx){
                    winners.push(i)- 1; 
                }
            }
        }
    }
    
    modifier restricted(){
        require(msg.sender == voteKeeper);
        _; 
    }
    
    function getVoters() public view returns (address[]) {
        return voters; 
    }
    
    function getWinners() public view returns (uint[]) {
        return winners; 
    }
    

}




