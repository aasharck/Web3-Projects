import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-expand-md navbar-dark p-3' >
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>
            BabyPump
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
              <li className='nav-item'>
                <Link className='nav-link' aria-current='page' to='/'>
                  Home
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' aria-current='page' to='/'>
                  Buy BabyPump
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' aria-current='page' to='/'>
                  WhitePaper
                </Link>
              </li>
            </ul>
           
            {/* {account == null ? ( */}
        <button className='btn btn-light'>
          {/* {loading ? ( */}
            {/* <span>
              <span
                className='spinner-border spinner-border-sm me-2'
                role='status'
                aria-hidden='true'
              ></span>
              <span>Connecting..</span>
            </span> */}
          {/* ) : ( */}
            <span>Connect Wallet</span>
          {/* )} */}
        </button>
      {/* ) : (
        <button type="button" className="btn btn-outline-light" disabled>{account.slice(0, 7) + '....' + account.slice(34, 42)}</button>
      )} */}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;