import React from 'react';
import '../strane/Pocetna.css'
import { HashLink as Link } from 'react-router-hash-link'
function Navbar() {
  return (
    <header>
      <input type="checkbox" id="toggler" />
      <label htmlFor="toggler" className="fas fa-bars"></label>
      <a href="#" className="logo">All A's<span>.</span></a>
      <nav className="navbar">
        <Link to="/#pocetna">Početna</Link>
        <Link to="/#about">O nama</Link>
        <Link to="/#kontakt">Kontakt</Link>
        <Link to="/login">Prijavi se</Link>
        <Link to="/signup">Registruj se</Link>
      </nav>
      <div className="icons">
        <a href="/" className="fa-solid fa-pen"></a>
        <a href="/" className="fa-solid fa-pen"></a>
        <a href="/" className="fa-solid fa-pen"></a>
      </div>
    </header>
  );
}

export default Navbar;
