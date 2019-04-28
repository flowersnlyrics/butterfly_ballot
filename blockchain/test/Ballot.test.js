const assert = require('assert'); 
const ganache = require('ganache-cli'); // automatically boots up test network
const Web3 = require('web3');
//const web3 = require(ganache.provider()); // what connects us to the network
const provider = ganache.provider(); 
const web3 = new Web3(provider); 

const {interface, bytecode} = require('../compile'); // {} because we're requiring an object

let ballot; 
let accounts; 

//
// Deploy contract and get list of all of our accounts
// (before every test)
//
beforeEach(async () => {
    accounts = await web3.eth.getAccounts(); 

    ballot = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: ['President']})
        .send({from: accounts[0], gas: '1000000' });
});


describe('Ballot Contract', () => {
    
    // What behavior do you really care about with this contract?
    
    //
    // TEST #1
    // Make sure this schtuff actually deploys a contract
    // (by checking if the contract instantiation has an addr) 
    //
    it('Ballot.sol instantiation is deployed correctly', () => {
        assert.ok(ballot.options.address);
    });

    //
    // TEST #2 
    // Make sure that the person who deploys the contract
    // is the voteKeeper
    //
    it('Acct. that deploys Ballot contract is the Vote Keeper', async() => {
       const currVoteKeeper = await ballot.methods.voteKeeper().call({
           from: accounts[0]
       });
        
       assert.equal(currVoteKeeper, accounts[0]); //is, should be
       
    }); 

    //
    // TEST #3
    // Any time someone enters their vote, make sure 
    // they're added to the voter array 
    //
    it('When an account votes, should be added to voters array', async() => {
        
        await ballot.methods.submitVote().send({
            from: accounts[0] 
        }); 

        voters = await ballot.methods.getVoters().call({
            from: accounts[0]
        });
        
        assert.equal(voters[0], accounts[0]); // is, should be 
        assert.equal(1, voters.length);       // only one person has voted  
    });

    //
    // TEST #4
    // Make sure that multiple (different) people can vote 
    //
    it('Multiple accounts should be able to vote', async() => {
        
        await ballot.methods.submitVote().send({
            from: accounts[0] 
        }); 
        
        await ballot.methods.submitVote().send({
            from: accounts[1] 
        });

        await ballot.methods.submitVote().send({
            from: accounts[2] 
        }); 

        voters = await ballot.methods.getVoters().call({
            from: accounts[0]
        });
        
        assert.equal(voters[0], accounts[0]); // is, should be 
        assert.equal(voters[1], accounts[1]); // is, should be 
        assert.equal(voters[2], accounts[2]); // is, should be 
        assert.equal(3, voters.length);       // make sure 3 voters have been registered  
    });

    //
    // TEST #5
    // Make sure that the same person doesn't vote twice
    //
    it('Make sure one account can only vote once', async() => {
        
        await ballot.methods.submitVote().send({
            from: accounts[0] 
        }); 
        
        try {
            await ballot.methods.submitVote().send({
                from: accounts[0] 
            });
            
            assert(false); // test fails
        }catch(error)
        {
            assert(error); // supposed to throw an error, test passes
        }
    });
    
    //
    // TEST #6
    // Make sure that only voteKeeper can add a candidate to 
    // the ballot
    //
    it('Only Votekeeper adds candidates to ballot', async() => {
       const currVoteKeeper = await ballot.methods.voteKeeper().call({
           from: accounts[0]
       });
        
       assert.equal(currVoteKeeper, accounts[0]); //is, should be
    
       try {
            await ballot.methods.submitCandidate().send({
                from: accounts[1] 
            });
            
            assert(false); // test fails: rando submitted candidate
        }catch(error)
        {
            assert(error); // supposed to throw an error, test passes
        } 
       
    });
    
    //
    // TEST #4
    // Make sure the same account doesn't vote twice 
    //

    // Any time someone calls enter, make sure their address gets
    // added if they send the correct amount of money

    // able to enter on multiple accounts and that they 
    // are stored in the players array 
//    it('allows mutiple account to enter', async() => {
//        
//        // 1 account enters
//        await ballot.methods.enter().send({
//            from: accounts[0], 
//            value: web3.utils.toWei('0.02', 'ether') 
//        }); 
//        // 2 accounts enter 
//        await ballot.methods.enter().send({
//            from: accounts[1], 
//            value: web3.utils.toWei('0.02', 'ether') 
//        }); 
//        // 3 accounts enter 
//        await ballot.methods.enter().send({
//            from: accounts[2], 
//            value: web3.utils.toWei('0.02', 'ether') 
//        }); 
//
//
//        const players = await ballot.methods.getPlayers().call({
//            from: accounts[0]
//        });
//        
//        assert.equal(accounts[0], players[0]);  // is, should be 
//        assert.equal(accounts[1], players[1]);  // is, should be 
//        assert.equal(accounts[2], players[2]);  // is, should be 
//        assert.equal(3, players.length); 
//    });
//
//    // make sure person can enter if they send less than more ether
//    it('requires a minimum amt. of ether to enter', async() => {
//        try{
//            await ballot.methods.enter().send({
//                from: accounts[0], 
//                value: 200 // Wei
//            });
//            assert(false); // test fails here  
//        } catch(err){
//           assert(err); // check for truthfulness, we should get here cause no ether :( 
//           
//        }
//
//    });
//    
//    // if some person other than the manager attemps to 
//    // pick a winner an error should be thrown
//    it('only manager can call pickWinner', async() => {
//        try{
//            await ballot.methods.pickWinner().send({
//                from: accounts[1]
//            });
//
//            assert(false); //automatically fails the test no matter what
//        } catch(err) {
//            assert(err); // error should be thrown since ACCT.1 is not the manager (acct 0 is)  
//        }
//    });
//
//    // end to end test
//    // winner gets money, players array gets reset
//    it('sends money to the winner and resets the players array', async() => {
//        await ballot.methods.enter().send({
//            from: accounts[0],
//            value: web3.utils.toWei('2', 'ether')
//        });
//
//        // only enter accounts[0] into ballot so that it def wins
//        // see if accounts[0] balance before and after is different
//        // should be more after calling pickWinner
//        const initialBalance = await web3.eth.getBalance(accounts[0]); // units of wei
//        
//        // spent gas here 
//        await ballot.methods.pickWinner().send({from: accounts[0]});
//        const finalBalance = await web3.eth.getBalance(accounts[0]);
//
//        // wont be exactly two ether because when you send money to 
//        // an account you have to pay a certain amount of gas
//        // for that transaction
//        const difference = finalBalance - initialBalance; 
//        assert(difference > web3.utils.toWei('1.8','ether'));
//        
//        // assert that ballot itself has a balance of zero
//        const ballotBalance = await web3.eth.getBalance(ballot.options.address);
//        assert(ballotBalance == 0); 
//
//        // assert that the players array is indeed empty 
//        const players = await ballot.methods.getPlayers().call();
//        assert(players.length == 0); 
//
//    });

});


