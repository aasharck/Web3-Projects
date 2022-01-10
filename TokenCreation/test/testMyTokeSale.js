const OrangeCoin = artifacts.require("OrangeCoin");
const MyTokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");

const chai = require("./setupChai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({ path: "../.env" });

contract("OrangeCoinSale", async (accounts) => {
  const [ownerAccount, recipient, anotherAccount] = accounts;

  it("Owner account should have 0 Orangecoins", async () => {
    const instance = await OrangeCoin.deployed();
    return expect(
      instance.balanceOf(ownerAccount)
    ).to.eventually.be.a.bignumber.equal(new BN(0));
  });

  it("All token should be in the MyTokenSale contract", async () => {
    let instance = await OrangeCoin.deployed();
    let balanceOfMyTokenSale = await instance.balanceOf(MyTokenSale.address);
    let maxSupply = await instance.totalSupply();
    return expect(balanceOfMyTokenSale).to.be.a.bignumber.equal(maxSupply);
  });

  it("Should be able to buy tokens", async () => {
    let tokenInstance = await OrangeCoin.deployed();
    let tokenSaleInstance = await MyTokenSale.deployed();
    let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient);
    await expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.rejected;
    await expect(balanceBeforeAccount).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipient));

    let kycInstance = await KycContract.deployed();
    await kycInstance.setKyc(recipient, {from: ownerAccount});
    await expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
    return expect(balanceBeforeAccount + 1).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipient));
    });

    it("Should be able to whitelist account", async () => {
      let instance = await KycContract.deployed();
      await expect(instance.setKyc(recipient, {from: ownerAccount})).to.be.fulfilled;
    })
});
