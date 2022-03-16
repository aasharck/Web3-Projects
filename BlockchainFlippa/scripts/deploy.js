const main = async () =>{
    const contractFactory = await hre.ethers.getContractFactory("MyContract");
    const myContract = await contractFactory.deploy();
    await myContract.deployed();

    console.log("Contract Deployed to", myContract.address)

}

const runMain = async () =>{
    try{
        await main();
        process.exit(0);
    }catch(error){
        console.log(error)
        process.exit(1);
    }
}

runMain();