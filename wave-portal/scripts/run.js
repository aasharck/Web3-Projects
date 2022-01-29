const main = async () => {
  const [owner, randomAccount, anotherAccount] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
      value: hre.ethers.utils.parseEther("1")
  });
  await waveContract.deployed();

  console.log("Contract Deployed to: ", waveContract.address);
  console.log("Contract Deployed by: ", owner.address);

  let balanceContract = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Balance in Contract: ", hre.ethers.utils.formatEther(balanceContract))

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.connect(randomAccount).wave("Hello How are you");
  await waveTxn.wait();

  let waveTxn2 = await waveContract.connect(randomAccount).wave("My Second Wave");
  await waveTxn2.wait();

  waveTxn = await waveContract.connect(anotherAccount).wave("Heyyyy!");
  await waveTxn.wait();

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves)

  waveCount = await waveContract.getTotalWaves();

  balanceContract = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Balance in Contract: ", hre.ethers.utils.formatEther(balanceContract))

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

