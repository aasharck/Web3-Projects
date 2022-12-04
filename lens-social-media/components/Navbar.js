import React, { useContext } from 'react';
import Link from 'next/link';
import AppContext from '../AppContext';


const Navbar = () => {
  const value = useContext(AppContext);
  let {token} = value.state;
  let {setToken} = value;



  return (
    <nav className='navbar navbar-expand-lg navbar-expand-md navbar-light'>
      <div className='container-fluid'>
        <a className='navbar-brand' href='/'>
          LensStats
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
            <Link href='/top-profiles'>
              <li className='ms-4 nav-item'>Top Profiles</li>
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
