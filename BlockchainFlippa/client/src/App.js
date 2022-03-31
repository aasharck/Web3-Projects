import { React, useEffect, useState } from "react";
import { Route, Routes, NavLink, Link } from "react-router-dom";
import ethers from "ethers";
import "./App.css";
import abi from "./utils/contractABI.json";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Marketplace from "./components/Marketplace";
import Sell from "./components/Sell";
import Profile from "./components/Profile";

const App = () => {
  const contract_address = "0x3F352F077Ba0CDf41de470af8021AFF9e1E7Fabb";
  const contractABI = abi.abi;

  let [currAccount, setCurrAccount] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install Metamask");
      } else {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length != 0) {
          console.log("Connected to", accounts[0]);
          setCurrAccount(accounts[0]);
        } else {
          console.log("No Authorized accounts found!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install Metamask");
      } else {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrAccount(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar currAccount={currAccount} connectWallet={connectWallet} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/marketplace"
          element={
            <Marketplace
              contract_address={contract_address}
              contractABI={contractABI}
              currAccount={currAccount}
            />
          }
        ></Route>
        <Route path="/sell" element={<Sell />}></Route>
        <Route path="/profile" element={<Profile currAccount={currAccount}/>}></Route>
      </Routes>
    </div>
  );
};

export default App;
