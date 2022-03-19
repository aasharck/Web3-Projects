import { React, useEffect, useState } from "react";
import ethers from "ethers";
import "./App.css";
import abi from "./utils/contractABI.json";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

const App = () => {
  return (
    <div>
      <Navbar />
      <Home />
    </div>
  );
};

export default App;
