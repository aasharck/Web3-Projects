// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Store{

    // sstore is used to store a value in storage.
    function addWithAssembly(uint256 _x, uint256 _y) public{
        assembly{
            let result := add(_x, _y)
            sstore(0, result)
        }
    }

    function getValueWithAssembly() public view returns(uint256){
        assembly{
            let val := sload(0)
            // Directly returning value from storage is not possible, so we need to store in memory and then return
            // 0x80 is location where val is stored
            mstore(0x80, val)
            // retunring memory data from 0x80 location and length 32 bytes
            return(0x80, 32)
        }
    }

    // NOW Without assembly to compare gas costs
    uint256 public value;
    function add(uint256 _x, uint256 _y) public{
        uint256 result = _x + _y;
        value = result;
    }

    function getValue() public view returns(uint256){
        return value;
    }

    // Conclusion:- Only calling view functions saves gas. addWithAssembly function is actually expensive than the normal
    // Not sure why
    
}
