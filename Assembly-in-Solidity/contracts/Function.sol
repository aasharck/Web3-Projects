// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract FunctionContract{

    function encrytData(string memory _input, bool _decrypt) external pure returns(string memory){
        bytes32 output;
        assembly{
            function stringToBytes(a) -> b {
                b:= mload(add(a,32))
            }

            function addToBytes(bs, decrypt) -> r{
                if eq(decrypt, false){
                    mstore(0x0, add(bs,0x0101010101010101010101010101010101010101010101010101010101010101))
                }
                if eq(decrypt, true) {
                    mstore(0x0, sub(bs,0x0101010101010101010101010101010101010101010101010101010101010101))
                }
                r := mload(0x0)
            }
            let byteString := stringToBytes(_input)
            output:= addToBytes(byteString, _decrypt)
        }
        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) bytesArray[i] = output[i];
        return string(bytesArray);
    }
}