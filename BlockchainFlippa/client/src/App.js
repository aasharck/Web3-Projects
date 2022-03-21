import { React, useEffect, useState } from "react";
import { Route, Routes, NavLink, Link } from "react-router-dom";
import ethers from "ethers";
import "./App.css";
import abi from "./utils/contractABI.json";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Marketplace from "./components/Marketplace";
import Sell from "./components/Sell";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/marketplace" element={<Marketplace />}></Route>
        <Route path="/sell" element={<Sell />}></Route>
      </Routes>
    </div>
  );
};

export default App;
