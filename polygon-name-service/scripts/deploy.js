const hre = require("hardhat");

async function main() {

  const Domains = await hre.ethers.getContractFactory("Domains");
  const domains = await Domains.deploy();

  await domains.deployed();

  console.log(
    `Contract deployed to ${domains.address}`
  );

  const tx = await domains.register("ash");
  await tx.wait();

  const own = await domains.getAddress("ash")
  console.log("owner of this domain is ", own);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
