import React, { Component } from "react";
import "./BalanceCard.css";

class BalanceCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            amountToSend: '',
            toAddress: '',
            isSuccess: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    // async listenToAllowanceChange(){
    //     await this.props.SharedWalletInstance.events.AllowanceChanged({to: this.state.accounts[0]}).on("data", this.updateUserTokens);
    // }

    handleChange(evt){
        this.setState({
            [evt.target.name]: evt.target.value,
          });
    }

    async handleSubmit(){
      try{
        await this.props.SharedWalletInstance.methods.withdrawEth(this.state.toAddress, this.state.amountToSend).send({from: this.props.accounts[0]})
        this.setState({ amountToSend: 0, toAddress: ''});
        alert("Transaction Was Successful")
      }
      catch(error){
        alert(error);
      }
    }

    

  render() {
    return (
        <div>
    <div className="balance-card">
        <div className="card text-white bg-primary mb-3 shadow">
  <div className="card-header">{this.props.cardName}</div>
  <div className="card-body">
    <h3 className="card-text">{this.props.newAllowance} WEI</h3>
  </div>

</div>
    </div>
    
<form onSubmit={e => e.preventDefault()}>
<div className="input-group mb-3">
  <input onChange={this.handleChange} name="toAddress" value={this.state.toAddress} type="text" className="form-control" placeholder="Recipient's Address" aria-label="Recipient's username" aria-describedby="button-addon2" />
  <input onChange={this.handleChange} name="amountToSend" value={this.state.amountToSend} type="text" className="form-control" placeholder="Amount" aria-label="Recipient's username" aria-describedby="button-addon2" />
  <button onClick={this.handleSubmit} className="btn btn-outline-primary" id="button-addon2">Send</button>
  </div>
  </form>

    </div>

    );
  }
}

export default BalanceCard;
