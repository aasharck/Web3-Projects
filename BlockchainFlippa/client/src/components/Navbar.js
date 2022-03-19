import { React, useEffect, useState } from "react";
import ethers from "ethers";
import "./Navbar.css";
import abi from "./../utils/contractABI.json";

const Navbar = () => {
  const contract_address = 0xb50d31eb90eabf833314a828edf19392a427e266;
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
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{ backgroundColor: "#e3f2fd" }}
      >
        <div className="container-fluid container">
          <a className="navbar-brand" href="#">
            BlockSell
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Buy
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Sell
                </a>
              </li>
            </ul>
            {currAccount ? (
              <button className="btn btn-outline-primary btntext" disabled>
                {currAccount}
              </button>
            ) : (
              <button
                className="btn btn-outline-primary"
                type="submit"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
