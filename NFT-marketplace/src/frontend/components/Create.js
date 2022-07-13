import React, { useState } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { ethers } from 'ethers';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const Create = ({ marketplace, nft, account }) => {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const uploadToIpfs = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file);
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const createNft = async () => {
    if (!image || !name || !desc || !price) return;
    try {
        setLoading(true);
      const result = await client.add(
        JSON.stringify({ image, name, desc, price })
      );
      mintThenList(result);
    } catch (error) {
        setLoading(false);
        console.log(error);
    }
  };

  const mintThenList = async (result) => {
    try {
      const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
      await (await nft.mint(uri)).wait();
      const id = await nft.tokenCount();
      await (await nft.setApprovalForAll(marketplace.address, true)).wait();
      const listingPrice = ethers.utils.parseEther(price.toString());
      await (await marketplace.listItem(nft.address, id, listingPrice)).wait();
        setLoading(false);
    } catch (error) {
        setLoading(false);
        console.log(error);
    }
  };

  return (
    <div className='container'>
      <h1 className='text-center mt-5'>
        Create Your Own <b className='text-primary'>NFT</b>
      </h1>
      <form className='col-lg-6 justify-content-center m-auto'>
        <div className='mb-3 mt-5'>
          <label htmlFor='formFile' className='form-label lead fs-6'>
            Choose an Image for your NFT
          </label>
          <input
            className='form-control'
            type='file'
            id='formFile'
            onChange={uploadToIpfs}
            required
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='exampleFormControlInput1'
            className='form-label lead fs-6'
          >
            Enter a Name for your NFT
          </label>
          <input
            type='text'
            className='form-control'
            id='exampleFormControlInput1'
            placeholder='Name'
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='exampleFormControlInput2'
            className='form-label lead fs-6'
          >
            Enter a Description
          </label>
          <input
            type='text'
            className='form-control'
            id='exampleFormControlInput2'
            placeholder='Describe your NFT in 1 or 2 sentences'
            onChange={(e) => {
              setDesc(e.target.value);
            }}
            required
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='exampleFormControlInput3'
            className='form-label lead fs-6'
          >
            Enter a Price
          </label>
          <input
            type='number'
            className='form-control'
            id='exampleFormControlInput3'
            placeholder='Price for your NFT'
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            required
          />
        </div>
        <div className='d-grid gap-2 mt-3'>
          <button className='btn btn-primary' type='button' onClick={createNft}>
          {loading ? (
            <span>
              <span
                className='spinner-border spinner-border-sm me-2'
                role='status'
                aria-hidden='true'
              ></span>
              <span>Creating your NFT...</span>
            </span>
          ) : (
            <span>Create NFT</span>
          )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
