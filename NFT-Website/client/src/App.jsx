import React, {useEffect, useState} from 'react';
import { ethers } from "ethers";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import abi from './utils/myNFT.json'

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const contractAddress = '0xdaea6369E9e6BC4b6Ee9DF036D5c6d9Ed1eeB256';
  const contractABI = abi.abi;
  const [currAccount, setCurrAccount] = useState("");
  const [numberMinted, setNumberMinted] = useState(0);
  const [Loadingg, setLoadingg] = useState(0);

  useEffect(() =>{
    checkIfWalletConnected();
    
  },[])

  const checkIfWalletConnected = async () =>{

    try{
      if(!window.ethereum){
        console.log("No Metamask Detected");
      } else{

        console.log("Metamask found");

        const accounts = await ethereum.request({method:"eth_accounts"});

        if(accounts.length !== 0){
          console.log("Accounts found", accounts[0]);
          setCurrAccount(accounts[0]);
          setupEventListener();
        }else{
          console.log("No authorized Accounts")
        }
      }
    } catch(error){
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try{

      if(!window.ethereum){
        console.log("No Metamask Detected");
      } else{

        console.log("Metamask found");

        const accounts = await ethereum.request({method: "eth_requestAccounts"});
        
        console.log("connected to", accounts[0]);
        setCurrAccount(accounts[0]);
        setupEventListener();
      }

    }catch(error){
      console.log(error);
    }
  }

  const setupEventListener = async () =>{
    try{ 
      if(!window.ethereum){
        console.log("No Metamask")
      }else{

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        contract.on("NFTMinted", (from,tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(`Your NFT has been minted, It will take about 10 minutes to show up On Opensea. Here's the link - https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`);

      setNumberMinted(tokenId.toNumber()+1);
      
    
        })
      }

    }catch(error){
      console.log(error);     
    }
  }


  const mintNFT = async () =>{
    try{
      if(!window.ethereum){
        console.log("No Metamask detected");
      }else{
        setLoadingg(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await contract.makeNFT();
        console.log("minting in progress");

        await txn.wait();

        
    setLoadingg(false);
      }
    } catch(error){
      console.log(error)
      setLoadingg(false);
    }
  }


  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  window.ethereum.on('accountsChanged', function (accounts) {
    window.location.reload();
  })

  const renderMintButton = () => (
    
<button className="cta-button mint-button" onClick={mintNFT}>
      {Loadingg ? <span><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span><span>  Minting..</span></span> : <span>Mint</span>}
    </button>
    )

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Epic Eyes Club</p>
          <p className="sub-text">
            Each unique. Each beautiful. Mint your NFT today.
          </p>
          {!currAccount ? renderNotConnectedContainer() : renderMintButton() }
    <div className="minted-number">Minted So Far: {numberMinted}/5</div>
          
        </div>
        
      </div>
    </div>
  );
};

export default App;