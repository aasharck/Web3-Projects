const hre = require("hardhat");
const IERC20_SOURCE = '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20';

async function main() {
   [owner] = await ethers.getSigners();
   console.log(`Owner: ${owner.address}`);
  const contractName = 'Arb';
  await hre.run("compile");
  const smartContract = await hre.ethers.getContractFactory(contractName);
  const contract = await smartContract.deploy();
  await contract.deployed();
  console.log(`${contractName} deployed to: ${contract.address}`); 
  console.log('Put the above contract address into the .env file under arbContract');
  await getMoney(contract, owner); 
  

  console.log("Contract Funded!!")

}

async function getMoney(contract,owner){

const WETH_ADDRESS = "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB";
const WNEAR_ADDRESS = "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d";
const USDT_ADDRESS = "0x4988a896b1227218e4A686fdE5EabdcAbd91571f";
const AURORA_ADDRESS = "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79";
const ATUST_ADDRESS = "0x5ce9F0B6AFb36135b5ddBF11705cEB65E634A9dC";
const USDC_ADDRESS = "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802";

const WETH_WHALE = "0xE9fA3E615e109e323106E830e4933ecdE684Da50"
const WNEAR_WHALE = "0xC84E29955D4Fc6e71189558529E3d66fDC2402F6";
const USDT_WHALE = "0x0B5305f909B57F483e0b2c9614CC625943c4bc9a";
const AURORA_WHALE = "0x0c406517c7B2f86d5935fB0a78511b7498B94413";
const ATUST_WHALE = "0x0036D4b2C5C499eD80ddd8920a6DAec21bbc67Cc";
const USDC_WHALE = "0xF082280e30Cf09eC24C1727757715035C63Ab88D";
 
console.log("impersonating Whale...")
//impersonate a whale
await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [WETH_WHALE],
  });

  //impersonate a whale
await hre.network.provider.request({
  method: 'hardhat_impersonateAccount',
  params: [WNEAR_WHALE],
});

//impersonate a whale
await hre.network.provider.request({
  method: 'hardhat_impersonateAccount',
  params: [USDT_WHALE],
});

//impersonate a whale
await hre.network.provider.request({
  method: 'hardhat_impersonateAccount',
  params: [AURORA_WHALE],
});

//impersonate a whale
await hre.network.provider.request({
  method: 'hardhat_impersonateAccount',
  params: [ATUST_WHALE],
});

//impersonate a whale
await hre.network.provider.request({
  method: 'hardhat_impersonateAccount',
  params: [USDC_WHALE],
});

console.log("getting signers")
  //get signer of whale
  let whaleSigner = await ethers.provider.getSigner(WETH_WHALE);
  let whaleSigner1 = await ethers.provider.getSigner(WNEAR_WHALE);
  let whaleSigner2 = await ethers.provider.getSigner(USDT_WHALE);
  let whaleSigner3 = await ethers.provider.getSigner(AURORA_WHALE);
  let whaleSigner4 = await ethers.provider.getSigner(ATUST_WHALE);
  let whaleSigner5 = await ethers.provider.getSigner(USDC_WHALE);

  console.log("getting the contracts....")
  //get contracts
  let wethContract = await hre.ethers.getContractAt(
    IERC20_SOURCE,
    WETH_ADDRESS,
    whaleSigner
  );

  let wnearContract = await hre.ethers.getContractAt(
    IERC20_SOURCE,
    WNEAR_ADDRESS,
    whaleSigner1
  );
  let usdtContract = await hre.ethers.getContractAt(
    IERC20_SOURCE,
    USDT_ADDRESS,
    whaleSigner2
  );
  let auroraContract = await hre.ethers.getContractAt(
    IERC20_SOURCE,
    AURORA_ADDRESS,
    whaleSigner3
  );
  let atustContract = await hre.ethers.getContractAt(
    IERC20_SOURCE,
    ATUST_ADDRESS,
    whaleSigner4
  );
  let usdcContract = await hre.ethers.getContractAt(
    IERC20_SOURCE,
    USDC_ADDRESS,
    whaleSigner5
  );
  console.log("Calculating amount")

  let wethAmount = ethers.BigNumber.from(20).mul(18);
  let amount = ethers.BigNumber.from(600).mul(18);
  let amount2 = ethers.BigNumber.from(600).mul(6);

  console.log("balance ==> ", await wethContract.balanceOf(whaleSigner._address))
  console.log("Transfering ....")
  await wethContract.transfer(contract.address, wethAmount,{
    from: whaleSigner._address,
  });
  console.log("Transfered weth")
  await wnearContract.transfer(contract.address, amount, {
    from: whaleSigner1._address,
  });
  console.log("Transfered wnear")

  await usdtContract.transfer(contract.address, amount2, {
    from: whaleSigner2._address,
  });
  console.log("USDT")
  await auroraContract.transfer(contract.address, amount, {
    from: whaleSigner3._address,
  });
  console.log("AUROR")
  await atustContract.transfer(contract.address, amount, {
    from: whaleSigner4._address,
  });
  console.log("ATUS")

  await usdcContract.transfer(contract.address, amount2, {
    from: whaleSigner5._address,
  });

  console.log("all Transfered")
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });