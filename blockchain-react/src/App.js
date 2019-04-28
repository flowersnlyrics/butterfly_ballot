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
            voteKeeper:'',
            candidateIdxs: [],
            A: '', 
            position:'',
            items: [],
            text: ''
        }
    }

    async componentDidMount() {
        const voteKeeper = await ballot.methods.voteKeeper().call();
        const position   = await ballot.methods.position().call();
        const candidateIdxs = await ballot.methods.getCandidates().call();
        
        // TODO delete
        const A = await ballot.methods.getCandidate(candidateIdxs[0]).call(); 

        //const players = await lottery.methods.getPlayers().call(); 
        //const balance = await web3.eth.getBalance(lottery.options.address); 
        //
        /////this.setState({manager:manager}); 
        ////we should set our manager with something to start
        //this.setState({manager, players, balance}); //use 2015 syntax 
        this.setState({voteKeeper:voteKeeper}); //use 2015 syntax 
        this.setState({position:position});
        this.setState({candidateIdxs:candidateIdxs}); 
        this.setState({A: A[0]}); 
    }

    onSubmit = async event => {
         event.preventDefault(); 

         const accounts = await web3.eth.getAccounts(); 
         
         this.setState({statusMsg:'Waiting on transaction success...'});
        
         await ballot.methods.createCandidate(this.state.newCandidate).send({
            from: accounts[0],
            gas: '3000000'
         });

         this.setState({statusMsg: 'Candidate List updated!'});
     };

     handleChange = async event => {
         this.setState({ text: event.target.value });
     }

     handleSubmit = async event => {
         event.preventDefault(); 
         if(!this.state.text.length){
             return;
         }
         const newItem = {
             text: this.state.text, 
             id: Date.now()
         };
          this.setState(state => ({
                        items: state.items.concat(newItem),
                        text: ''
         }));

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
            <hr />
                <h4> Want to cast your vote?</h4>
                <p>{this.state.candidateIdxs[0]} {this.state.A}</p>
            <hr />
            <form onSubmit={this.onSubmit}>
                <h4> Want to add a candidate? </h4>
                <div>
                    <input
                        value={this.state.newCandidate}
                        onChange={event => this.setState({newCandidate:event.target.value})}
                    />
                </div>
                <button>Enter</button>
            </form>
            <hr />
            <h1>{this.state.statusMsg}</h1>
            <div>
              <h3>TODO</h3>
              <TodoList items={this.state.items} />
              <form onSubmit={this.handleSubmit}>
                <label htmlFor="new-todo">
                  What needs to be done?
                </label>
                <input
                  id="new-todo"
                  onChange={this.handleChange}
                  value={this.state.text}
                />
                <button>
                  Add #{this.state.items.length + 1}
                </button>
              </form>
            </div> 
          </div>
      );
    }
}

export default App;

