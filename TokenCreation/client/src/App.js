import React, { Component } from "react";
import OrangeCoin from "./contracts/OrangeCoin.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import Whitelist from "./Whitelist";
import Navbar from "./Navbar";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, web3: null, accounts:  null, tokenSaleAddress: null, userTokens: 0, noOfTokens:''};

    this.updateUserTokens = this.updateUserTokens.bind(this);
    this.listenToTokenTransfer = this.listenToTokenTransfer.bind(this);
    this.handleBuyToken = this.handleBuyToken.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const OrangeCoinDeployedNetwork = OrangeCoin.networks[networkId];
      this.OrangeCoinInstance = new web3.eth.Contract(
        OrangeCoin.abi,
        OrangeCoinDeployedNetwork && OrangeCoinDeployedNetwork.address
      );

      const MyTokenSaleDeployedNetwork = MyTokenSale.networks[networkId];
      this.MyTokenSaleInstance = new web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSaleDeployedNetwork && MyTokenSaleDeployedNetwork.address
      );

      const KycContractDeployedNetwork = KycContract.networks[networkId];
      this.KycContractInstance = new web3.eth.Contract(
        KycContract.abi,
        KycContractDeployedNetwork && KycContractDeployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      
      this.setState({ loaded: true, web3: web3, accounts: accounts, tokenSaleAddress: MyTokenSaleDeployedNetwork.address}, this.updateUserTokens);
      this.listenToTokenTransfer();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  async listenToTokenTransfer(){
    await this.OrangeCoinInstance.events.Transfer({to: this.state.accounts[0]}).on("data", this.updateUserTokens);
  }

  async updateUserTokens(){
    let userTokens = await this.OrangeCoinInstance.methods.balanceOf(this.state.accounts[0]).call();
    this.setState({userTokens: userTokens});
  }

  async handleBuyToken(evt){
    evt.preventDefault();
    await this.MyTokenSaleInstance.methods.buyTokens(this.state.accounts[0]).send({from: this.state.accounts[0], value: this.state.noOfTokens});
    this.setState({ noOfTokens: 0});
  }


  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }


  render() {
    if (!this.state.loaded) {
      return (<div className="spindiv d-flex justify-content-center">
      <div className="spinloader spinner-grow" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>);
    }
    return (
      <div>
      <div className="divbody d-flex h-100 text-center text-white">
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <Navbar />


  <main className="px-3">
    <h1 className="Apph2">A Decentralized Meme Token Revolutionizing Web 3.0!</h1>
    <Whitelist KycContract={this.KycContractInstance} accounts={this.state.accounts}/>
        <h4 className="buyorng">Already Whitelisted?</h4>
        <button type="button" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Buy ORNG</button>
        
        <p className="show-token lead">You currently have: {this.state.userTokens} ORNG</p>
        
  </main>

  



        
        
        
      
      </div>
      </div>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Buy ORNG</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <p className="lead">To Buy OrangeCoin, Send ETH to this address: <mark>{this.state.tokenSaleAddress}</mark> </p>
      <h3>OR</h3>
      <form onSubmit={this.handleBuyToken}>
      <div className="input-group mb-3">
          <input type="text" name="noOfTokens" className="form-control" placeholder="Number of Tokens" onChange={this.handleChange} value={this.state.noOfTokens} />
          <button className="btn btn-outline-dark">Buy More ORNG</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
      </div>
    );
  }
}

export default App;
