// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");

const PROXY = "0xb5627b785D22aE8FFD4EA3A986BD988dBA3184d2"

async function main() {

  const Box = await ethers.getContractFactory("BoxV2");
  const box = await upgrades.upgradeProxy(PROXY, Box);

  console.log(
    "Box Upgraded"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
