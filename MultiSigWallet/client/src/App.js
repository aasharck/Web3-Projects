import React, { Component } from "react";
import WalletContract from "./contracts/ApprovalWallet.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = WalletContract.networks[networkId];
      const instance = new web3.eth.Contract(
        WalletContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const approvers = web3.methods.getApprovers().call();
      const quorum = web3.methods.quorum().call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3: web3, accounts: accounts, contract: instance, approvers: approvers, quorum: quorum });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <ul>
          <li>Approvers: {this.state.approvers}</li>
          <li>quorum: {this.state.quorum}</li>
        </ul>
      </div>
    );
  }
}

export default App;
