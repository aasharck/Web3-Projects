import React, { useState, useContext } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { client, challenge, authenticate } from '../pages/api/api'
import { ethers } from 'ethers';
import AppContext from '../AppContext';


const Navbar = () => {
  const { address, isDisconnected } = useAccount();
  const value = useContext(AppContext);
  let {token} = value.state;
  let {setToken} = value;

  async function login() {
    try {
      /* first request the challenge from the API server */
      const challengeInfo = await client.query({
        query: challenge,
        variables: { address }
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      /* ask the user to sign a message with the challenge info returned from the server */
      const signature = await signer.signMessage(challengeInfo.data.challenge.text)
      /* authenticate the user */
      const authData = await client.mutate({
        mutation: authenticate,
        variables: {
          address, signature
        }
      })
      /* if user authentication is successful, you will receive an accessToken and refreshToken */
      const { data: { authenticate: { accessToken }}} = authData
      console.log({ accessToken })
      setToken(accessToken)
    } catch (err) {
      console.log('Error signing in: ', err)
    }
  }

  return (
    <nav className='navbar navbar-expand-lg navbar-expand-md navbar-light'>
      <div className='container-fluid'>
        <a className='navbar-brand' href='/'>
          Web3 Social Media
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <Link href='/'>
              <li className='nav-item'>Home</li>
            </Link>
            <Link href='/profile'>
              <li className='ms-4 nav-item'>Profile</li>
            </Link>
          </ul>
          <ConnectButton></ConnectButton>
          {!isDisconnected && !token && (
            <button onClick={login} className='btn btn-primary'>
              Sign in to Lens
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
