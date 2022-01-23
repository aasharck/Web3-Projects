const Wallet = artifacts.require("ApprovalWallet");

contract("ApprovalWallet", (accounts)=>{
    let wallet;
    beforeEach( async ()=> {
        wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 1000000});
    })

    it("Has the correct number of approvers and quorum", async ()=> {
        let approvers = await wallet.getApprovers();
        let quorum = await wallet.quorum();
        console.log(approvers)
        console.log(quorum)

        assert(approvers[0] === accounts[0]);
        assert(approvers[1] === accounts[1]);
        assert(approvers[2] === accounts[2]);
        assert(quorum.toNumber() === 2);
    })

    it("Create a ")
})