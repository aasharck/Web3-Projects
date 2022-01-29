const main = async () => {
  const [owner] = await hre.ethers.getSigners();
  const ownerBalance = await owner.getBalance();

  console.log("Deploying contracts with account: ", owner.address);
  console.log("Account balance: ", ownerBalance.toString());

  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({value: hre.ethers.utils.parseEther("0.01")});
  await waveContract.deployed();

  console.log("Contract Deployed to: ", waveContract.address);

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
