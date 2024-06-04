import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ZakazaniCasovi.css';

const ZakazaniCasovi = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8082/casovi');
        setBookings(response.data);
      } catch (error) {
        console.error('Greška prilikom dohvatanja zakazanih časova:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8082/casovi/${id}`);
      console.log('Čas uspješno otkazan:', response.data);
      setBookings(bookings.filter(booking => booking.id !== id));
    } catch (error) {
      console.error('Greška prilikom otkazivanja časa:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('sr-RS', options);
  };

  return (
    <div>
      <h2 className='pgbgpg'>Zakazani časovi</h2>
      <table>
        <thead>
          <tr>
            <th className='tab'>Učenik</th>
            <th className='tab'>Profesor</th>
            <th className='tab'>Predmet</th>
            <th className='tab'>Datum</th>
            <th className='tab'>Vrijeme</th>
            <th className='tab'></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.id}>
              <td>{booking.korisnik}</td>
              <td>{booking.profesor}</td>
              <td>{booking.predmet}</td>
              <td>{formatDate(booking.datum)}</td>
              <td>{booking.vrijeme}</td>
              <td>
                <button className='dugme_tab'onClick={() => handleCancel(booking.id)}>Otkazi</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ZakazaniCasovi;
