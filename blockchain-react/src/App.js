import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import TodoList from './TodoList.js';

//not working with the library but the file that we made
import web3 from './web3';

//get access to our lottery contract on the blockchain
import ballot from './ballot'; 

class App extends Component{
    //state = {
    //      voteKeeper: ''
    //    manager: '',
    //    players: [], 
    //    balance: '',
    //    value: '',
    //    message: ''
    //};
    
    constructor(props){
        super(props); 

        this.state = {
            newCandidate: '',
            statusMsg: '',
            voteMsg: '',
            addCandMsg: '',
            pickWinMsg: '',
            voteKeeper:'',
            candidateIdxs: [],
            position:'',
            items: [],
            text: '',
            vote: '',
            winner: 'no winner picked',
            ballot_addr: ''
        }
    }

    async componentDidMount() {
        const voteKeeper = await ballot.methods.voteKeeper().call();
        const position   = await ballot.methods.position().call();
        const candidateIdxs = await ballot.methods.getCandidates().call();
        const ballot_addr = await ballot.options.address; 

        for(var i = 0; i < candidateIdxs.length; i++){
            
            var A = await ballot.methods.getCandidate(candidateIdxs[i]).call(); 
            
            var newItem = {
                text: candidateIdxs[i] + " : " + A[0], 
                id: Date.now()
            };

         this.setState(state => ({
                           items: state.items.concat(newItem),
                           text: ''
            }));
        }

        const winners = await ballot.methods.getWinners().call(); 
        
        this.setState({ballot_addr:ballot_addr}); 
        this.setState({voteKeeper:voteKeeper}); //use 2015 syntax 
        this.setState({position:position});
        this.setState({candidateIdxs:candidateIdxs});
        if(winners.length == 0){
            this.setState({voteMsg:'Ready for your vote...'});
            this.setState({addCandMsg: 'Ready for your candidate...'});
            this.setState({pickWinMsg: 'Ready to pick a winner...'}); 
        }
        else{
            this.setState({voteMsg:'This election is ended, vote won\'t count'});
            this.setState({addCandMsg: 'Old Election, don\'t add candidates'});
            this.setState({pickWinMsg: 'Old Election, winner already picked'});
            this.setState({winner:winners});
            this.setState({statusMsg:'ELECTION OVER!'});
        }
    }

     handleChange = async event => {
         this.setState({ text: event.target.value });
     }

     handleChangeOfVote = async event => { 
        this.setState({ vote: event.target.value[0]});     
     }

     handleSubmitVote = async event => {
         event.preventDefault();

         if(!this.state.vote.length){

             return;
         }

         const candidateIdxs = await ballot.methods.getCandidates().call();
        
         //var firstChar = this.state.vote[0]; 
         //this.setState({vote: firstChar }); 

         for (var i = 0; i < candidateIdxs.length; i++){
             if(this.state.vote[0] == candidateIdxs[i]){
                 this.setState({vote: this.state.vote[0]});
                 this.setState({voteMsg: 'Processing your vote...check Ethreum Console!'});
                 
                 // user wants their vote to be processed
                 const accounts = await web3.eth.getAccounts(); 
                 this.setState({statusMsg:'Waiting on vote transaction success...'});
                 
                 try{
                 await ballot.methods.submitVote(this.state.vote).send({
                    from: accounts[0],
                    gas: '3000000'
                 });
                    
                 this.setState({voteMsg: 'Your vote has been processed!'});
                 this.setState({statusMsg: 'Transaction success, thank you for voting!'});
                 } catch(e) {

                    this.setState({voteMsg: 'ERROR processing vote: Have you already voted?'});
                    this.setState({statusMsg: 'Transaction was not processed. You probably already voted.'});  

                 }
                 return; 


             }
         }

         // TODO update with a better message
         this.setState({voteMsg: 'Sorry that\'s not a candidate... Try again!'}); 
         this.setState({vote:''}); 
     }

