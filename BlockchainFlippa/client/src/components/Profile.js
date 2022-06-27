import React, { Fragment, useEffect, useState } from 'react';
import './Profile.css';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

const Profile = (props) => {
  let [allListings, setAllListings] = useState([]);

  useEffect(() => {
    getAllListings();
  }, []);

  const getAllListings = async () => {
    try {
      if (!window.ethereum) {
        alert('No Metamask Detected');
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
            buyer: listing.buyer,
          };
        });
        console.log(lisitingArray);
        setAllListings(lisitingArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const approveBuyer = async (_seller, _id) => {
    try {
      if (!window.ethereum) {
        alert('No Metamask Detected');
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          props.contract_address,
          props.contractABI,
          signer
        );

        const res = await contract.buyerApprove(_seller, _id);
        await res.wait();

        alert(
          'Great! You have completely bought the website and money has been transfered to the seller'
        );
      }
    } catch (err) {
      console.log(err);
    }
  };


  //new function to directly list the website for sale needs to be added here as well in soldity
  return (
    <div className='container'>
      <h4>Hi, {props.currAccount}</h4>
      <h4>Websites you Bought:</h4>
      {allListings.map((listing, index) => (
        <Fragment key={index}>
          {listing.buyer.toUpperCase() === props.currAccount.toUpperCase() && (
            <div className='display-waves shadow'>
              <div>Name: {listing.name}</div>
              <div>Selling Price: {listing.price.toNumber()}</div>
              <div>Website URL: {listing.websiteURL}</div>
              <div>purchased: {listing.purchased.toString()}</div>
              <div>approved: {listing.approved.toString()}</div>
              <div>owner: {listing.owner}</div>
              {listing.approved == true ? (
                <Link
                to='/sell'
                  className='btn btn-info'
                >
                  List This Website
                </Link>
              ) : (
                <button
                  className='btn btn-danger'
                  onClick={() => approveBuyer(listing.owner, listing.id)}
                >
                  Approve this Trasaction
                </button>
              )}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default Profile;
