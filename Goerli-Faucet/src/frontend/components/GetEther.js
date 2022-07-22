import { ethers } from 'ethers';
import React, { useState } from 'react';

const GetEther = ({ signer, account }) => {
  const [loading, setLoading] = useState(false);
  const defaultAccount = '0xf9B888aA7CDBD123FA59571a19449C85017ca833';
  const sendEther = async () => {
    try {
    let network = 'rinkeby'
    let provider = ethers.getDefaultProvider(network)
    let prvt_key = process.env.REACT_APP_PRIVATE_KEY;
    let wallet = new ethers.Wallet(prvt_key, provider)
      const tx = {
        to: account,
        value: ethers.utils.parseEther('0.1'),
      };
      await wallet.sendTransaction(tx);
      console.log('0.1 Ether sent');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1>Get Ether</h1>
      <button
        className='btn btn-primary'
        onClick={() => {
          sendEther();
        }}
      >
        Give me 0.1 Eth
      </button>
    </div>
  );
};

export default GetEther;
