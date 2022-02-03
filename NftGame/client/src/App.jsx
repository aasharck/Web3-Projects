import React, { useEffect, useState } from 'react';
import './App.css';
import SelectCharacter from './Components/SelectCharacter/SelectCharacter'
import Arena from './Components/Arena/Arena'
import abi from './utils/nftGame.json'
import { ethers } from "ethers";
import { contractAddress, transformNFTData } from './Constants/constants'


const App = () => {

  const contractABI = abi.abi;
  const [currAccount, setCurrAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);


const checkIfWalletIsConnected = async () =>{
try{
    if(!window.ethereum){
      console.log("No Ethereum Object");
    } else{

      console.log("Ethereum object detected!")

      const accounts = await ethereum.request({method: "eth_accounts"});

    if(accounts.length == 0){
      console.log("No Accounts connected")
    }else{
      console.log("connected to ", accounts[0]);
      setCurrAccount(accounts[0]);
    }
    
    }

  }catch(error){
  console.log(error);
  }
}

  useEffect(() => {

    checkIfWalletIsConnected();

    const checkIfCorrectNetwork = () => {
      try{
      if(!window.ethereum.networkVersion=='4'){
        console.log("please connect to Rinkeby network");
      }
      }catch(err){
        console.log(err);
      } 
    }
 }, []);

useEffect(() => {
    const fetchNFTMetadata = async () =>{
        console.log("Trying to find an NFT in Your Wallet..")

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const gameContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const nftMetadata = await gameContract.checkIfUserHasNFT();
        console.log(nftMetadata.name)

        if(nftMetadata.name){
          console.log("NFT character is available with you")
          const transformedData = await transformNFTData(nftMetadata);
          console.log("FINISHED TRANSFORM: ", transformedData);  
          console.log("BEFOREE",characterNFT)
          //setCharacterNFT(transformNFTData(nftMetadata));
          setCharacterNFT(transformNFTData(nftMetadata));
          console.log("Testing...TEST: ",characterNFT)
        }else{
          console.log("No character NFT found")
        }
    }

    if(currAccount) {
    console.log('CurrentAccount:', currAccount);
    fetchNFTMetadata();
  }
  }, [currAccount]);




const connectWallet = async () =>{

  try{

    if(!window.ethereum){
      console.log("No Ethereum Object");
    } else{

      console.log("Ethereum object detected!")

      const accounts = await ethereum.request({method: "eth_requestAccounts"});

      console.log("connected to ", accounts[0]);
      setCurrAccount(accounts[0]);
    }

  }catch(error){
    console.log(error);
  }
}

const renderContent = () =>{

  if(!currAccount){
    return(
      <div className="connect-wallet-container">
            <img
              src="https://i.imgur.com/d61nChj.jpeg"
              alt="The Fight!"
            />
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          </div>
    );
  }else if(currAccount && !characterNFT){
    return(<SelectCharacter setCharacterNFT={setCharacterNFT}/>);
  }else if(currAccount && characterNFT){
    return(<Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />)
  }
} 

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">FootWars!</p>
          <p className="sub-text">Team up to protect the Metaverseee!</p>
          {renderContent()}
        </div>
        
      </div>
    </div>
  );
};

export default App;
