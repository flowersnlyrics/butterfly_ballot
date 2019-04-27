pragma solidity ^0.4.17; 

contract Ballot {
    // two public functions associated with the JSON
    // methods object
    // setMessage and getMessage (automatically created when
    // we declare message as public) 
    //string public message;
    string public name; 
    //string public 

    function Ballot(string initialMessage) public {
        message = initialMessage; 
    }

    function setMessage(string newMessage) public {
        message = newMessage; 
    }
}

