import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Schedule.css';
import raspored from '../slike/raspored.png';


const generateAvailableSlots = () => {
  const availableSlots = [];
  const startHour = 8;
  const endHour = 20;

  for (let hour = startHour; hour < endHour; hour++) {
    const slot = `${hour.toString().padStart(2, '0')}:00`;
    availableSlots.push(slot);
  }

  return availableSlots;
};



const getEmailFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.email;
  } catch (error) {
    console.error('Greška prilikom dekodiranja tokena:', error);
    return null;
  }
};

const getIdFromEmail = async (email) => {
  try {
    const response = await axios.get('http://localhost:8082/korisnici/id', {
      params: {
        email: email
      }
    });
    console.log(response.data);
    return response.data.id;
  } catch (error) {
    console.error('Greška prilikom dohvatanja ID-a korisnika:', error);
    return null;
  }
};

const Schedule = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState(generateAvailableSlots());

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:8082/predmeti');
        setSubjects(response.data);
      } catch (error) {
        console.error('Greška prilikom dohvatanja predmeta:', error);
      }
    };

    

    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:8082/gradovi');
        setCities(response.data);
      } catch (error) {
        console.error('Greška prilikom dohvatanja gradova:', error);
      }
    };

    fetchSubjects();
    fetchCities();
  }, []);

  const handleSubjectChange = (subjectName) => {
    setSelectedSubject(subjectName);
    setProfessors([]);
    setSelectedProfessor('');
    setPrice('');
  };

  const handleCityChange = async (cityName) => {
    setSelectedCity(cityName);

    try {
      const response = await axios.get('http://localhost:8082/profesori/pretraga', {
        params: {
          predmet: selectedSubject,
          grad: cityName
        }
      });
      setProfessors(response.data);
      setSelectedProfessor('');
      setPrice('');
    } catch (error) {
      console.error('Greška prilikom dohvatanja profesora:', error);
    }
  };

  const handleProfessorChange = (professorEmail) => {
    const professor = professors.find(p => p.email === professorEmail);
    setSelectedProfessor(professorEmail);
    setPrice(professor ? professor.cijena : '');
  };

  const handleSubmit = async () => {
    try {
        const token = localStorage.getItem('token');
        const email = getEmailFromToken(token);
        const id = await getIdFromEmail(email);

        const response = await axios.post('http://localhost:8082/casovi', {
            korisnik: id,
            profesor: selectedProfessor,
            predmet: selectedSubject,
            datum: date,
            vrijeme: time
        });
        console.log('Zakazivanje uspješno:', response.data);
        alert('Uspješno zakazano!');
    } catch (error) {
        console.error('Greška prilikom zakazivanja časa:', error);
    }
  };

  


  return (
    <div className='zakazi_cas'>
      <div className='prov'>
      <div className='zakazi_div2'>
      <h2 className='zakazi_h2'> Zakazivanje časa</h2>
      <img src={raspored} className='slika_raspored' alt="raspored"/>
      </div>
      <div className='ocuapdding'>
      <label className='labels_s'>Odaberite predmet:</label>
      <select value={selectedSubject} onChange={(e) => handleSubjectChange(e.target.value)}>
      <option disabled hidden value="">
          Odaberite predmet
        </option>
        {subjects.map(subject => (
          <option key={subject} value={subject}>{subject}</option>
        ))}
      </select>
      </div>
      <div className='ocuapdding'>
      <label className='labels_s'>Odaberite grad:</label>
      <select value={selectedCity} onChange={(e) => handleCityChange(e.target.value)}>
        <option disabled hidden value="">
          Odaberite grad
        </option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      </div>
      <div className='ocuapdding'>
      <label className='labels_s'>Odaberite profesora:</label>
      <select value={selectedProfessor} onChange={(e) => handleProfessorChange(e.target.value)}>
      <option disabled hidden value="">
          Odaberite profesora
        </option>
        {professors.map(professor => (
          <option key={professor.email} value={professor.email}>{professor.ime} {professor.prezime}</option>
        ))}
      </select>
      </div>
      <div className='ocuapdding'>
      <label className='labels_s'>Cijena:</label>
      <input className='cijena' type="text" value={price} disabled />
      </div>
      <div className='ocuapdding'>
      <label className='labels_s'>Datum:</label>
      <input type="date" min={new Date().toISOString().split('T')[0]} value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className='ocuapdding'>
      <label className='labels_s'>Vrijeme:</label>
      <select value={time} onChange={(e) => setTime(e.target.value)}>
      <option disabled hidden value="">
          Odaberite vrijeme
        </option>
        {availableSlots.map(slot => (
          <option key={slot} value={slot}>{slot}</option>
        ))}
      </select>
      </div>
      <button className="dugme" onClick={handleSubmit}>Zakaži</button>
    </div>
    </div>
  );
};

export default Schedule;
