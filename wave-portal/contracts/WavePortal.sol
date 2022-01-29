// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal{
    uint totalWaves;

    uint private seed;

    event newWave(address indexed _waver, string _message, uint _timestamp);

    struct Wave{
        address waver;
        string message;
        uint timestamp;
    }
    mapping(address => uint) lastWavedAt;

    Wave[] waves;
    constructor() payable{
        console.log("Haha! First Contractt");

        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public{

        require(lastWavedAt[msg.sender]+ 30 seconds < block.timestamp, "Wait 15 MINUTES!");
        totalWaves += 1;
        console.log("%s has waved at you with message %s", msg.sender, _message);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        
        seed = (block.timestamp + block.difficulty + seed) % 100;

        lastWavedAt[msg.sender] = block.timestamp;
        if(seed <= 50){
            console.log("%s WON. You have received 0.001 ether", msg.sender);
            uint prizeAmount=0.001 ether;
            require( address(this).balance >= prizeAmount, "Soory, No More Funds in the Contract");
            payable(msg.sender).transfer(prizeAmount);
        }

        emit newWave(msg.sender, _message, block.timestamp);

    }

    function getAllWaves() public view returns(Wave[] memory){
        return waves;
    }

    function getTotalWaves() public view returns(uint) {
        console.log("You have %d waves", totalWaves);
        return totalWaves;
    }

    receive () external payable{

    }
}