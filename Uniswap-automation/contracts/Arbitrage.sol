// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Arbitrage{
    // address private constant sushiROUTER = 0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F; //ETH MAINNET
    address private constant sushiROUTER = 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506; //Sushiswap Polygon
    // address private constant uniROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D; //ETH MAINNET
    address private constant uniROUTER = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff; //Quickswap Polygon
    address private constant COMP = 0xc00e94Cb662C3520282E6f5717214004A7f26888;
    address private constant TOK = 0x3Cef98bb43d732E2F285eE605a8158cDE967D219; 
    address private constant DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063; 

    IUniswapV2Router02 public immutable sushiswapV2Router;
    IUniswapV2Router02 public immutable uniswapV2Router;
    IERC20 public immutable tokContract;

    constructor(){
        sushiswapV2Router = IUniswapV2Router02(sushiROUTER);
        uniswapV2Router = IUniswapV2Router02(uniROUTER);
        tokContract = IERC20(TOK); 
    }

    function getRateUni(address _tok, uint256 _amount) public view returns(uint256){
        address[] memory path = new address[](2);
        path[0] = DAI; //WETH
        path[1] = _tok; //TOK

        uint256[] memory rate = uniswapV2Router.getAmountsOut(_amount, path);
        return rate[1];
    }

    function getRateSushi(address _tok, uint256 _amount) public view returns(uint256){
        address[] memory path = new address[](2);
        path[0] = DAI; //WETH
        path[1] = _tok; //TOK

        uint256[] memory rate = sushiswapV2Router.getAmountsOut(_amount, path);
        return rate[1];
    }

    //buying ETH by Giving TOK on Uniswap
    function sellTOKBuyETHUni(uint256 _amount) public{
        address[] memory path = new address[](2);
        path[0] = TOK; //TOK 
        path[1] = DAI;//WETH

        tokContract.approve(address(uniswapV2Router), _amount);

        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(_amount, 0, path, msg.sender, block.timestamp);
    }

    //buying ETH by Giving TOK on Sushiswap
    function sellTOKBuyETHSushi(uint256 _amount) public{
        address[] memory path = new address[](2);
        path[0] = TOK; //TOK 
        path[1] = DAI;//WETH

        tokContract.approve(address(sushiswapV2Router), _amount);

        sushiswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(_amount, 0, path, msg.sender, block.timestamp);
    }

    //buying TOK by Giving ETH on Uniswap
    function sellETHBuyTokUni() public payable{
        address[] memory path = new address[](2);
        path[0] = DAI;//WETH
        path[1] = TOK; //TOK 

        uniswapV2Router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: msg.value}(0, path, msg.sender, block.timestamp);
    }

    //buying TOK by Giving ETH on Sushiswap
    function sellETHBuyTokSushi() public payable{
        address[] memory path = new address[](2);
        path[0] = DAI;//WETH
        path[1] = TOK; //TOK 

        sushiswapV2Router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: msg.value}(0, path, msg.sender, block.timestamp);
    }

    //Call this if price is higher in sushiswap
    function printMoneyV1() external payable{
        address[] memory path = new address[](2);
        path[0] = DAI;//WETH
        path[1] = TOK; //TOK 
        console.log("MATIC BALANCE in CONTRACT BEFORE BUYING DAI=====> ", address(this).balance);

        console.log("MATIC BALANCE BEFORE BUYING DAI =====> ", msg.sender.balance);

        uniswapV2Router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: msg.value}(0, path, address(this), block.timestamp);
        
        console.log("MATIC BALANCE in CONTRACT AFTER BUYING DAI=====> ", address(this).balance);
        console.log("MATIC BALANCE AFTER BUYING DAI =====> ", msg.sender.balance);

        
        uint256 TokBal = tokContract.balanceOf(address(this));
        console.log("===============================");
        console.log("===============================");
        console.log("===============================");
        console.log("Should be around 19 =====> ", TokBal);
        
        address[] memory path1 = new address[](2);
        path1[0] = TOK; //TOK 
        path1[1] = DAI;//WETH
        console.log("DAI in Contract before swap", tokContract.balanceOf(address(this)));
        tokContract.approve(address(sushiswapV2Router), TokBal);
        console.log("===============================");
        console.log("===============================");
        console.log("===============================");
        console.log("MATIC BALANCE BEFORE SWAP =====> ", msg.sender.balance);
        sushiswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(TokBal, 1 ether, path1, msg.sender, block.timestamp);
        console.log("===============================");
        console.log("===============================");
        console.log("===============================");
        console.log("MATIC BALANCE AFTER SWAP =====> ", msg.sender.balance);
        console.log("DAI in Contract after swap", tokContract.balanceOf(address(this)));

    }

    //Call this if price is higher in sushiswap
    function printMoneyV2() external payable{
        // uint256 amount = 5 ether;
        address[] memory path = new address[](2);
        path[0] = DAI;//WETH
        path[1] = TOK; //TOK 

        sushiswapV2Router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: msg.value}(0, path, address(this), block.timestamp);
        uint256 TokBal = tokContract.balanceOf(address(this));

        address[] memory path1 = new address[](2);
        path1[0] = TOK; //TOK 
        path1[1] = DAI;//WETH

        tokContract.approve(address(uniswapV2Router), TokBal);

        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(TokBal, 0, path1, msg.sender, block.timestamp);
    }

    receive() external payable{}
}