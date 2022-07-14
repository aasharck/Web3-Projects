import React from 'react';
import hero from './hero.png';
import './Hero.css';
import heroBackground from './hero-background.jpg';
import Navbar from './Navbar';

const Hero = () => {
  return (
    <div className='hero'>
      <Navbar />
      <div className='container'>
      <div className='row hero-sub'>
        <div className='col hero-section1'>
          <h1 className='hero-heading'>
            The World's Largest Decentralised Meme Coin Revolutionizing Web3.0!
          </h1>
          <button className='btn btn-lg btn-light mt-3 me-3'>Buy Now!</button>
          <button className='btn btn-lg btn-outline-light mt-3'>
            Read the WhitePaper!
          </button>
        </div>
        <div className='col'>
          <img src={hero} className='hero-img' alt='hero' />
        </div>
      </div>
      </div>
    </div>
  );
};

export default Hero;
