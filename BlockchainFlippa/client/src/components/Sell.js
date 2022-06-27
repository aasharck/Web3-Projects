import React, { useState } from 'react';
import { ethers } from "ethers";
import './Sell.css';

const Sell = (props) => {
  const [name, setName] = useState('');
  const [websiteURL, setWebsiteURL] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [profit, setProfit] = useState(0);
  const [siteAge, setSiteAge] = useState(1);

  const onSubmit = async (e) =>{
    e.preventDefault();
    try {
      if(!window.ethereum){
        alert('NO Metamask installed')
      }else{

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          props.contract_address,
          props.contractABI,
          signer
        );

        const res = await contract.List(name, websiteURL, description, price, profit, siteAge);
        await res.wait()

        alert('Awesome, You have Listed your website on Sale!')

      }
      
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className='container'>
      <h1>Sell Your Online Business</h1>
      <form onSubmit={(e)=> onSubmit(e)}>
        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label htmlFor='inputEmail4'>Name</label>
            <input
              type='text'
              className='form-control'
              id='inputEmail4'
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='form-group col-md-6'>
            <label htmlFor='inputPassword4'>Website URL</label>
            <input
              type='text'
              className='form-control'
              id='inputPassword4'
              placeholder='Password'
              value={websiteURL}
              onChange={(e) => setWebsiteURL(e.target.value)}
            />
          </div>
        </div>
        <div className='form-group col-md-6'>
          <label htmlFor='inputAddress'>Description</label>
          <textarea
            className='form-control'
            id='inputAddress'
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className='form-group col-md-2'>
          <label htmlFor='inputAddress2'>Price</label>
          <input
            type='number'
            className='form-control'
            id='inputAddress2'
            placeholder='Price at which you want to sell'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className='form-row'>
          <div className='form-group col-md-2'>
            <label htmlFor='inputCity'>Profit</label>
            <input
              type='number'
              className='form-control'
              id='inputCity'
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
            />
          </div>
          <div className='form-group col-md-2'>
            <label htmlFor='inputZip'>Site Age</label>
            <input
              type='number'
              className='form-control'
              id='inputZip'
              value={siteAge}
              onChange={(e) => setSiteAge(e.target.value)}
            />
          </div>
        </div>
        <button type='submit' className='mt-4 btn btn-primary'>
          List My Website
        </button>
      </form>
    </div>
  );
};

export default Sell;
