// Profile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const StudentProfile = ({ onClose }) => {
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userEmail = decodedToken.email;
        setUserEmail(userEmail);

        const response = await axios.post('http://localhost:8082/get-user-info', { email: userEmail });
        setUserData(response.data);

        const bookingsResponse = await axios.post('http://localhost:8082/user-classes', { email: userEmail });
        setUserBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Greška prilikom dohvatanja podataka:', error);
      }
    };

    getUserInfo();
  }, []);

  const handleCancel = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8082/classes/${id}`);
      console.log('Čas uspješno otkazan:', response.data);
      setUserBookings(userBookings.filter(booking => booking.id !== id));
    } catch (error) {
      console.error('Greška prilikom otkazivanja časa:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('sr-RS', options);
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h1>Korisnik</h1>
        {userData ? (
          <div className="user-info">
            <span className='tag'>Ime: {userData.ime}</span>
            <span className='tag'>Prezime: {userData.prezime}</span>
            <span className='tag'>Email: {userEmail}</span>
          </div>
        ) : (
          <p>Dohvatanje podataka o korisniku...</p>
        )}

        <h2>Moji zakazani časovi</h2>
        {userBookings.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Profesor</th>
                <th>Predmet</th>
                <th>Datum</th>
                <th>Vrijeme</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {userBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.profesor}</td>
                  <td>{booking.predmet}</td>
                  <td>{formatDate(booking.datum)}</td>
                  <td>{booking.vrijeme}</td>
                  <td>
                    <button onClick={() => handleCancel(booking.id)}>Otkazi</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nema zakazanih časova.</p>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
