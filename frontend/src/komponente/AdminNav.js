import React from 'react';
import '../strane/Pocetna.css'
import { HashLink as Link } from 'react-router-hash-link'
import logo from '../slike/logo.png'

const AdminNav = () => {
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
        <Link to="/biblioteka" onClick={handleLinkClick}>Biblioteka</Link>
        <Link to="/zakazaniCasovi" onClick={handleLinkClick}>Zakazani časovi</Link>
        <Link to="/profesors" onClick={handleLinkClick}>Pregledaj profesore</Link>
        <Link to="/students" onClick={handleLinkClick}>Pregledaj studente</Link>
        <Link to="/logout" onClick={handleLinkClick}>Odjavi se</Link>
      </nav>
      <input type="checkbox" id="toggler" />
      <label htmlFor="toggler" className="fas fa-bars"></label>
      
    </header>
  );
}

export default AdminNav;
