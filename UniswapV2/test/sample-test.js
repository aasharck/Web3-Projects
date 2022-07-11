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
  let acc4;
  let whaleSigner;
  const decimals = ethers.BigNumber.from(10).pow(18);
  let hahaTokens;
  let wethTokens;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Uni = await ethers.getContractFactory('HAHA');
    uni = await Uni.deploy();
    await uni.deployed();
    [owner, acc1, acc2, acc3, acc4] = await ethers.getSigners();

    let amt = 1000000000;
    let txx = await uni.mint(amt, { value: ethers.utils.parseEther('100.0') });
    await txx.wait();

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
    // await uni.connect(owner).approve(uni.address, hahaTokens);
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

  it('You can mint tokens', async function () {
    let amt = 10000;
    let tx = await uni
      .connect(acc1)
      .mint(amt, { value: ethers.utils.parseEther('1.0') });
    const log = await tx.wait();
    console.log('Gas used for Minting ->', log.gasUsed);

    expect(await uni.balanceOf(acc1.address)).to.equal(
      ethers.BigNumber.from(10000).mul(decimals)
    );
  });

  it('Transfer tokens between accounts', async function () {
    const tx = await uni.transfer(
      acc1.address,
      ethers.BigNumber.from(100000).mul(decimals),
      { from: owner.address }
    );

    const log = await tx.wait();
    console.log('Gas used for Transfering ->', log.gasUsed);

    let receivedTokens = ethers.BigNumber.from(100000).mul(decimals);

    expect(await uni.balanceOf(acc1.address)).to.equal(receivedTokens);
  });

  it('Each Transfer will take 10% tax and updates Liquidity and rewards variables', async function () {
    let amt = 1000000;
    let txx = await uni
      .connect(acc1)
      .mint(amt, { value: ethers.utils.parseEther('100.0') });
    await txx.wait();

    await uni
      .connect(acc1)
      .transfer(acc2.address, ethers.BigNumber.from(100000).mul(decimals));

    let receivedTokens = ethers.BigNumber.from(90000).mul(decimals);

    expect(await uni.balanceOf(acc2.address)).to.equal(receivedTokens);

    expect(await uni.totalLiquidityTokens()).to.equal(
      ethers.BigNumber.from(5000).mul(decimals)
    );
    expect(await uni.totalRewardTokens()).to.equal(
      ethers.BigNumber.from(5000).mul(decimals)
    );
  });

  it('Check if Liquidity is added if it reaches minimum amount', async function () {
    console.log('My Contract Balance', await uni.balanceOf(uni.address));
    console.log(await uni.totalLiquidityTokens());

    let amt = 10000000;
    let txx = await uni
      .connect(acc1)
      .mint(amt, { value: ethers.utils.parseEther('100.0') });
    await txx.wait();

    await uni
      .connect(acc1)
      .transfer(acc2.address, ethers.BigNumber.from(100000).mul(decimals));

    // expect(await uni.totalLiquidityTokens()).to.equal(
    //   ethers.BigNumber.from(50000).mul(decimals)
    // );
    console.log('My Contract Balance', await uni.balanceOf(uni.address));
    console.log("liquidity tokens now", await uni.totalLiquidityTokens());

    console.log("My ETH BALANCE ->", await ethers.provider.getBalance(acc1.address))
    const tx1 = await uni
      .connect(acc1)
      .transfer(acc3.address, ethers.BigNumber.from(100000).mul(decimals));
    console.log(await uni.totalLiquidityTokens());
    console.log("liquidity tokens now", await uni.totalLiquidityTokens());

    const logx = await tx1.wait();
    console.log('Gas used for Transfering alone ->', logx.gasUsed);
    console.log("My ETH BALANCE ->", await ethers.provider.getBalance(acc1.address))

    console.log('My Contract Balance', await uni.balanceOf(uni.address));
  
    const tx = await uni
      .connect(acc1)
      .transfer(acc4.address, ethers.BigNumber.from(20).mul(decimals));

    const log = await tx.wait();
    console.log(
      'Gas used for Transfering and adding liquidity ->',
      log.gasUsed
    );

    console.log("liquidity tokens now", await uni.totalLiquidityTokens());

    expect(await uni.totalLiquidityTokens()).to.equal(
      ethers.BigNumber.from(1).mul(decimals)
    );
  });

  //9798.999346898306191608
  //9798.998979683956977668

  it('Claim your reward', async function () {
    let amt = 100000000;
    let txx = await uni
      .connect(acc1)
      .mint(amt, { value: ethers.utils.parseEther('100.0') });
    await txx.wait();

    await uni
      .connect(acc1)
      .transfer(acc2.address, ethers.BigNumber.from(10000000).mul(decimals));

    await network.provider.send('evm_increaseTime', [2629743]);
    await network.provider.send('evm_mine');

    await uni
      .connect(acc1)
      .transfer(acc3.address, ethers.BigNumber.from(10000000).mul(decimals));

    console.log(await uni.balanceOf(acc1.address));
    const tx = await uni.connect(acc1).claimTokens();
    const log = await tx.wait();
    console.log('Gas used for Claiming Your Rewards ->', log.gasUsed);

    console.log('After Claiming - ', await uni.balanceOf(acc1.address));

    console.log('Before Balance', await uni.balanceOf(acc2.address));
    console.log(
      'claimable rewarsdstotal',
      await uni.connect(acc2).claimableRewardTokens()
    );
    // const txz = await uni.connect(acc1).showYourClaimableShare();
    const txz = await uni.connect(acc2).claimTokens();
    await txz.wait();
    // console.log(txz);
    console.log('After Claiming - ', await uni.balanceOf(acc2.address));
  });

  it('Can only claim tokens once in every 30 days', async function () {
    let amt = 100000000;
    let txx = await uni
      .connect(acc1)
      .mint(amt, { value: ethers.utils.parseEther('100.0') });
    await txx.wait();

    await uni
      .connect(acc1)
      .transfer(acc2.address, ethers.BigNumber.from(10000000).mul(decimals));

    await network.provider.send('evm_increaseTime', [2629743]);
    await network.provider.send('evm_mine');

    await uni
      .connect(acc1)
      .transfer(acc3.address, ethers.BigNumber.from(10000000).mul(decimals));

    const tx = await uni.connect(acc1).claimTokens();
    // await tx.wait();

    await expect(uni.connect(acc1).claimTokens()).to.be.revertedWith(
      'You have already claimed the tokens once in the past 30 days'
    );
  });

  it('Will be able to claim tokens again after 30 days', async function () {
    let amt = 100000000;
    let txx = await uni
      .connect(acc1)
      .mint(amt, { value: ethers.utils.parseEther('100.0') });
    await txx.wait();

    await uni
      .connect(acc1)
      .transfer(acc2.address, ethers.BigNumber.from(10000000).mul(decimals));
    
    await network.provider.send("evm_increaseTime", [2629743])
  await network.provider.send("evm_mine")

    await uni
      .connect(acc1)
      .transfer(acc3.address, ethers.BigNumber.from(10000000).mul(decimals));

    console.log(
      'Before Claiming',
      await uni.connect(acc1).balanceOf(acc1.address)
    );
    const tx = await uni.connect(acc1).claimTokens();
    // await tx.wait();
    console.log(
      'After 1st Claiming',
      await uni.connect(acc1).balanceOf(acc1.address)
    );

    await network.provider.send('evm_increaseTime', [2629743]);
    await network.provider.send('evm_mine');
    await uni
    .connect(acc1)
    .transfer(acc2.address, ethers.BigNumber.from(10000000).mul(decimals));

    await uni.connect(acc1).claimTokens();
    console.log(
      'After 2nd Claiming',
      await uni.connect(acc1).balanceOf(acc1.address)
    );
    // await expect(uni.connect(acc1).claimTokens()).to.be.revertedWith(
    //   'You have already claimed the tokens once in the past 30 days'
    // );
  });

  // it("the Claimable rewards accumulates over time")

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
