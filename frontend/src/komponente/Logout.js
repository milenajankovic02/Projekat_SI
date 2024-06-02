// Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Ukloni token iz localStorage
    localStorage.removeItem('token');
    setUser(null);
    // Redirektuj korisnika na početnu stranicu
    navigate('/');
  }, [navigate, setUser]);

  return null;
};

export default Logout;
