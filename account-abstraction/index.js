const ethers = require('ethers');
const userop = require('userop');
const { Client, Presets } = userop;
require("dotenv").config()

const privateKey = process.env.OWNER_PRIVATE_KEY
const bundlerRpcUrl = process.env.BUNDLER_RPC

const main = async () => {
    // some proble with provider
    // let network = 'mumbai'
    // const mumbai = {
    //     name: 'mumbai',
    //     chainId: 80001,
    //     _defaultProvider: (providers) => new providers.JsonRpcProvider('https://rpc-mumbai.matic.today')
    // }
    // const provider = ethers.getDefaultProvider(mumbai)
    const owner = new ethers.Wallet(privateKey);

    const entryPointAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
    const factoryAddress = '0x9406Cc6185a346906296840746125a0E44976454';

    const smartAccount = await Presets.Builder.SimpleAccount.init(
        owner,
        bundlerRpcUrl,
        entryPointAddress,
        factoryAddress,
    );
    const smartAccountAddress = smartAccount.getSender();
    console.log('Smart account address is', smartAccountAddress);

    // await owner.sendTransaction(
    //     {
    //         from: owner,
    //         to: smartAccountAddress,
    //         value: ethers.utils.parseEther("0.2"),
    //         gasLimit: ethers.utils.parseUnits('5000', 'gwei'),
    //         maxPriorityFeePerGas: ethers.utils.parseUnits('50', 'gwei')
    //     }
    // )
    
    // console.log("smart wallet funded with", await provider.getBalance(smartAccountAddress));

    const client = await Client.init(bundlerRpcUrl, entryPointAddress);
    const result = await client.sendUserOperation(
        smartAccount.execute(smartAccountAddress, 0, "0x"),
    );
    const event = await result.wait();
    console.log(`Transaction hash: ${event?.transactionHash}`);
}

main().catch(console.error);