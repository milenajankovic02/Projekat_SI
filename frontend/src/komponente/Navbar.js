import React from 'react';
import '../strane/Pocetna.css'
import { HashLink as Link } from 'react-router-hash-link'
import logo from '../slike/logo.png'

function Navbar() {
  const handleLinkClick = () => {
    document.getElementById('toggler').checked = false;
  };

  return (
    <header>
      <div className="navdiv1">
      <img src={logo} className="logo-app" alt="logo" />
      <a href="#" className="logo">All A's<span>.</span></a>
      </div>
      <nav className="navbar">
        <Link to="/#pocetna" onClick={handleLinkClick}>Početna</Link>
        <Link to="/#about" onClick={handleLinkClick}>O nama</Link>
        <Link to="/#kontakt" onClick={handleLinkClick}>Kontakt</Link>
        <Link to="/biblioteka" onClick={handleLinkClick}>Biblioteka</Link>
        <Link to="/login" onClick={handleLinkClick}>Prijavi se</Link>
        <Link to="/signup" onClick={handleLinkClick}>Registruj se</Link>
        <Link to="/chatbot" onClick={handleLinkClick}>AI asistent</Link>
      </nav>
      <input type="checkbox" id="toggler" />
      <label htmlFor="toggler" className="fas fa-bars"></label>
    </header>
  );
}

export default Navbar;
