// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

contract Domains{

    mapping(string => address) public domains;
    mapping(string => string) public records;

    function register(string calldata _name) external{
        require(domains[_name] == address(0), "Already registered. Try another name!");
        domains[_name] = msg.sender;
    }

    function getAddress(string calldata _name) external view returns(address){
        return domains[_name];
    }

    function setRecord(string calldata _name, string calldata _record) external{
        require(domains[_name] == msg.sender, "Not Authorized!");
        records[_name] = _record;
    }

    function getRecord(string calldata _name) external view returns(string memory){
        return records[_name];
    }
}