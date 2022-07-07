const { isCommunityResourcable } = require('@ethersproject/providers');
const BN = require('bn.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');

const IERC20_SOURCE = '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20';
const WETH_WHALE = '0x1c11ba15939e1c16ec7ca1678df6160ea2063bc5';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

describe('Token contract', function () {
  let wethContract;
  let Uni;
  let uni;
  let owner;
  let acc1;
  let acc2;
  let acc3;
  let whaleSigner;
  const decimals = ethers.BigNumber.from(10).pow(18);
  let hahaTokens;
  let wethTokens;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Uni = await ethers.getContractFactory('HAHA');
    uni = await Uni.deploy();
    await uni.deployed();
    [owner, acc1, acc2, acc3] = await ethers.getSigners();

    //send ether to contract
    await owner.sendTransaction({
      to: uni.address,
      value: ethers.utils.parseEther('1.0'), // Sends exactly 1.0 ether
      gasLimit: 300000,
    });

    //impersonate a whale
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [WETH_WHALE],
    });

    //get signer of whale
    whaleSigner = await ethers.provider.getSigner(WETH_WHALE);
    whaleSigner.address = whaleSigner._address;

    //get the weth contract
    wethContract = await hre.ethers.getContractAt(
      IERC20_SOURCE,
      WETH_ADDRESS,
      whaleSigner
    );
    wethContractSigner = wethContract.connect(whaleSigner);

    // await uni.transfer(
    //   uni.address,
    //   ethers.BigNumber.from(1000000).mul(decimals),
    //   { from: owner.address }
    // );
    hahaTokens = ethers.BigNumber.from(100000).mul(decimals);
    wethTokens = ethers.BigNumber.from(100).mul(decimals);

    //transfer some WETH to contract owner from Whale to provide liquidity
    await wethContract.transfer(owner.address, wethTokens, {
      from: whaleSigner.address,
    });
    //================ADDING LIQUIDITY=====================//

    //approving the contract to spend the tokens
    await uni.approve(uni.address, hahaTokens, { from: owner.address });
    //approving the WETH contract to spend tokens
    await wethContract.connect(owner).approve(uni.address, wethTokens);

    //adding liquidity from Owner's address
    let tx = await uni.addLiquidityTokens(
      uni.address,
      wethContractSigner.address,
      hahaTokens,
      wethTokens,
      {
        from: owner.address,
      }
    );

    await tx.wait();
  });

  it('A Uniswap token Pair is created', async function () {
    expect(await uni.uniswapV2Pair()).to.not.equal(
      ethers.constants.AddressZero
    );
  });

  it('Transfer tokens between accounts', async function () {
    await uni.transfer(
      acc1.address,
      ethers.BigNumber.from(1000000).mul(decimals),
      { from: owner.address }
    );

    let receivedTokens = ethers.BigNumber.from(900000).mul(decimals);

    expect(await uni.balanceOf(acc1.address)).to.equal(receivedTokens);
  });

  it('Each Transfer will take 10% tax and updates Liquidity and rewards variables', async function () {
    await uni.transfer(
      acc1.address,
      ethers.BigNumber.from(1000000).mul(decimals),
      { from: owner.address }
    );

    expect(await uni.totalLiquidityTokens()).to.equal(
      ethers.BigNumber.from(50000).mul(decimals)
    );
    expect(await uni.totalRewardTokens()).to.equal(
      ethers.BigNumber.from(50000).mul(decimals)
    );
  });

  it('Check if Liquidity is added if it reaches minimum amount', async function () {
    console.log('My Contract Balance', await uni.balanceOf(uni.address));
    console.log(await uni.totalLiquidityTokens());

    await uni.transfer(
      acc1.address,
      ethers.BigNumber.from(1000000).mul(decimals),
      { from: owner.address }
    );

    // expect(await uni.totalLiquidityTokens()).to.equal(
    //   ethers.BigNumber.from(50000).mul(decimals)
    // );
    console.log('My Contract Balance', await uni.balanceOf(uni.address));
    console.log(await uni.totalLiquidityTokens());

    await uni.transfer(
      acc2.address,
      ethers.BigNumber.from(1000000).mul(decimals),
      { from: owner.address }
    );
    console.log(await uni.totalLiquidityTokens());

    console.log('My Contract Balance', await uni.balanceOf(uni.address));
    await uni.transfer(acc3.address, ethers.BigNumber.from(20).mul(decimals), {
      from: owner.address,
    });
    console.log(await uni.totalLiquidityTokens());

    expect(await uni.totalLiquidityTokens()).to.equal(
      ethers.BigNumber.from(1).mul(decimals)
    );
  });

  it('Claim your reward', async function () {
    await uni.transfer(
      acc1.address,
      ethers.BigNumber.from(100000000000).mul(decimals),
      { from: owner.address }
    );

    await uni.transfer(
      acc2.address,
      ethers.BigNumber.from(100000000000).mul(decimals),
      { from: owner.address }
    );

    console.log(await uni.balanceOf(owner.address));
    const tx = await uni.claimTokens();
    await tx.wait();
    console.log('After Claiming - ', await uni.balanceOf(owner.address));

    console.log('Before Balance', await uni.balanceOf(acc1.address));
    console.log(
      'claimable rewarsdstotal',
      await uni.connect(acc1).claimableRewardTokens()
    );
    // const txz = await uni.connect(acc1).showYourClaimableShare();
    const txz = await uni.connect(acc1).claimTokens();
    await txz.wait();
    // console.log(txz);
    console.log('After Claiming - ', await uni.balanceOf(acc1.address));
  });

  // it('create liquidity', async function () {
  //   console.log(
  //     'Whale WETH balance',
  //     await wethContractSigner.balanceOf(whaleSigner.address)
  //   );
  //   console.log('whale HAHA Balance', await uni.balanceOf(whaleSigner.address));
  //   console.log(
  //     'Owner WETH Balance',
  //     await wethContract.balanceOf(owner.address)
  //   );
  //   console.log('Liquidity Tokens Before', await uni.totalLiquidityTokens());

  //   //=====================================

  //   await uni.transfer(
  //     whaleSigner.address,
  //     ethers.BigNumber.from(100000000).mul(decimals),
  //     { from: owner.address }
  //   );
  //   console.log(
  //     'Liquidity Tokens after transfer 1',
  //     await uni.totalLiquidityTokens()
  //   );
  //   await uni.transfer(
  //     acc1.address,
  //     ethers.BigNumber.from(100000000).mul(decimals),
  //     { from: owner.address }
  //   );
  //   console.log(
  //     'Liquidity Tokens after transfer 2',
  //     await uni.totalLiquidityTokens()
  //   );
  //   await uni.transfer(
  //     acc2.address,
  //     ethers.BigNumber.from(100000000).mul(decimals),
  //     { from: owner.address }
  //   );
  //   console.log(
  //     'Liquidity Tokens after transfer 3',
  //     await uni.totalLiquidityTokens()
  //   );
  //   //  await uni.transfer(acc3.address, ethers.BigNumber.from(10000000).mul(decimals), { from: owner.address });
  //   //  console.log("Liquidity Tokens after transfer 4", await uni.totalLiquidityTokens());

  //   console.log(
  //     'after Transfer uniswap pair balance',
  //     await uni.balanceOf(ROUTER)
  //   );
  //   console.log(
  //     'After transfer whale HAHA Balance',
  //     await uni.balanceOf(whaleSigner.address)
  //   );
  //   console.log(
  //     'After transfer Owner HAHA Balance',
  //     await uni.balanceOf(owner.address)
  //   );
  //   console.log(
  //     'After transfer Owner WETH Balance',
  //     await wethContract.balanceOf(owner.address)
  //   );
  // });
});
