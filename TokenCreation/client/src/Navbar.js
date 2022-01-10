import React, { Component } from 'react';
import "./Navbar.css";

class Navbar extends Component{

    render(){

        return(
            <div>
                <header className="mb-auto">
    <div>
      <h3 className="float-md-start mb-0">OrangeCoin</h3>
      <nav className="nav nav-masthead justify-content-center float-md-end">
        <a className="nav-link active" aria-current="page" href="#">Home</a>
        <a className="nav-link" href="#">RoadMap</a>
        <a className="nav-link" href="#">Community</a>
      </nav>
    </div>
  </header>
            </div>
        )
    }
}

export default Navbar;