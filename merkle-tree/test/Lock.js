const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs');
const { expect } = require('chai');
const { ethers } = require('hardhat');

function encodeLeaf(address, num) {
  //same as `abi.encodePacked` in solidity
  return ethers.utils.defaultAbiCoder.encode(['address', 'uint256'], [address, num]);
}

describe('Check if Merkle root is working', () => {
  it('Should be able to verify a given address in the list', async () => {
    const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    const list = [
      encodeLeaf(owner.address, 2),
      encodeLeaf(addr1.address, 2),
      encodeLeaf(addr2.address, 2),
      encodeLeaf(addr3.address, 2),
      encodeLeaf(addr4.address, 2),
    ];

    const merkleRoot = new MerkleTree(list, keccak256, {
      hashLeaves: true,
      sortPairs: true
    })
    const root = merkleRoot.getHexRoot();

    //deploy contract
    const Contract = await ethers.getContractFactory("merkletree");
    const contract = await Contract.deploy(root);
    await contract.deployed();

    console.log("Contract Deployed to: ", contract.address);

    //computing merkle proof - you can use connected account on the frontend
    const leaf = keccak256(list[0])
    const proof = merkleRoot.getHexProof(leaf);

    let verified = await contract.isWhiteListed(proof, 2);
    expect(verified).to.equal(true);

    let notTrue = await contract.isWhiteListed(merkleRoot.getHexProof(keccak256(encodeLeaf(addr5.address,2))),2);
    expect(notTrue).to.equal(false);

  });
});
