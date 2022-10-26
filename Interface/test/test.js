const { expect } = require('chai');
const { ethers } = require('hardhat');

const IERC20_SOURCE = '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20';

describe('Testing Interface Minting', () => {
  it('minting', async () => {
    let [owner, acc1] = await ethers.getSigners();

    const OtherContract = await ethers.getContractFactory('OtherContract');
    const otherContract = await OtherContract.deploy();
    await otherContract.deployed();

    const NftContract = await ethers.getContractFactory('NFTContract');
    const nftContract = await NftContract.deploy(otherContract.address);
    await nftContract.deployed();

    const USDCWhale = '0xf584F8728B874a6a5c7A8d4d387C9aae9172D621';
    const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [USDCWhale],
    });
    const whaleSigner = ethers.provider.getSigner(USDCWhale);

    const USDCContract = await ethers.getContractAt(
      IERC20_SOURCE,
      USDC,
      whaleSigner
    );

    const USDCTokens = ethers.BigNumber.from(1000).mul(
      ethers.BigNumber.from(10).pow(6)
    );

    //sending USDC to the hardhat accounts
    await USDCContract.connect(whaleSigner).transfer(
      owner.address,
      USDCTokens
    );

    console.log("USDC Tokens for Owner", await USDCContract.balanceOf(owner.address)/10**6)

    //approving
    await USDCContract.connect(owner).approve(otherContract.address, 1000000);

    const tx = await nftContract.connect(owner).safeMint();
    await tx.wait();

    console.log("USDC Tokens for Owner", await USDCContract.balanceOf(owner.address)/10**6)
    console.log("USDC Tokens In OtherContract", await USDCContract.balanceOf(otherContract.address)/10**6)

  });
});
