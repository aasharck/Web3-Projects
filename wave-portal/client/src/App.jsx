import React, { useEffect, useState }  from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import './App.css';

function App() {

  const [currAccount, setCurrAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState([]);


  let totalWaves;
    const contractAddress = '0x0961eaff70b5fC661EEe64a514a667eD61603058';

  const contractABI = abi.abi;

useEffect(() => {
  checkIfWalletIsConnected();

  let wavePortalContract;

  const onNewWave = (from, message, timestamp) => {
    console.log("newWave", from, message, timestamp);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        message: message,
        timestamp: new Date(timestamp * 1000),
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("newWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("newWave", onNewWave);
    }
  };

},[])

  const checkIfWalletIsConnected = async () =>{
    const {ethereum} = window;

try{
    if(!ethereum){
      console.log("Please install Metamask");
    }else{
      console.log("Awesome, Metamask is Installed", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if(accounts.length !== 0){
      const account=accounts[0];
      console.log("Account found: ", account);
      setCurrAccount(account);
    }else{
      console.log("No Accounts found");
    }
}catch(error){
  console.log(error);
}
  }


const connectWallet = async () => {
  try{
    const {ethereum} = window;

    if(!ethereum){
      console.log("Please Install Metamask");
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected with", accounts[0]);
    setCurrAccount(accounts[0])

  }catch(error){
    console.log(error);
  }
}


const getAllWaves = async () => {
  try{
    if(!window.ethereum){
      console.log("No Metamask");
    }else{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const waveContract = new ethers.Contract(contractAddress, contractABI, signer);

      const waves = await waveContract.getAllWaves();

      let wavesArray = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

    setAllWaves(wavesArray);
    }
  } catch(error){
    console.log(error);
  }
}




  const wave = async () => {
    try{
        const {ethereum} = window;
        if(ethereum){
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          const waveContract = new ethers.Contract(contractAddress, contractABI, signer);

          totalWaves = await waveContract.getTotalWaves();
          console.log("Total number of waves", totalWaves.toNumber());

          const waveTxn = await waveContract.wave(message, { gasLimit: 300000 })

          await waveTxn.wait();
          console.log("Hi from", currAccount);

          totalWaves = await waveContract.getTotalWaves();
          console.log("Total number of waves", totalWaves.toNumber());

        }
    }catch(error){
      alert(error.message);
    }
    
    
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        Connect Your Wallet to wave at me! 
        </div>
        {!currAccount ? <button className="connectButton" onClick={connectWallet}>
          Connect Wallet
        </button> : <div className="input-group mb-3"><input className="form-control" type="text" value={message} onChange={e => setMessage(e.target.value)}/><button className="btn btn-outline-primary" onClick={wave}>
          Wave at Me
        </button></div>}
        {allWaves.map((wave, index) => {
          return (
            <div key={index} className="display-waves shadow">
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App;