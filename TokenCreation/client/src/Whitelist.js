import React, { Component } from "react";
import "./Whitelist.css"

class Whitelist extends Component {
  constructor(props) {
    super(props);
    this.state = {isWhitelisted: false, spots:0}
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount(){
    let kycContract = this.props.KycContract;
    let spots = await kycContract.methods.getSpotsLeft().call();

    this.setState({spots: spots})
    this.isWhitelist();
  }

  componentDidUpdate(){
    this.isWhitelist();
  }

  async isWhitelist(){
    let kycContract = this.props.KycContract;
    let account = this.props.accounts;
    let whitelisted = await kycContract.methods.getKycDetails(account[0]).call();
    this.setState({isWhitelisted: whitelisted})
  }


  async handleSubmit(evt) {
    try{
        evt.preventDefault();
        let kycContract = this.props.KycContract;
        let account = this.props.accounts;
        await kycContract.methods.setKyc(account[0]).send({ from: account[0] });
        alert(account[0] + " Has been whitelisted");
    }catch(err){
        await console.log(err.message);
    }
  }

  render() {
    if(this.state.isWhitelisted === true){
      return(<h4 className="Whitelist">Congrats! You have been Whitelisted!</h4>)
    }else if(this.state.spots == 0){
      return(<h4 className="Whitelist">Sorry! The Whitelist is full</h4>);
    }
    return (
      <div className="Whitelist">
        <h4>Be the First Few to Buy OrangeCoin</h4>
        <form onSubmit={this.handleSubmit}>
          <div className="d-grid gap-2 col-3 mx-auto">
          
          <button className="btn btn-outline-light">Join Whitelist</button>
          <p>Spots Left: {this.state.spots}</p>
          </div>
        </form>
      </div>
    );
  }
}

export default Whitelist;
