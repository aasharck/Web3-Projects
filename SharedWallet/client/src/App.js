import React, { Component } from "react";
import SharedWalletContract from "./contracts/SharedWallet.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import BalanceCard from "./BalanceCard";
import SetAllowance from "./SetAllowance";

class App extends Component {
  constructor(props){
    super(props);
    this.state = { owner: null, web3: null, accounts: null, walletAddress: null };

    
  }
  

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SharedWalletContract.networks[networkId];
      this.instance = new web3.eth.Contract(
        SharedWalletContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const owner = await this.instance.methods.getOwner().call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ owner: owner, web3: web3, accounts: accounts, walletAddress: deployedNetwork.address });
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  
  


  render() {
    if (!this.state.web3) {
      return (<div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>)
    }
    return (
      <div className="App">
        <h2 className="fw-bold sub-writeup lead fs-1">WalletX</h2>
<h6 className='lead'>WalletX lets you share your money with others.</h6><h6 className='lead'>Egs: Give allowance to your kids, to your employees, etc</h6>
        <SetAllowance walletAddress={this.state.walletAddress} instance={this.instance} accounts={this.state.accounts} owner={this.state.owner}/>
      </div>
    );
  }
}

export default App;
