const BN = require('bn.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');

const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";
const WETH_WHALE = '0x1c11ba15939e1c16ec7ca1678df6160ea2063bc5';
const WETH_ADDRESS='0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

describe('Uniswap', function () {
  let wethContract;


  // it('create a token and have balance', async function () {
  //   const Uni = await ethers.getContractFactory('UniswapTest');
  //   const uni = await Uni.deploy();
  //   await uni.deployed();
  //   const [owner] = await ethers.getSigners();
  //   expect(
  //     await uni.balanceOf(owner.address)).to.equal((5000000000000000));
  //   // const Tx = await uni.setGreeting("Hola, mundo!");

  //   // // wait until the transaction is mined
  //   // await Tx.wait();
  // });

  // it('get token pair', async function () {
  //   const Uni = await ethers.getContractFactory('UniswapTest');
  //   const uni = await Uni.deploy();
  //   await uni.deployed();

  //   const Tx = await uni.uniswapV2Pair();

  //   // await Tx.wait();
  //   console.log(Tx);
  // });

   it('create liquidity', async function (){
    const Uni = await ethers.getContractFactory('UniswapTest');
    const uni = await Uni.deploy();
    await uni.deployed();
    const [owner] = await ethers.getSigners();

    const tokenA=uni.address;

    //send ether to contract
    await owner.sendTransaction({
      to: uni.address,
      value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
      gasLimit: 300000
    });

//impersonate a whale
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WETH_WHALE],
  });

  //get signer of whale - I think it's the prvt key
    const signer = await ethers.provider.getSigner(WETH_WHALE);
    signer.address = signer._address;

    //get the weth contract
    wethContract = await hre.ethers.getContractAt(IERC20_SOURCE, WETH_ADDRESS, signer);
    wethContractSigner = wethContract.connect(signer);

    console.log("Signer WETH balance", await wethContractSigner.balanceOf(signer.address))


//transfering WETH from Whale to owner
    await wethContractSigner.transfer(owner.address, 5000000000000000, { from: WETH_WHALE });

  //   //approving the contract to spend the tokens
   await uni.approve(uni.address, 500000000000000, { from: owner.address });
   await wethContract.connect(owner).approve(uni.address, 500000000000000);
    
    console.log('WETH that I have ' + await wethContractSigner.balanceOf(owner.address));

    let tx = await uni.addLiquidity(
      uni.address,
      wethContractSigner.address,
      500000000000000,
      500000000000000,
      {
        from: owner.address,
      }
    );


    const txLog = await tx.wait();
    console.log("=== add liquidity ===");
    // console.log(txLog.events)
    for (const log of txLog.events) {
      console.log(`${log.args}`);
    }
  })

  // it('get token pair', async function (){
  //   const Uni = await ethers.getContractFactory('UniswapTest');
  //   const uni = await Uni.deploy();
  //   await uni.deployed();
  // })
});
