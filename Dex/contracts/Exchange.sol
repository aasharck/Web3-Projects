// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {
    address public SafemoonTokenAddress; //0x176d8b2914519d20D5d6C9eD604c16c1bD72C7B0

    constructor(address _SafeMoonToken) ERC20("Safemoon LP Token", "SFLP") {
        require(_SafeMoonToken != address(0), "You passed in a null address");
        SafemoonTokenAddress = _SafeMoonToken;
    }

    function getReserve() public view returns (uint256) {
        return ERC20(SafemoonTokenAddress).balanceOf(address(this));
    }

    function addLiquidity(uint _amount) public payable returns (uint){
        uint liquidity;
        uint ethBalance = address(this).balance;
        uint SafeMoonTokenReserve = getReserve();
        ERC20 SafeMoonToken = ERC20(SafemoonTokenAddress);

        if(SafeMoonTokenReserve == 0){
            SafeMoonToken.transferFrom(msg.sender, address(this), _amount);
            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        }else{
            uint ethReserve = ethBalance - msg.value;
            uint SafeMoonTokenAmount = ((msg.value * SafeMoonTokenReserve)/(ethReserve));
            require(_amount >= SafeMoonTokenAmount, "Amount of token is lower than Minimum tokens required");
            SafeMoonToken.transferFrom(msg.sender, address(this), SafeMoonTokenAmount);
            liquidity = (totalSupply() * msg.value)/ ethReserve;
            _mint(msg.sender, liquidity);
        }
        return liquidity;
    }

    function removeLiquidity(uint _amount) public payable returns(uint, uint){
        require(_amount > 0, "Amount should be greater than 0");
        uint totalSupply = totalSupply();
        uint ethReserve = address(this).balance;

        uint ethAmount = (ethReserve * _amount)/ totalSupply;

        uint SafeMoonTokenAmount = (getReserve() * _amount) / totalSupply;

        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(ethAmount);

        ERC20(SafemoonTokenAddress).transfer(msg.sender, SafeMoonTokenAmount);
        return(ethAmount, SafeMoonTokenAmount);
    }

    function getAmountOfTokens(uint256 _inputAmount, uint256 _inputReserve, uint256 _outputReserve) public pure returns(uint256){
        require(_inputReserve > 0 && _outputReserve > 0, "Invalid reserves");
        uint256 inputAmountWithFees = _inputAmount * 99;
        uint256 numerator = inputAmountWithFees * _outputReserve;
        uint256 denominator = (_inputReserve * 100) + inputAmountWithFees;
        return numerator / denominator;
    }

    function swapEthForSafemoon(uint _minTokens) public payable{
        uint256 tokenReserve = getReserve();

        uint256 tokensBought = getAmountOfTokens(msg.value, address(this).balance - msg.value, tokenReserve);

        require(tokensBought >= _minTokens, "Insufficient output amount");
        ERC20(SafemoonTokenAddress).transfer(msg.sender, tokensBought);
    }

    function swapSafemoonForEth(uint _tokensSold, uint _minEth) public payable{
        uint256 tokenReserve = getReserve();

        uint256 ethBought = getAmountOfTokens(_tokensSold, tokenReserve, address(this).balance);

        require(ethBought >= _minEth, "Insufficient output amount");

        ERC20(SafemoonTokenAddress).transferFrom(msg.sender, address(this), _tokensSold);

        payable(msg.sender).transfer(ethBought);
    }
}
