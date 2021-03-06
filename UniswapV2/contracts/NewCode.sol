// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//ISSUES: Suppose if Uniswap's provides 1000 tokens for 1 eth and 
//the mint provides 1000000000 for 1 eth. A person would just mint some tokens and swap it on Uniswap.
//That person won't be able to drain due to price impact but still it would have a drastic impact on the price 
//of a token

//ABOVE ISSUE SLIGHTLY SOLVED
//Added swap and liquify function in during minting also, so that 10% goes to the liquidity pool
//NEED TO AUDIT THIS CONTRACT WITH AN EXPERT AND SEE IF THIS WILL WORK OR NOT

contract HAHA is ERC20, Ownable {
    IUniswapV2Router02 public immutable uniswapV2Router;
    address public immutable uniswapV2Pair;

    // address private constant FACTORY =
    //     0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private constant ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private constant WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab; //0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;--mainnet

    uint256 public constant tokenPrice = 0.00001 ether;
    uint256 public maxSupply = 1000000000000000 * 10**18; //1 Quadtrillion

    //Both the below variables will be set back to 0 once the respective functions are executed.
    uint256 public totalRewardTokens;
    //this is used to minus to keep track of the tokens currently
    uint256 public claimableRewardTokens;
    //A constant token amount
    uint256 public monthlyRewardTokens;

    uint256 public totalLiquidityTokens;

    uint256 public monthlyTimeStamp;

    mapping(address => bool) public excludedFromTax;

    mapping(address => uint256) public lastClaimTime;
    //(address => uint256) public lastClaimedTokens;

    uint256 public minTokensRequiredToAddLiquidity = 10000 * 10**18;


    constructor() ERC20("Haha Token", "HAHA") {
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(
            0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
        );
        // Create a uniswap pair for this new token
        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), WETH);

        uniswapV2Router = _uniswapV2Router;
        monthlyTimeStamp = block.timestamp;
        excludedFromTax[msg.sender] = true;
        excludedFromTax[ROUTER] = true;
        excludedFromTax[address(this)] = true;
        _mint(msg.sender, 10000000000000000000000000);
    }

    event Log(string message, uint256 val);

    function setMinTokensRequiredToAddLiquidity(uint256 _amount)
        public
        onlyOwner
    {
        minTokensRequiredToAddLiquidity = _amount;
    }

