import React from 'react'

const Navbar = ({connectWallet, account, logo}) => {
  return (
    <div><nav className='navbar navbar-expand-lg navbar-light bg-light shadow'>
    <div className='container-fluid'>
      <a className='navbar-brand' href='#'>
        <img src={logo} alt='' width='40' height='40' />
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
        {/* <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
          <li className='nav-item'>
            <Link to='/' className='nav-link'>Home</Link>
          </li>
          <li className='nav-item'>
            <Link to='/explore' className='nav-link'>
              Explore Courses
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/create-course' className='nav-link'>
              Create a Course
            </Link>
          </li>
        </ul> */}
        <form className='d-flex' role='search'>
          {account == null ? (
            <button
              className='btn btn-primary'
              type='submit'
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          ) : (
            <button
              type='button'
              className='btn btn-outline-primary'
              disabled
            >
              {account.slice(0, 6) + '...' + account.slice(36, 42)}
            </button>
          )}
        </form>
      </div>
    </div>
  </nav></div>
  )
}

export default Navbar