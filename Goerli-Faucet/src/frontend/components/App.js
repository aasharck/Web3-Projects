import './App.css';
import logo from './logo.png';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import GetEther from './GetEther';

const App = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState('');

  useEffect(() => {
    checkIfWalletIsConnected();

    // window.ethereum.on('chainChanged', (chainId) => {
    //   window.location.reload();
    // })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0]);
      checkIfWalletIsConnected();
      window.location.reload();
    });
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('No Web3 Provider Detected. Kindly Install Metamask');
      } else {
        setLoading(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        loadSigner();
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        alert('No Web3 Provider Detected. Kindly Install Metamask');
      } else {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length !== 0) {
          setAccount(accounts[0]);
          loadSigner();
        } else {
          console.log('Please Connect Your Wallet');
        }
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const loadSigner = () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);
      console.log('signer loaded');
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar connectWallet={connectWallet} account={account} logo={logo} />
      <GetEther signer={signer} account={account} />
      {/* <div className='px-4 py-5 my-5 text-center'>
        <img
          className='d-block mx-auto mb-4'
          src={logo}
          alt='Brand-hero'
          width='72'
          height='77'
        />
        <h1 className='display-5 fw-bold'>React Web3 BoilerPlate</h1>
        <div className='col-lg-6 mx-auto'>
          <p className='lead mb-4'>
            Quickly design and develop smart contracts and frontend with this
            BoilerPlate
          </p>
          <div className='d-grid gap-2 d-sm-flex justify-content-sm-center'>
            <button type='button' className='btn btn-primary btn-lg px-4 gap-3'>
              Connect Wallet
            </button>
          </div>
        </div>
      </div> */}
      <div className='container'>
        <footer className='py-3 my-4'>
          <p className='text-center text-muted'>Made with 💜 By Aashar Ck</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
