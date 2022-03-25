import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./Marketplace.css";

const Marketplace = (props) => {
  let [allListings, setAllListings] = useState([]);

  useEffect(() => {
    getAllListings();
  }, []);

  const getAllListings = async () => {
    try {
      if (!window.ethereum) {
        alert("No Metamask Detected");
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          props.contract_address,
          props.contractABI,
          signer
        );

        const listings = await contract.getAllListing();
        console.log(listings);
        let lisitingArray = listings.map((listing) => {
          return {
            id: listing.id,
            name: listing.name,
            websiteURL: listing.websiteURL,
            description: listing.description,
            price: listing.price,
            profitPerMonth: listing.profitPerMonth,
            siteAge: listing.siteAge,
            purchased: listing.purchased,
            approved: listing.approved,
            owner: listing.owner,
          };
        });
        console.log(lisitingArray);
        setAllListings(lisitingArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const buyListing = async (_sellerAddress, _id, _price) => {
    try {
      if (!window.ethereum) {
        alert("No Metamask Detected");
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          props.contract_address,
          props.contractABI,
          signer
        );
        const txn = await contract.buy(_sellerAddress, _id, {
          value: _price,
          gasLimit: 300000,
        });
        await txn.wait();
        alert(
          "Awesome! You have bought the listing. The seller will now contact you and will give you the access details. ONLY CLICK THE APPROVE BUTTON ONCE YOU HAVE RECEIVED EVERYTHING FROM THE SELLER"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>Marketplace</h1>
      {allListings.map((listing, index) => {
        return (
          <div key={index} className="display-waves shadow">
            <div>Name: {listing.name}</div>
            <div>Selling Price: {listing.price.toNumber()}</div>
            <div>Website URL: {listing.websiteURL}</div>
            <div>purchased: {listing.purchased.toString()}</div>
            <div>approved: {listing.approved.toString()}</div>
            <div>owner: {listing.owner}</div>
            <button
              disabled={listing.purchased ? true : false}
              className="btn btn-danger"
              onClick={() =>
                buyListing(
                  listing.owner,
                  listing.id.toNumber(),
                  listing.price.toNumber()
                )
              }
            >
              Buy This
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Marketplace;
