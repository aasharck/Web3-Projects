// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract ApprovalWallet{
    address[] public approvers;
    uint public quorum;

    struct Transfer{
        uint id;
        address payable to;
        uint amount;
        bool sent;
        uint noOfApprovers;
    }

    mapping(address => mapping(uint => bool)) public approval;
    Transfer[] public transfers;

    constructor(address[] memory _approvers, uint _quorum) {
        approvers = _approvers;
        quorum = _quorum;
    }

    modifier onlyApprover(){
        bool isAllowed;
        for(uint i; i < approvers.length; i++){
            if(approvers[i] == msg.sender){
                isAllowed=true;
            }
        }
        require(isAllowed == true, "You are not an approver");
        _;
    } 

    function createTransfer(address payable _to, uint _amount) onlyApprover() external{
        transfers.push(Transfer(
            transfers.length,
            _to,
            _amount,
            false,
            0
        ));
    }

    function approveTransfer(uint _id) onlyApprover() external{
        require(approval[msg.sender][_id] == false, "You can only approve once");
        require(transfers[_id].sent == false, "Already Transfered");
        

        approval[msg.sender][_id]=true;
        transfers[_id].noOfApprovers++;

        if(transfers[_id].noOfApprovers >= quorum){
            transfers[_id].sent=true;
            address payable _to = transfers[_id].to;
            uint _amount = transfers[_id].amount;
            _to.transfer(_amount);
        }
    }



    function getApprovers() external view returns(address[] memory){
        return approvers;
    }

    function getTransfers() external view returns(Transfer[] memory){
        return transfers;
    }

    receive() external payable{

    }
}

