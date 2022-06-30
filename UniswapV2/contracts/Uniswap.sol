//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract UniswapTest is ERC20, Ownable {
    IUniswapV2Router02 public immutable uniswapV2Router;
    address public immutable uniswapV2Pair;

    // address private constant FACTORY =
    //     0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private constant ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    uint256 public constant tokenPrice = 0.0001 ether;
    uint256 public constant maxTotalSupply = 200000000 * 10**18;


//Both the below variables will be set back to 0 once the respective functions are executed.
    uint256 public totalRewardTokens;
    uint256 public totalLiquidityTokens;

    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public lastClaimedTokens;

    uint256 public minTokensRequiredToAddLiquidity = 5000;
    //to incentivise the one who executes the swapAndLiquify function
    address[] private liquidtyExecutioner;



    constructor() ERC20("Test Coin", "TESTCOIN") {
        
        _mint(msg.sender, 5000000000000000);
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(
            0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
        );
        // Create a uniswap pair for this new token
        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), WETH);

        uniswapV2Router = _uniswapV2Router;
    }

    event Log(string message, uint256 val);

    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external {
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

        IERC20(_tokenA).approve(ROUTER, _amountA);
        IERC20(_tokenB).approve(ROUTER, _amountB);

        (uint256 amountA, uint256 amountB, uint256 liquidity) = uniswapV2Router
            .addLiquidity(
                _tokenA,
                _tokenB,
                _amountA,
                _amountB,
                1,
                1,
                address(this),
                block.timestamp
            );

        emit Log("amountA", amountA);
        emit Log("amountB", amountB);
        emit Log("liquidity", liquidity);
    }

    function removeLiquidity(address _tokenA, address _tokenB) external {
        address pair = uniswapV2Pair;

        uint256 liquidity = IERC20(pair).balanceOf(address(this));
        IERC20(pair).approve(ROUTER, liquidity);

        (uint256 amountA, uint256 amountB) = uniswapV2Router.removeLiquidity(
            _tokenA,
            _tokenB,
            liquidity,
            1,
            1,
            address(this),
            block.timestamp
        );

        emit Log("amountA", amountA);
        emit Log("amountB", amountB);
    }

    function mint(uint256 amount) public payable {
        uint256 _requiredAmount = tokenPrice * amount;
        require(msg.value >= _requiredAmount, "Ether sent is incorrect");
        uint256 amountWithDecimals = amount * 10**18;
        require(
            (totalSupply() + amountWithDecimals) <= maxTotalSupply,
            "Exceeds the max total supply available."
        );
        _mint(msg.sender, amountWithDecimals);
    }


function transfer(address to, uint256 amount) public override returns (bool) {
        if(totalLiquidityTokens >= minTokensRequiredToAddLiquidity){
            swapAndLiquify();
            liquidtyExecutioner.push(msg.sender);
        }
        uint256 taxFee = (amount / 100) * 10; //Calculates Tax
        uint256 liquidityTokens = taxFee/2; //Calculates liquidity
        totalLiquidityTokens = totalLiquidityTokens + liquidityTokens; //Total Liquidity
        totalRewardTokens = totalRewardTokens + (taxFee - liquidityTokens); //Total Rewards
        uint256 finalAmountForTransfer = amount - taxFee;
        _transfer(msg.sender, to, finalAmountForTransfer);
        _transfer(msg.sender, address(this), taxFee);
        return true;
    }

    function swapAndLiquify() public{
        //if totalLiquidityTokens is 100
        uint256 firstHalf = totalLiquidityTokens/2; //50
        uint256 secondHalf = totalLiquidityTokens - firstHalf; //50
        totalLiquidityTokens = 0;
        // Swap the firstHalf to ETH or BSC

        //Then call addLiquidity function with equal amount of both tokens

        
    }
    

    function claimTokens() public{
        require(balanceOf(address(this)) != 0, "Rewards Wallet is Empty please try again later");
        require(lastClaimTime[msg.sender]+30 >= block.timestamp, "You have already claimed the tokens once in the past 30 days");
        totalRewardTokens = balanceOf(address(this)) - totalLiquidityTokens;
        lastClaimTime[msg.sender] = block.timestamp;
        uint256 yourTotalShare = (totalRewardTokens/totalSupply() * 100);
        if(yourTotalShare <= balanceOf(address(this))){
            yourTotalShare = balanceOf(address(this));
        }
        lastClaimedTokens[msg.sender] = yourTotalShare;
        transferFrom(address(this), msg.sender, yourTotalShare);
    }



    // function transferFrom(
    //     address from,
    //     address to,
    //     uint256 amount
    // ) public override returns (bool) {
    //     address spender = _msgSender();
    //     uint256 amountForBurn = (amount / 100) * 2;
    //     _burn(from, amountForBurn);
    //     uint256 finalAmountForTransfer = amount - amountForBurn;
    //     _spendAllowance(from, spender, finalAmountForTransfer);
    //     _transfer(from, to, finalAmountForTransfer);
    //     return true;
    // }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {}
}
