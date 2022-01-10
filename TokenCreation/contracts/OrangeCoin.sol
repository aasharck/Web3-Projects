// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OrangeCoin is ERC20 {
    constructor(uint256 initialSupply) ERC20("OrangeCoin", "ORNG") {
        _mint(msg.sender, initialSupply);
    }

    function decimals() public view override returns (uint8) {
		return 0;
	}
}