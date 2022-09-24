const { default: axios } = require("axios");
const { ethers } = require("hardhat");

const IERC20_SOURCE = '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20';

describe('Attack Tests',() => {
  let defi;
  let owner;
  let attacker;
  let someone;
  let wethContract;
  let tokContract;
  let arbitrage;
  let compTokens;
  let whaleSigner;
  const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  const WMATIC_ADDRESS = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
  const COMP_ADDRESS = '0xc00e94Cb662C3520282E6f5717214004A7f26888'
  const TOK_ADDRESS = '0x3Cef98bb43d732E2F285eE605a8158cDE967D219';
  let COMP_WHALE = "0xfbe18f066F9583dAc19C88444BC2005c99881E56"
  beforeEach(async () => {
    [owner, attacker, someone] = await ethers.getSigners();
    console.log("MATIC balance before deploying", (await ethers.provider.getBalance(owner.address))/10**18)
    const Arbitrage = await ethers.getContractFactory("Arbitrage");


    arbitrage = await Arbitrage.deploy();
    await arbitrage.deployed();
    console.log("MATIC balance after deploying", (await ethers.provider.getBalance(owner.address))/10**18)

    tokContract = await hre.ethers.getContractAt(
      IERC20_SOURCE,
      TOK_ADDRESS
    );

    

  })

  //0x1796ae0b0fa4862485106a0de9b654eFE301D0b2
  //0x9C78EE466D6Cb57A4d01Fd887D2b5dFb2D46288f
  it.skip("Show rate on both Uniswap and Sushiswap", async () => {

    let res = await axios.get("https://token-list.sushi.com/");
    console.log(res.data.tokens.length)
    for(let i=698; i<res.data.tokens.length; i++){
        console.log("=========")
        console.log(i)
        let tokAddress = res.data.tokens[i].address
        console.log(tokAddress)
        try {
            let sushiRate = await arbitrage.getRateSushi(tokAddress)
            console.log("Sushiswap : 1 MATIC = " + "" + (sushiRate)/10**18 + " " + res.data.tokens[i].name);
            let quickRate = await arbitrage.getRateUni(tokAddress)
            console.log("Quickswap : 1 MATIC = " +  "" + (quickRate)/10**18 + " " + res.data.tokens[i].name);
        } catch (error) {
            continue;
        }
        
        // 
        
    }
    

    //sending 0.2 eth to contract
    // await owner.sendTransaction({
    //     to: arbitrage.address,
    //     value: ethers.utils.parseEther('0.21'), 
    //     gasLimit: 300000,
    //   });
    //Buy TOK from Sushi first for 0.2 eth
    

  })

  it.skip("Get rate",async () => {
    let amt = ethers.utils.parseEther('10.0')
    let sushiRate = await arbitrage.getRateSushi(TOK_ADDRESS, amt)
    console.log("Sushiswap : " + amt/10**18 + " MATIC = ", (sushiRate)/10**18);
    let uniRate = await arbitrage.getRateUni(TOK_ADDRESS, amt)
    console.log("Quickswap : " + amt/10**18 + " MATIC = ", (uniRate)/10**18);

  })

  //GOOD ONES
  //1. 0x16ECCfDbb4eE1A85A33f3A9B21175Cd7Ae753dB4 - Router Protocol
  //2. 0x0B048D6e01a6b9002C291060bF2179938fd8264c ---
  //3. 0xEE800B277A96B0f490a1A732e1D6395FAD960A26 
  //4. 0x34d4ab47Bee066F361fA52d792e69AC7bD05ee23 ---
  //5.
  //6.
  //7.
  //8.
  //9.
  //10.

  it.skip("Attack", async () => {
    let tokAddress = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
    let sushiRate = await arbitrage.getRateSushi(tokAddress)
    console.log("Sushiswap : 1 MATIC = ", (sushiRate)/10**18);
    console.log("Quickswap : 1 MATIC = ", (await arbitrage.getRateUni(tokAddress))/10**18);

    console.log("MATIC balance before Arbitrage", (await ethers.provider.getBalance(owner.address))/10**18)
    console.log("TOK BEFORE, balance is ", (await tokContract.balanceOf(owner.address))/10**18)
    console.log("Buying TOK from SUSHI for 5000.0 MATIC")
    let amt = ethers.utils.parseEther('5000.0')
    await arbitrage.sellETHBuyTokUni({value: amt})
    let TokBal = await tokContract.balanceOf(owner.address);
    console.log("TOK bought, balance is ", (TokBal)/10**18)
    console.log("Selling TOK on Uniswap to make profit")
    await tokContract.connect(owner).transfer(arbitrage.address, TokBal);
    await arbitrage.sellTOKBuyETHSushi(TokBal);
    console.log("MATIC balance After Arbitrage", (await ethers.provider.getBalance(owner.address))/10**18)
  })

  it.skip("Attack V2", async () => {
    console.log("MATIC balance before Arbitrage", (await ethers.provider.getBalance(owner.address))/10**18)
    let amt = ethers.utils.parseEther('10.0')
    // let sushiRate = await arbitrage.getRateSushi(TOK_ADDRESS, amt)
    let uniRate = await arbitrage.getRateUni(TOK_ADDRESS, amt)
    console.log("Uniswap : " + amt/10**18 + " MATIC = ", (uniRate)/10**18);
    await arbitrage.printMoneyV1({value: amt});
    console.log("MATIC balance After Arbitrage", (await ethers.provider.getBalance(owner.address))/10**18)

  })

  it("Attack V3", async () => {
    console.log("MATIC balance before Arbitrage", (await ethers.provider.getBalance(owner.address))/10**18)
    let amt = ethers.utils.parseEther('10.0')
    // let sushiRate = await arbitrage.getRateSushi(TOK_ADDRESS, amt)
    let sushiRate = await arbitrage.getRateSushi(TOK_ADDRESS, amt)
    console.log("Uniswap : " + amt/10**18 + " MATIC = ", (sushiRate)/10**18);

    await arbitrage.printMoneyV2({value: amt});
    console.log("MATIC balance After Arbitrage", (await ethers.provider.getBalance(owner.address))/10**18)

  })
})