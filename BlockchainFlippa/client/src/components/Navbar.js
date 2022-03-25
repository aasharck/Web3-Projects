import { React, useEffect, useState } from "react";
import ethers from "ethers";
import "./Navbar.css";
import { Route, Routes, NavLink, Link } from "react-router-dom";

import abi from "./../utils/contractABI.json";

const Navbar = (props) => {
  

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
                <NavLink exact="true" className="nav-link active" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact="true" className="nav-link" to="/marketplace">
                  Buy
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact="true" className="nav-link" to="/sell">
                  Sell
                </NavLink>
              </li>
            </ul>
            {props.currAccount ? (
              <button className="btn btn-outline-primary btntext" disabled>
                {props.currAccount}
              </button>
            ) : (
              <button
                className="btn btn-outline-primary"
                type="submit"
                onClick={props.connectWallet}
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
