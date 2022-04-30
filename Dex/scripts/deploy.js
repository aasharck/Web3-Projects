const hre = require("hardhat");
require("dotenv").config({ path: ".env" });
const { RINKEBY_SAFEMOON_ADDRESS } = require("../constants");

async function main() {
  const tokenAddress = RINKEBY_SAFEMOON_ADDRESS;

  const Dex = await hre.ethers.getContractFactory("Exchange");
  const deployExchangeContract = await Dex.deploy(tokenAddress);

  await deployExchangeContract.deployed();

  console.log("DEX Deployed to: ", deployExchangeContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
