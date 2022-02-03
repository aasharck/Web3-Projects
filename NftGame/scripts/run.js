const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory("NftGame");
  const gameContract = await contractFactory.deploy(
    ["Messi", "Ronaldo", "Haaland"],
    [
      "https://i.imgur.com/LNMYr3K.jpeg",
      "https://i.imgur.com/IijRJcx.jpeg",
      "https://i.imgur.com/HJXqVzW.jpeg",
    ],
    [2000, 1500, 1350],
    [200, 90, 100],
    "Papa Perez",
    "https://i.imgur.com/NfhKbcO.jpeg",
    10000,
    50
  );
  await gameContract.deployed();

  console.log("contract deployed to: ", gameContract.address);

  let txn = await gameContract.mintNFT(0);
  await txn.wait();
  console.log("Minted NFT#1");

  txn = await gameContract.attackBoss();
  await txn.wait();
  txn = await gameContract.attackBoss();
  await txn.wait();
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
