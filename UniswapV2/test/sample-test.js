const { isCommunityResourcable } = require('@ethersproject/providers');
const BN = require('bn.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');

const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";
const WETH_WHALE = '0x1c11ba15939e1c16ec7ca1678df6160ea2063bc5';
const WETH_ADDRESS='0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const ROUTER ="0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

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
    const Uni = await ethers.getContractFactory('HAHA');
    const uni = await Uni.deploy();
    await uni.deployed();
    const [owner, acc1, acc2, acc3] = await ethers.getSigners();

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
    const decimals = ethers.BigNumber.from(10).pow(18);

    console.log("Whale WETH balance", await wethContractSigner.balanceOf(signer.address))
    console.log("whale HAHA Balance", await uni.balanceOf(signer.address))
    console.log("Owner WETH Balance", await wethContract.balanceOf(owner.address))
    console.log("Liquidity Tokens Before", await uni.totalLiquidityTokens());

    //transfer some HAHA Tokens to contract address to provide liquidity
    await uni.transfer(uni.address, ethers.BigNumber.from(1000000).mul(decimals), { from: owner.address });

    //transfer some WETH to contract owner from Whale
    await wethContract.transfer(owner.address, ethers.BigNumber.from(1000).mul(decimals), { from: signer.address });
//================ADDING LIQUIDITY=====================//

  //   //approving the contract to spend the tokens
   await uni.approve(uni.address, 500000000000000, { from: owner.address });
   //approving the WETH contract to spend tokens
   await wethContract.connect(owner).approve(uni.address, 500000000000000);
    

    console.log('WETH that I have ' + await wethContractSigner.balanceOf(owner.address));

    //adding liquidity from Owner's address
    let tx = await uni.addLiquidityTokens(
      uni.address,
      wethContractSigner.address,
      500000000000000,
      500000000000000,
      {
        from: owner.address,
      }
    );


    const txLog = await tx.wait();
    console.log("LIQUIDITY ADDEDDD");
    

  //=====================================


  

   await uni.transfer(signer.address, ethers.BigNumber.from(100000000).mul(decimals), { from: owner.address });
   console.log("Liquidity Tokens after transfer 1", await uni.totalLiquidityTokens());
   await uni.transfer(acc1.address, ethers.BigNumber.from(100000000).mul(decimals), { from: owner.address });
   console.log("Liquidity Tokens after transfer 2", await uni.totalLiquidityTokens());
   await uni.transfer(acc2.address, ethers.BigNumber.from(100000000).mul(decimals), { from: owner.address });
   console.log("Liquidity Tokens after transfer 3", await uni.totalLiquidityTokens());
  //  await uni.transfer(acc3.address, ethers.BigNumber.from(10000000).mul(decimals), { from: owner.address });
  //  console.log("Liquidity Tokens after transfer 4", await uni.totalLiquidityTokens());

   console.log("after Transfer uniswap pair balance", await uni.balanceOf(ROUTER))
   console.log("After transfer whale HAHA Balance", await uni.balanceOf(signer.address))
   console.log("After transfer Owner HAHA Balance", await uni.balanceOf(owner.address))
   console.log("After transfer Owner WETH Balance", await wethContract.balanceOf(owner.address))


  })

  // it('get token pair', async function (){
  //   const Uni = await ethers.getContractFactory('UniswapTest');
  //   const uni = await Uni.deploy();
  //   await uni.deployed();
  // })
});
