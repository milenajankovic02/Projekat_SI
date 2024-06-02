import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './strane.css'

function ZakaziCas() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // Fetch subjects from the backend
    axios.get('http://localhost:8082/zakazi')
      .then(response => {
        setSubjects(response.data);
      })
      .catch(error => {
        console.error('Greska sa preuzimanjem predmeta.', error);
      });
  }, []);

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <div className='prvidivic'>
      <h1>Izaberite predmet:</h1>
      <select onChange={e => setSelectedSubject(e.target.value)} value={selectedSubject}>
        <option value="" disabled>Izaberite predmet</option>
        {subjects.map((subject, index) => (
          <option key={index} value={subject.naziv}>{subject.naziv}</option>
        ))}
      </select>
      <button onClick={handleConfirm}>Potvrdi</button>

      {confirmed && (
        <div>
          <h2>You selected: {selectedSubject}</h2>
          {/* Implement additional content based on selected subject */}
          <p>Here you can add more details or functionality related to the selected subject.</p>
        </div>
      )}
    </div>
  );
}

export default ZakaziCas;