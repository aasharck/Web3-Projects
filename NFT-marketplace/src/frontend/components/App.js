import './App.css';
import { Fragment, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import marketplaceABI from '../contractsData/Marketplace.json';
import marketplaceAddress from '../contractsData/Marketplace-address.json';
import nftABI from '../contractsData/NFT.json';
import nftAddress from '../contractsData/NFT-address.json';
import Navbar from './Navbar';
import Home from './Home';
import Create from './Create';
import Explore from './Explore';
import MyPurchases from './MyPurchases';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [marketplace, setMarketplace] = useState('');
  const [nft, setNft] = useState('');

  useEffect(() => {
    checkIfWalletIsConnected();

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await checkIfWalletIsConnected();
      window.location.reload();
    })
  }, []);

  //connect wallet
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
        loadContracts();
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  //loading contracts
  const loadContracts = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const mp = new ethers.Contract(
        marketplaceAddress.address,
        marketplaceABI.abi,
        signer
      );
      setMarketplace(mp);
      const nf = new ethers.Contract(nftAddress.address, nftABI.abi, signer);
      setNft(nf);

      // console.log(await signer.provider.getCode(marketplace))

      console.log('Contracts Loaded!');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  //checkwalletconnected -> yes then load contracts
  //-no -> then do nothing, display connect wallet button

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
          loadContracts();
        } else {
          console.log('Please Connect Your Wallet');
        }
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar
        loading={loading}
        account={account}
        connectWallet={connectWallet}
      />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route
          path='/create'
          element={
            <Create marketplace={marketplace} nft={nft} account={account} />
          }
        ></Route>
        <Route
          path='/explore'
          element={<Explore marketplace={marketplace} nft={nft}/>}
        ></Route>
        <Route
          path='/mypurchases'
          element={
            <MyPurchases
              marketplace={marketplace}
              nft={nft}
              account={account}
            />
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
