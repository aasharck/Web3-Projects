import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./Marketplace.css";

const Marketplace = (props) => {
  let [allListings, setAllListings] = useState([]);

  useEffect(() => {}, []);

  const getAllListings = async () => {
    try {
      if (!window.ethereum) {
        alert("No Metamask Detected");
      } else {
        console.log("clikced");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          props.contract_address,
          props.contractABI,
          signer
        );

        const listings = await contract.getAllListing();
        console.log(listings);
        console.log("Hi");
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

        console.log("lst");
        setAllListings(lisitingArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>Marketplace</h1>
      <button onClick={getAllListings}>SHow</button>
      {allListings.map((listing, index) => {
        return (
          <div key={index} className="display-waves shadow">
            <div>Name: {listing.name}</div>
            <div>Selling Price: {listing.price}</div>
            <div>Website URL: {listing.websiteURL}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Marketplace;
