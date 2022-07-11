import React from 'react';
import HeroImg from './assets/heroImg.png';
import './Hero.css';

const Hero = () => {
  return (
    <div className='container hero hero-section has-background-black'>
      <div className='columns'>
      <div className='column'>
        <h1 className='hero-title title is-1 gradient-text'>
          A Decentralized Meme Token Revolutionizing Web3.0!
        </h1>
        <button className='button is-primary'>Connect Wallet</button>
      </div>
      <div className='column'>
        <img className='hero-img' src={HeroImg} />
      </div>

      </div>
      
    </div>
  );
};

export default Hero;
