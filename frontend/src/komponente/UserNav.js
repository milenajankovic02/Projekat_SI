// UserNav.js
import React from 'react';
import { Link } from 'react-router-dom';

const UserNav = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Pocetna</Link></li>
        <Link to="/profile">Profil</Link>
        <li><Link to="/zakazi">Zakazi Cas</Link></li>
        <li><Link to="/logout">Logout</Link></li> {/* Dodaj logout link */}
      </ul>
    </nav>
  );
}

export default UserNav;
