import React from 'react';
import '../strane/Pocetna.css'
import { HashLink as Link } from 'react-router-hash-link'
import logo from '../slike/logo.png'

function UserNav() {
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
        <Link to="/#kontakt" onClick={handleLinkClick}>Kontakt</Link>
        <Link to="/biblioteka" onClick={handleLinkClick}>Biblioteka</Link>
        <Link to="/zakazi" onClick={handleLinkClick}>Zakaži čas</Link>
        <Link to="/search" onClick={handleLinkClick}>Pretraži profesore</Link>
        <Link to="/profile" onClick={handleLinkClick}>Profil</Link>
        <Link to="/chatbot" onClick={handleLinkClick}>AI asistent</Link>
        <Link to="/logout" onClick={handleLinkClick}>Odjavi se</Link>
      </nav>
      <input type="checkbox" id="toggler" />
      <label htmlFor="toggler" className="fas fa-bars"></label>
    </header>
  );
}

export default UserNav;
