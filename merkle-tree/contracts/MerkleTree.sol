// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract merkletree{

    bytes32 public merkleRoot;

    constructor(bytes32 _merkleRoot){
        merkleRoot = _merkleRoot;
    }

    function isWhiteListed(bytes32[] calldata _proof, uint256 _maxNumberForMint) public view returns(bool){
        bytes32 leaf = keccak256(abi.encode(msg.sender, _maxNumberForMint));
        bool verified = MerkleProof.verify(_proof, merkleRoot, leaf);
        return verified;
    }
}
