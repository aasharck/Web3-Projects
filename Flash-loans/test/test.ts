import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SimpleFlashLoan, SimpleFlashLoan__factory } from "../typechain-types";

const IERC20_SOURCE = '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20';

describe("Simple Flash Loan Tutorial", function () {
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;

  const POOL_ADDRESS_PROVIDER = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb";
  const FRAX = '0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89'
  const UST = '0xE6469Ba6D2fD6130788E0eA9C0a0515900563b59'


  it.skip("Borrow some DAI and return back with Aave Flash loan", async () => {
    
    [account1, account2] = await ethers.getSigners();
    const DAI: string = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
    const DAIWhale: string = '0xdfD74E3752c187c4BA899756238C76cbEEfa954B'
    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [DAIWhale],
    });
    const whaleSigner = ethers.provider.getSigner(DAIWhale);
    const DAIContract = await ethers.getContractAt(
      IERC20_SOURCE,
      DAI,
      whaleSigner
    );

    const DAITokens = ethers.BigNumber.from(10000).mul(
      ethers.BigNumber.from(10).pow(18)
    );
    await DAIContract.connect(whaleSigner).transfer(
      account1.address,
      DAITokens
    );

    console.log("Starting Flashloan....")

    const FlashLoanContract: SimpleFlashLoan__factory = await ethers.getContractFactory('SimpleFlashLoan');
    const flashloan: SimpleFlashLoan = await FlashLoanContract.deploy(POOL_ADDRESS_PROVIDER);
    await flashloan.deployed();

    await DAIContract.connect(account1).transfer(
      flashloan.address,
      DAITokens
    );
    console.log("Balance Before FlashLoan => ", (await DAIContract.balanceOf(flashloan.address))/10**18);
    const borrowAmount = ethers.BigNumber.from(1000000).mul(
      ethers.BigNumber.from(10).pow(18)
    );
    const tx = await flashloan.createFlashLoan(DAI, borrowAmount);
    await tx.wait();

    console.log("Balance After FlashLoan => ", (await DAIContract.balanceOf(flashloan.address))/10**18);

  })

  it("Buying some FRAX with UST", async () => {
    const FlashLoanContract: SimpleFlashLoan__factory = await ethers.getContractFactory('SimpleFlashLoan');
    const flashloan: SimpleFlashLoan = await FlashLoanContract.deploy(POOL_ADDRESS_PROVIDER);
    await flashloan.deployed();

    const USTWhale = "0x8e11228A731161c80bD1b16725c875863bDC8a72"
    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [USTWhale],
    });
    const whaleSigner = ethers.provider.getSigner(USTWhale);
    const USTContract = await ethers.getContractAt(
      IERC20_SOURCE,
      UST,
      whaleSigner
    );

    const USTTokens = ethers.BigNumber.from(100000).mul(
      ethers.BigNumber.from(10).pow(6)
    );
    await USTContract.connect(whaleSigner).transfer(
      flashloan.address,
      USTTokens
    );

    console.log("UST in contract", await USTContract.balanceOf(flashloan.address)/10**6);

    const tokensToSend = ethers.BigNumber.from(10000).mul(
      ethers.BigNumber.from(10).pow(6)
    );


    let tx = await flashloan.swapFromCurve(1,0,tokensToSend,0);

    const FraxContract = await ethers.getContractAt(
      IERC20_SOURCE,
      FRAX,
      whaleSigner
    );
    console.log("FRAX Balance in Contract", await FraxContract.balanceOf(flashloan.address)/10**18)
  })
  
});
