// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract BlockchainFlippa{
    
    struct Listing{
        uint256 id;
        string name;
        string websiteURL;
        string description;
        uint256 price;
        uint256 profitPerMonth;
        uint256 siteAge;
        bool purchased;
        bool approved;
        address owner;
        address buyer;
    }
    
    mapping(uint256 => Listing) public sellerListings;
    uint256 public listingCount;
    address[] public sellerAddresses;
    
    receive() external payable {}
    
    function List(string memory _name, string memory _websiteURL, string memory _description, uint256 _price, uint256 _profitPerMonth, uint256 _siteAge) public {
        Listing storage newListing = sellerListings[listingCount];
        newListing.id = listingCount;
        newListing.name = _name;
        newListing.websiteURL = _websiteURL;
        newListing.description = _description;
        newListing.price = _price;
        newListing.profitPerMonth = _profitPerMonth;
        newListing.siteAge = _siteAge;
        newListing.owner = msg.sender;
        newListing.buyer = address(0);

        sellerAddresses.push(msg.sender);
        listingCount++;
    }
    
    function buy(address _sellerAddress, uint256 _id) public payable{
        require(sellerListings[_id].price == msg.value, "Wrong Price");
        require(msg.sender != _sellerAddress,"Hey Dumbass, You can't buy your own Listing");
        (bool sent, ) = address(this).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        sellerListings[_id].purchased = true;
        sellerListings[_id].buyer = msg.sender;
    }
    
    function buyerApprove(address _sellerAddress, uint256 _id) public payable{
        require( sellerListings[_id].buyer == msg.sender, "Haha! You are not the Approver");
        sellerListings[_id].approved = true;
        sellerListings[_id].owner = msg.sender;
        uint256 _price = sellerListings[_id].price;
        (bool sent, ) = payable(_sellerAddress).call{value: _price}("");
        require(sent, "Failed to send Ether");
    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    function getAllListing() public view returns (Listing[] memory){
        Listing[] memory getAll = new Listing[](listingCount);
      for (uint i = 0; i < listingCount; i++) {
          Listing storage listing = sellerListings[i];
          getAll[i] = listing;
      }
      return getAll;
    }


    //Dispute

    //Relist website for Sale
}