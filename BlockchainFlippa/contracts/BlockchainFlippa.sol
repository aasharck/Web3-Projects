// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract MyContract{
    
    struct Listing{
        string name;
        string websiteURL;
        string description;
        uint256 price;
        uint256 profitPerMonth;
        uint256 siteAge;
        bool purchased;
        bool approved;
        address owner;
    }
    
    mapping(address => Listing) public sellerListings;
    address[] public sellerAddresses;
    mapping(address => address) public buyer;
    
    receive() external payable {}
    
    function List(string memory _name, string memory _websiteURL, string memory _description, uint256 _price, uint256 _profitPerMonth, uint256 _siteAge) public {
        Listing storage newListing = sellerListings[msg.sender];
        newListing.name = _name;
        newListing.websiteURL = _websiteURL;
        newListing.description = _description;
        newListing.price = _price;
        newListing.profitPerMonth = _profitPerMonth;
        newListing.siteAge = _siteAge;
        newListing.owner = msg.sender;
        
        sellerAddresses.push(msg.sender);
    }
    
    function buy(address _sellerAddress) public payable{
        require(sellerListings[_sellerAddress].price == msg.value, "Wrong Price");
        require(msg.sender != _sellerAddress,"Hey Dumbass, You can't buy your own Listing");
        (bool sent, ) = address(this).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        sellerListings[_sellerAddress].purchased = true;
        buyer[_sellerAddress] = msg.sender;
    }
    
    function buyerApprove(address _sellerAddress) public payable{
        require( buyer[_sellerAddress] == msg.sender, "Haha! Nice try Bitch!");
        sellerListings[_sellerAddress].approved = true;
        sellerListings[_sellerAddress].owner = msg.sender;
        uint256 _price = sellerListings[_sellerAddress].price;
        (bool sent, ) = payable(_sellerAddress).call{value: _price}("");
        require(sent, "Failed to send Ether");
    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    
}