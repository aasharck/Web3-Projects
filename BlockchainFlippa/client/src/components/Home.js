import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-hero container">
      <h1 className="hero-heading">
        Fully Trusted Blockchain Solution to Sell Your Online Business!
      </h1>
      <Link to="/marketplace">
        <button className="btn btn-primary btn-buy">
          Buy Online Businesses
        </button>
      </Link>
      <Link to="/sell">
        <button className="btn btn-outline-secondary">
          Sell Your Online Business
        </button>
      </Link>
    </div>
  );
};

export default Home;
