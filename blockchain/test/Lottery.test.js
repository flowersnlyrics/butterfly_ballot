const assert = require('assert'); 
const ganache = require('ganache-cli'); // automatically boots up test network
const Web3 = require('web3');
//const web3 = require(ganache.provider()); // what connects us to the network
const provider = ganache.provider(); 
const web3 = new Web3(provider); 

const {interface, bytecode} = require('../compile'); // {} because we're requiring an object

let lottery; 
let accounts; 

// deploy contract and get list of all of our accounts
// before every test
beforeEach(async () => {
    accounts = await web3.eth.getAccounts(); 

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000' });
});


describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    // What behavior do you really care about with this contract?

    // Any time someone calls enter, make sure their address gets
    // added if they send the correct amount of money
    it('allows one account to enter', async() => {
        await lottery.methods.enter().send({
            from: accounts[0], 
            value: web3.utils.toWei('0.02', 'ether') 
        }); 

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        
        assert.equal(accounts[0], players[0]); // should be, is 
        assert.equal(1, players.length); 
    });

    // able to enter on multiple accounts and that they 
    // are stored in the players array 
    it('allows mutiple account to enter', async() => {
        
        // 1 account enters
        await lottery.methods.enter().send({
            from: accounts[0], 
            value: web3.utils.toWei('0.02', 'ether') 
        }); 
        // 2 accounts enter 
        await lottery.methods.enter().send({
            from: accounts[1], 
            value: web3.utils.toWei('0.02', 'ether') 
        }); 
        // 3 accounts enter 
        await lottery.methods.enter().send({
            from: accounts[2], 
            value: web3.utils.toWei('0.02', 'ether') 
        }); 


        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        
        assert.equal(accounts[0], players[0]);  // is, should be 
        assert.equal(accounts[1], players[1]);  // is, should be 
        assert.equal(accounts[2], players[2]);  // is, should be 
        assert.equal(3, players.length); 
    });

    // make sure person can enter if they send less than more ether
    it('requires a minimum amt. of ether to enter', async() => {
        try{
            await lottery.methods.enter().send({
                from: accounts[0], 
                value: 200 // Wei
            });
            assert(false); // test fails here  
        } catch(err){
           assert(err); // check for truthfulness, we should get here cause no ether :( 
           
        }

    });
    
    // if some person other than the manager attemps to 
    // pick a winner an error should be thrown
    it('only manager can call pickWinner', async() => {
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });

            assert(false); //automatically fails the test no matter what
        } catch(err) {
            assert(err); // error should be thrown since ACCT.1 is not the manager (acct 0 is)  
        }
    });

    // end to end test
    // winner gets money, players array gets reset
    it('sends money to the winner and resets the players array', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        // only enter accounts[0] into lottery so that it def wins
        // see if accounts[0] balance before and after is different
        // should be more after calling pickWinner
        const initialBalance = await web3.eth.getBalance(accounts[0]); // units of wei
        
        // spent gas here 
        await lottery.methods.pickWinner().send({from: accounts[0]});
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        // wont be exactly two ether because when you send money to 
        // an account you have to pay a certain amount of gas
        // for that transaction
        const difference = finalBalance - initialBalance; 
        assert(difference > web3.utils.toWei('1.8','ether'));
        
        // assert that lottery itself has a balance of zero
        const lotteryBalance = await web3.eth.getBalance(lottery.options.address);
        assert(lotteryBalance == 0); 

        // assert that the players array is indeed empty 
        const players = await lottery.methods.getPlayers().call();
        assert(players.length == 0); 

    });

});


