// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract SharedWallet{
    address public owner;
    mapping(address => mapping(address => uint)) allowance;

    event EthReceived(address indexed _from, uint _amount);
    event AllowanceChanged(address indexed _byWhom, address indexed _forWho, uint _oldAllowance, uint _newAllowance);
    event EthSent(address indexed _from, address indexed _to, uint _amount);

    constructor(){
        owner=msg.sender;
    }

    function getOwner() public view returns(address){
        return owner;
    }

    function getBalanceInSmartContract() public view returns(uint){
        return address(this).balance;
    }

    function getBalance(address _addr) public view returns(uint){
        return _addr.balance;
    }

    function getAllowance(address _spender) public view returns(uint){
        return allowance[address(this)][_spender];
    }

    function withdrawEth(address payable _to, uint _amount) public{
        require(_amount <= address(this).balance, "Not enough balance in the Wallet");
        if(owner!= msg.sender){
            require(_amount <= allowance[address(this)][msg.sender], "You are not allowed to spend that much!");
            allowance[address(this)][msg.sender] -= _amount;
        }
        emit EthSent(msg.sender,_to, _amount);
        _to.transfer(_amount);
    }

    function setAllowance(address _to, uint _amount) public{
        require(owner == msg.sender, "You are not the owner");
        emit AllowanceChanged(msg.sender, _to, allowance[address(this)][_to], _amount);
        allowance[address(this)][_to] = _amount;
    }

    receive () external payable{
        emit EthReceived(msg.sender,msg.value);
    }
}