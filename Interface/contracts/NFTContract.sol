// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IOther{
    function mint(uint256 _amount) external;
}

contract NFTContract is ERC721, Ownable {
    uint256 priceInUSDC = 1000000;
    IOther public otherContract;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(address _otherContractAddress) ERC721("MyToken", "MTK") {
        otherContract = IOther(_otherContractAddress);
    }

    function safeMint() public onlyOwner {
        otherContract.mint(priceInUSDC);
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }
}