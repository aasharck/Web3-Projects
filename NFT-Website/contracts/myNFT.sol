// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract myNFT is ERC721URIStorage{

    event NFTMinted(address sender, uint tokenId);

    uint public maxSupply = 5; 

    using Counters for Counters.Counter;
    Counters.Counter  private _tokenIds;

    constructor() ERC721("Eye NFT", "EYE"){
        console.log("Going to build an EPIC NFT");
    }


    function makeNFT() public{
        require(maxSupply!=0, "Max Supply Reached, You cannot mint more NFTs");
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, "<IPFS URL>");

        _tokenIds.increment();
        maxSupply -= 1;

        emit NFTMinted(msg.sender, newItemId);
    }
}