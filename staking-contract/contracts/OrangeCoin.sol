// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract OrangeCoin is ERC20, ReentrancyGuard {
    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public stakedTime;

    constructor() ERC20("OrangeCoin", "ORNG") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function stake(uint256 _amount) external nonReentrant(){
        require(_amount > 0, "The amount is less than or equal to 0");
        require(balanceOf(msg.sender) >= _amount, "You don't have the required amount in your wallet to stake");
        _transfer(msg.sender, address(this), _amount);
        if(stakedAmount[msg.sender] > 0){
            claim();
        }
        stakedAmount[msg.sender] += _amount;
        stakedTime[msg.sender] = block.timestamp; 
    }

    // staking period is 1 month
    function unstake(uint256 _amount) external{
        require(_amount > 0, "The amount is less than or equal to 0");
        require(stakedAmount[msg.sender] >= _amount, "Please input the correct amount");
        claim();
        stakedAmount[msg.sender] -= _amount;
        _transfer(address(this), msg.sender, _amount);
    }

    function claim() public nonReentrant(){
        require(stakedAmount[msg.sender] > 0, "You don't have any staked tokens");
        uint256 secondsStaked = block.timestamp - stakedTime[msg.sender];
        uint256 rewards = stakedAmount[msg.sender] * secondsStaked / 3.154e7;
        _mint(msg.sender, rewards);
        stakedTime[msg.sender] = block.timestamp;
    }
}
