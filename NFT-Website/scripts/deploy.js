const main = async () =>{
    const contractFactory = await hre.ethers.getContractFactory("myNFT");
    const NFTContract = await contractFactory.deploy();
    await NFTContract.deployed();

    console.log("Contract Deployed to", NFTContract.address)


    let tnx = await NFTContract.makeNFT();
    await tnx.wait();
    console.log("Minted NFT #1")

    tnx = await NFTContract.makeNFT();
    await tnx.wait();
    console.log("Minted NFT #2")

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