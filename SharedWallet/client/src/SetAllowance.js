import React, { Component } from "react";
import BalanceCard from "./BalanceCard";
import "./SetAllowance.css";

class SetAllowance extends Component {
  constructor(props) {
    super(props);
    this.state = { SCBalance: 0, allowanceAmount: "", toAddress: "" , newAllowance: 0};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.listenToAllowanceChange = this.listenToAllowanceChange.bind(this);
    this.updateAllowance = this.updateAllowance.bind(this);
    this.showBalance = this.showBalance.bind(this);
  }

  componentDidMount() {
    this.setState({}, this.updateAllowance);
    this.listenToAllowanceChange();
    this.showBalance();
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  async listenToAllowanceChange() {
    await this.props.instance.events
      .AllowanceChanged({
        _byWhom: this.props.accounts[0],
        _forWho: this.state.toAddress,
        _newAllowance: this.state.allowanceAmount,
      })
      .on("data", this.updateAllowance);
  }

  async updateAllowance() {
    let newAllowance = await this.props.instance.methods
      .getAllowance(this.props.accounts[0])
      .call();
    this.setState({ newAllowance: newAllowance });
  }

  async handleSubmit() {
    try{
    await this.props.instance.methods
      .setAllowance(this.state.toAddress, this.state.allowanceAmount)
      .send({ from: this.props.accounts[0] });
    alert(this.state.allowanceAmount + " WEI has been alocated to " + this.state.toAddress)
    } catch(error){
        alert(error);
    }
  }

  async showBalance() {
    let balance = await this.props.instance.methods
      .getBalanceInSmartContract()
      .call();
    this.setState({ SCBalance: balance });
  }

  render() {
    if(this.props.accounts[0] === this.props.owner){
        return(
            <div>
                <BalanceCard
          SharedWalletInstance={this.props.instance}
          accounts={this.props.accounts}
          newAllowance={this.state.SCBalance}
          cardName="Balance in Smart Contract"
        />
            <hr className="hr-line" />
            <h1 className='SetAllowance-title lead fs-3'>Set Allowance</h1>
        
          <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group mb-3">
            <input
              onChange={this.handleChange}
              name="toAddress"
              value={this.state.toAddress}
              type="text"
              className="form-control"
              placeholder="Recipient's Address"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
            />
            <input
              onChange={this.handleChange}
              name="allowanceAmount"
              value={this.state.allowanceAmount}
              type="text"
              className="form-control"
              placeholder="Allowance Amount"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
            />
            <button
              className="btn btn-outline-primary"
              id="button-addon2"
              onClick={this.handleSubmit}
            >
              {" "}
              Set Allowance
            </button>
            </div>
          </form>
        <p className="lead text-muted">If you want to add more money to this Wallet. Please send ETH to: <mark>{this.props.walletAddress}</mark></p>
        </div>
        )
    }
    return (
      <div>
        <BalanceCard
          SharedWalletInstance={this.props.instance}
          accounts={this.props.accounts}
          newAllowance={this.state.newAllowance}
          cardName="Your Allowance"
        />
      </div>
    );
    
  }
}

export default SetAllowance;
