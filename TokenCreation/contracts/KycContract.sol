// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract KycContract{

    mapping(address => bool) allowed;
    uint public spots=1000;


    function setKyc(address _addr) public{
        require(spots != 0, "Whitelist is full");
        allowed[_addr]=true;
        --spots;
    }  

    function revokeKyc(address _addr) public{
        allowed[_addr]=false;
    }

    function getKycDetails(address _addr) public view returns(bool){
        return allowed[_addr];
    }

    function getSpotsLeft() public view returns(uint){
        return spots;
    }
}