import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const Explore = ({ marketplace, nft }) => {
  let [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const allListing = async () => {
    try {
      setLoading(true);
      const itemCount = await marketplace.itemCount();
      let items = [];
      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplace.items(i);
        if (!item.sold) {
          const uri = await nft.tokenURI(item.tokenId);
          //fetch the metadata
          const response = await fetch(uri);
          const metadata = await response.json();
          //get the total price from contract
          const totalPrice = await marketplace.getTotalPrice(item.itemId);
          // const totPrice = new BigInt(totalPrice, 16);
          const pPrice = totalPrice.toString();
          const totPrice = ethers.utils.formatEther(pPrice);
          const itemId = item.itemId.toString();
          //add all these to an array and save in state
          items.push({
            totalPrice,
            totPrice,
            itemId: itemId,
            seller: item.seller,
            name: metadata.name,
            desc: metadata.desc,
            image: metadata.image,
          });
        }
      }
      setLoading(false);
      setAllListings(items);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    allListing();
  }, [marketplace, nft]);

  const buyNFT = async (listing) => {
    const buy = await marketplace.purchaseItem(listing.itemId, {
      value: listing.totalPrice,
    });
    await buy.wait();
    allListing();
  };

  if (loading)
    return (
      <div className='container mt-5'>
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div className='container mt-5'>
      <h1 className='text-center mt-5'>
        Your <b className='text-primary'>NFTs</b>
      </h1>
      {!loading ? (
        allListings.map((listing, index) => (
          <div
            key={index}
            className='card mt-5 shadow p-3 rounded-5'
            style={{ width: '18rem' }}
          >
            <img src={listing.image} className='card-img-top' alt='...' />
            <div className='card-body'>
              <h5 className='card-title text-center'>{listing.name}</h5>
              <p className='card-text lead fs-6'>{listing.desc}</p>
              <div className='d-grid gap-2 d-md-block text-center'>
                <button
                  className='btn btn-outline-primary'
                  type='button'
                  onClick={() => {
                    buyNFT(listing);
                  }}
                >
                  Buy for {listing.totPrice} ETH
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='container mt-5'>
          <h2>Loading...</h2>
        </div>
      )}
    </div>
  );
};

export default Explore;
