// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OtherContract{
    IERC20 public USDC = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);

    //call approve function
    function mint(uint256 _amount) external{
        USDC.transferFrom(tx.origin, address(this), _amount);
    }
}