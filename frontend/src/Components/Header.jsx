import { Link } from "react-router-dom";
import React from "react";


import "./Header.css";

function Header() {
  return (
    <div>
      
      <header>
        <nav>
          {/* { <h1>UNIVERSAL Infomatics</h1> } */}
            <ul>
                <li><Link to ="/Home">Home</Link></li>
                <li><Link to="#">Internship</Link></li>
                <li><a href="#">Courses offer</a></li>
                <li><Link to = "/Register">Register</Link></li>
                <li><Link to = "/Login">Login</Link></li>
            </ul>
        </nav>
    </header>
    </div>
  );
}

export default Header;