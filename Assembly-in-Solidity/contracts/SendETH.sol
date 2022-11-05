// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract sendETH{
    address[2] recievers = [0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db];

    function sendETHToAddress(address _to, uint256 _amountInEth) external payable{
        bool success;
        uint256 amountInWei = _amountInEth * 10**18;
        assembly{
            for {let i:= 0 } lt(i, 2) {i := add(i, 1)}{
                let reciever := sload(i)
                if eq(_to, reciever){
                    success := call(gas(), _to, amountInWei, 0,0,0,0)
                }
            }
        }
        require(success, "Failed to send ETH");
    }
}