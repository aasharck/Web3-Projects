const { expectRevert } = require("@openzeppelin/test-helpers");

const Wallet = artifacts.require("ApprovalWallet");


contract("ApprovalWallet", (accounts)=>{
    let wallet;
    beforeEach( async ()=> {
        wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 10000});
    })

    it("Has the correct number of approvers and quorum", async ()=> {
        let approvers = await wallet.getApprovers();
        let quorum = await wallet.quorum();
        assert(approvers[0] === accounts[0]);
        assert(approvers[1] === accounts[1]);
        assert(approvers[2] === accounts[2]);
        assert(quorum.toNumber() === 2);
    })

    it("Create a transfer", async() => {

        await wallet.createTransfer(accounts[5], 1000, {from: accounts[0]})
        const transfers = await wallet.getTransfers();
        assert(transfers.length === 1);
        assert(transfers[0].id === '0');
        assert(transfers[0].to === accounts[5]);
        assert(transfers[0].amount === '1000');
        assert(transfers[0].sent === false);
        assert(transfers[0].noOfApprovers == '0');

    })

    it("Should not create a transfer", async() => {
        await expectRevert(
            wallet.createTransfer(accounts[5], 1000, {from: accounts[4]}),
            'You are not an approver'
        )
    });

    it("increment no of approvers", async () =>{

        await wallet.createTransfer(accounts[5], 1000, {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[0]});

        const transfers = await wallet.getTransfers();
        assert(transfers[0].noOfApprovers === '1')
        assert(transfers[0].sent === false);
    });

    it("Approve and transfer the money", async() => {
        let balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));
        
        await wallet.createTransfer(accounts[5], 1000, {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        
        let balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));
        
        assert(balanceAfter.sub(balanceBefore).toNumber() === 1000);

    
    });

    it("Should not approve transfer twice", async () => {
        
        await wallet.createTransfer(accounts[5], 1000, {from: accounts[0]});
        await wallet.approveTransfer(0, {from: accounts[0]});
        await expectRevert(
            wallet.approveTransfer(0, {from: accounts[0]}),
            "You can only approve once"
        )
    })
});