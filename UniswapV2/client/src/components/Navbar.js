import React from 'react';

const Navbar = () => {
  return (
    <div className='container navbar-height'>
      <nav className='navbar is-black'>
        <div className='navbar-brand'>
          <a className='navbar-item' href='https://bulma.io'>
            <img
              src='https://bulma.io/images/bulma-logo-white.png'
              alt='Bulma: a modern CSS framework based on Flexbox'
              width='112'
              height='28'
            />
          </a>
          <div
            className='navbar-burger'
            data-target='navbarExampleTransparentExample'
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id='navbarExampleTransparentExample' className='navbar-menu'>
          <div className='navbar-start'>
            <a className='navbar-item' href='https://bulma.io/'>
              Home
            </a>
            <a className='navbar-item' href='https://bulma.io/'>
              WhitePaper
            </a>
          </div>

          <div className='navbar-end'>
            <div className='navbar-item'>
              <div className='field is-grouped'>
                <p className='control'>
                  <a
                    className='button is-primary'
                    href='https://github.com/jgthms/bulma/releases/download/0.9.4/bulma-0.9.4.zip'
                  >
                    <span className='icon'>
                      <i class='fa-brands fa-connectdevelop'></i>
                    </span>
                    <span>Buy BabyPump</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
