const OrangeCoin = artifacts.require("OrangeCoin")

const chai = require("./setupChai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path: "../.env"})

contract("OrangeCoin", async (accounts) => {

    const [ownerAccount, recipient, anotherAccount] = accounts;

    beforeEach(async () => {
        this.orangeCoin = await OrangeCoin.new(process.env.MAX_SUPPLY)
    })

    it("Test to check if Max supply equal to balance in owner", async () => {
        let OrangeCoinInstance = this.orangeCoin
        let maxSupply = await OrangeCoinInstance.totalSupply();
        return expect(OrangeCoinInstance.balanceOf(ownerAccount)).to.eventually.be.a.bignumber.equal(maxSupply);
    });

    it("is Possible to send Tokens between accounts", async () => {
        let OrangeCoinInstance = this.orangeCoin
        let maxSupply = await OrangeCoinInstance.totalSupply();
        const sendTokens = 1; 
        await expect(OrangeCoinInstance.balanceOf(ownerAccount)).to.eventually.be.a.bignumber.equal(maxSupply);
        await expect(OrangeCoinInstance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        await expect(OrangeCoinInstance.balanceOf(ownerAccount)).to.eventually.be.a.bignumber.equal(maxSupply.sub(new BN(sendTokens)));
        return expect(OrangeCoinInstance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    })

    it("It's not possible to send more tokens than an account has", async ()=> {
        let OrangeCoinInstance = this.orangeCoin
        let balanceOfAccount = await OrangeCoinInstance.balanceOf(ownerAccount);
        await expect(OrangeCoinInstance.transfer(recipient, new BN(balanceOfAccount+1))).to.eventually.be.rejected;
        return expect(OrangeCoinInstance.balanceOf(ownerAccount)).to.eventually.be.a.bignumber.equal(balanceOfAccount)
    })
})