//When you mint 10% goes back to the liquidity pool
    function mint(uint256 amount) public payable {
        uint256 _requiredAmount = tokenPrice * amount;
        require(msg.value >= _requiredAmount, "Ether sent is incorrect");
        uint256 amountWithDecimals = amount * 10**18;
        uint256 taxFee = (amountWithDecimals / 100) * 10; //Calculates Tax
        totalLiquidityTokens = totalLiquidityTokens + taxFee; //Total Liquidity
        uint256 finalAmount = amountWithDecimals - taxFee;
        require(
            (totalSupply() + amountWithDecimals) <= maxSupply,
            "Exceeds the max total supply available."
        );
        _mint(address(this), taxFee);
        _mint(msg.sender, finalAmount);
        if (totalLiquidityTokens >= minTokensRequiredToAddLiquidity) {
                swapAndLiquify();
        }
    }

    // function getTaxFee(uint256 _amount) private{

    // }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        if (excludedFromTax[msg.sender]) {
            _transfer(msg.sender, to, amount);
            return true;
        } else {
            if (totalLiquidityTokens >= minTokensRequiredToAddLiquidity) {
                swapAndLiquify();
            }
            uint256 taxFee = (amount / 100) * 10; //Calculates Tax
            uint256 liquidityTokens = taxFee / 2; //Calculates liquidity
            totalLiquidityTokens = totalLiquidityTokens + liquidityTokens; //Total Liquidity
            totalRewardTokens = totalRewardTokens + (taxFee - liquidityTokens); //Total Rewards
            if (block.timestamp >= monthlyTimeStamp + 2629743) {
                monthlyRewardTokens = claimableRewardTokens + totalRewardTokens;
                claimableRewardTokens = monthlyRewardTokens;
                totalRewardTokens = 0;
                monthlyTimeStamp = block.timestamp;
            }
            uint256 finalAmountForTransfer = amount - taxFee;
            _transfer(msg.sender, to, finalAmountForTransfer);
            _transfer(msg.sender, address(this), taxFee);
            return true;
        }
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        if (excludedFromTax[msg.sender]) {
            _spendAllowance(from, msg.sender, amount);
            _transfer(from, to, amount);
            return true;
        } else {
            if (totalLiquidityTokens >= minTokensRequiredToAddLiquidity) {
                swapAndLiquify();
            }
            uint256 taxFee = (amount / 100) * 10; //Calculates Tax
            uint256 liquidityTokens = taxFee / 2; //Calculates liquidity
            totalLiquidityTokens = totalLiquidityTokens + liquidityTokens; //Total Liquidity
            totalRewardTokens = totalRewardTokens + (taxFee - liquidityTokens); //Total Rewards
            if (block.timestamp >= monthlyTimeStamp + 2629743) {
                monthlyRewardTokens = claimableRewardTokens + totalRewardTokens;
                claimableRewardTokens = monthlyRewardTokens;
                totalRewardTokens = 0;
                monthlyTimeStamp = block.timestamp;
            }
            uint256 finalAmountForTransfer = amount - taxFee;
            _spendAllowance(from, msg.sender, finalAmountForTransfer);
            _transfer(from, to, finalAmountForTransfer);
            _spendAllowance(from, address(this), taxFee);
            _transfer(from, address(this), taxFee);
            return true;
        }
    }


    function swapAndLiquify() private {
        //if totalLiquidityTokens is 100
        uint256 firstHalf = totalLiquidityTokens / 2; //50
        uint256 secondHalf = totalLiquidityTokens - firstHalf; //50

        // Swap the firstHalf to ETH or BSC
        uint256 initialBalance = address(this).balance;
        swapTokensForEth(firstHalf);
        //Then call addLiquidity function with equal amount of both tokens
        // how much ETH did we just swap into?
        uint256 newBalance = address(this).balance - (initialBalance);

        // add liquidity to uniswap
        addLiquidity(secondHalf, newBalance);
        totalLiquidityTokens = 0;
    }

    function swapTokensForEth(uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();

        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // add the liquidity
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            address(this),//contract's address so that liquidity will be locked forever
            block.timestamp
        );
    }

    function showYourClaimableShare() public view returns (uint256) {
        uint256 yourTotalShare = ((balanceOf(msg.sender) * 1000000000000000000) /
            totalSupply());
        uint256 yourTokens = (yourTotalShare * monthlyRewardTokens) /
            1000000000000000000;
        return yourTokens;
    }

    function claimTokens() public {
        require(monthlyRewardTokens > 0, "The Reward Wallet is Empty");
        require(
            balanceOf(address(this)) != 0,
            "Rewards Wallet is Empty please try again later"
        );
        require(
            lastClaimTime[msg.sender] == 0 ||
                (lastClaimTime[msg.sender] <= monthlyTimeStamp),
            "You have already claimed the tokens once in the past 30 days"
        );
        //totalRewardTokens = balanceOf(address(this)) - totalLiquidityTokens;
        lastClaimTime[msg.sender] = block.timestamp;
        uint256 yourTotalShare = ((balanceOf(msg.sender) * 1000000000000000000) /
            totalSupply());
        uint256 yourTokens = (yourTotalShare * monthlyRewardTokens) /
            1000000000000000000;
        require(
            claimableRewardTokens >= yourTokens,
            "There isn't enough tokens to claim"
        );
        require(
            yourTokens > 100 * 10**18,
            "You must have atleast 100 Tokens to Claim your Reward!"
        );
        //lastClaimedTokens[msg.sender] = yourTotalShare;
        _transfer(address(this), msg.sender, yourTokens);
        claimableRewardTokens = claimableRewardTokens - yourTokens;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {}

    //================FOR TESTING PURPOSES ONLYYY==============================//

    function addLiquidityTokens(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external onlyOwner{

        approve(address(this), _amountA);
        // IERC20(_tokenB).approve(address(this), _amountB);

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

    function getReservesForToken() public pure returns (uint256) {
        uint256 a = IUniswapV2Router02(
            0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
        ).quote(100, 1000000, 1000000);
        return a;

        //Newly added
        // IERC20(address(this)).approve(ROUTER, tokenAmount);
        // IERC20(uniswapV2Router.WETH()).approve(ROUTER, ethAmount);
    }
}