     handlePickWinner = async event => {
        event.preventDefault();


        const accounts = await web3.eth.getAccounts(); 
        this.setState({statusMsg:'Waiting on transaction success...'});
        this.setState({pickWinMsg: 'Sending message to pick a winner...'}); 
        try {
             await ballot.methods.pickWinner().send({
                 from: accounts[0],
                 gas: '100000'
             }); 

             const winners = await ballot.methods.getWinners().call({
                 from: accounts[0]
             });
            
             this.setState({winner: winners}); 

             this.setState({statusMsg:'Transaction success, Election over!'});
             this.setState({pickWinMsg: 'Winner picked! Thanks to all candidates.'});  

        } catch(e){
            this.setState({statusMsg:'Transaction failed, you are not the votekeeper '}); 
            this.setState({pickWinMsg: 'Only votekeeper can pick a winner'});  
        }
         
     }

     handleSubmit = async event => {
         event.preventDefault(); 
         if(!this.state.text.length){
             return;
         }
         const newItem = {
             text: this.state.items.length + " : " + this.state.text, 
             id: Date.now()
         };

         const accounts = await web3.eth.getAccounts(); 
         
        
         this.setState({statusMsg:'Waiting on transaction success...'});
         this.setState({addCandMsg:'Sending vote keeper\'s candidate to ballot contract...'});
        
         try{
             await ballot.methods.createCandidate(this.state.text).send({
            from: accounts[0],
            gas: '3000000'
           });

           this.setState({addCandMsg: 'Candidate added, thank you vote keeper!'});
        
         } catch(e){
             this.setState({addCandMsg: 'You are not the vote keeper! Candidate not added!!'});
             this.setState({statusMsg: 'Candidate List the same!'});
             return; 
         }
        

         this.setState({statusMsg: 'Candidate List updated!'});
         this.setState(state => ({
                        items: state.items.concat(newItem),
                        text: ''
         }));

     }

     handleVote = async event => {
         event.preventDefault(); 
         if(!this.state.vote.length){
             return;
         }

     }

     render() {

      console.log(web3.version); //prints out our current verison of web3
      
      web3.eth.getAccounts() // returns a promise (cant use async/await with a render method of a react component)
      .then(console.log); // chain on the promise with then

      return (
          <div>
            <h2>Voting Contract for {this.state.position}</h2>
            <p> This ballot is managed by {this.state.voteKeeper}
            </p>
            <p> This ballot has a contract address of {this.state.ballot_addr}
            </p>
            <hr />
                <h2> Voter Console </h2>
                <h3> Want to cast your vote?</h3>
                <TodoList items={this.state.items} />
                <form onSubmit={this.handleSubmitVote}>
                  <label htmlFor="new-vote">
                        Your Vote:
                  </label>
                  <input
                    id="new-vote"
                    onChange={this.handleChangeOfVote}
                    value={this.state.vote}
                  />
                  <button>
                    Vote for Candidate!
                  </button>
                  <h4>{this.state.voteMsg}</h4>
                </form>
            <hr />
            <div>
              <h2> Vote Keeper Console </h2>
              <h3>Want to add a candidate?</h3>
              <TodoList items={this.state.items} />
              <form onSubmit={this.handleSubmit}>
                <label htmlFor="new-todo">
                    New Candidate:    
                </label>
                <input
                  id="new-todo"
                  onChange={this.handleChange}
                  value={this.state.text}
                />
                <button>
                  Add Candidate #{this.state.items.length + 1}
                </button>
                <h4>{this.state.addCandMsg}</h4>
              </form>
              <h3>Want to pick a winner?</h3>
              <form onSubmit={this.handlePickWinner}>
                <label htmlFor="new-winner">
                    Click 'End Ballot' to pick a winner!
                </label>
                <input
                    id="new-winner"
                    onChange={this.handleWinnerChange}
                    value={this.state.winner}
                />
                <button>
                    End Ballot
                </button>
                <h4>{this.state.pickWinMsg}</h4>
              </form>
            </div>
            <hr />
            <h1> Ethereum Status Console </h1>
            <h2>{this.state.statusMsg}</h2>
          </div>
      );
    }
}

export default App;

