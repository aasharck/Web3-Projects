var OrangeCoin = artifacts.require("./OrangeCoin.sol");
var MyTokenSale = artifacts.require("MyTokenSale");
var KycContract = artifacts.require("KycContract");
require("dotenv").config({path: "../.env"})

module.exports = async function(deployer) {
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(OrangeCoin, process.env.MAX_SUPPLY);
  await deployer.deploy(KycContract);
  await deployer.deploy(MyTokenSale, 1, addr[0], OrangeCoin.address,KycContract.address);
  let instance = await OrangeCoin.deployed();
  await instance.transfer(MyTokenSale.address, process.env.MAX_SUPPLY);
};
