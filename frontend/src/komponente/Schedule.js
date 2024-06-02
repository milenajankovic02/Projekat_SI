import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const generateAvailableSlots = () => {
  const availableSlots = [];
  const startHour = 8; // Početak radnog vremena
  const endHour = 20; // Kraj radnog vremena

  for (let hour = startHour; hour < endHour; hour++) {
    const slot = `${hour.toString().padStart(2, '0')}:00`; // Formatiramo sat kao HH:00
    availableSlots.push(slot);
  }

  return availableSlots;
};

const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Postavljamo vreme na ponoć kako bismo uporedili samo datume
  return date > today;
};

const getEmailFromToken = (token) => {
  try {
    const decoded = jwtDecode(token); // Koristimo ispravno ime funkcije
    return decoded.email; // Pretpostavljam da se email nalazi u payloadu tokena
  } catch (error) {
    console.error('Greška prilikom dekodiranja tokena:', error);
    return null;
  }
};

const Schedule = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [levels, setLevels] = useState(['Niza osnovna škola', 'Visa osnovna škola', 'Niža srednja škola', 'Visa srednja škola']);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:8082/predmeti');
        setSubjects(response.data);
      } catch (error) {
        console.error('Greška prilikom dohvatanja predmeta:', error);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    // Generisanje dostupnih termina i filtriranje nedelje i prošlih dana
    const slots = generateAvailableSlots().filter(slot => {
      const currentDate = new Date();
      const [hours] = slot.split(':');
      currentDate.setHours(hours); // Postavljamo trenutni sat kako bismo mogli da proverimo da li je danas
      return currentDate.getDay() !== 0 && isFutureDate(currentDate);
    });
    setAvailableSlots(slots);
  }, []);

  const handleSubjectChange = async (subjectName) => {
    setSelectedSubject(subjectName);
    try {
      const response = await axios.get(`http://localhost:8082/profesori/predmet/${subjectName}`);
      setProfessors(response.data);
      setSelectedProfessor(''); // Resetujemo izabrane profesore i cene kad promenimo predmet
      setPrice('');
    } catch (error) {
      console.error('Greška prilikom dohvatanja profesora za predmet:', error);
    }
  };

  const handleProfessorChange = (professorEmail) => {
    const professor = professors.find(professor => professor.email === professorEmail);
    setSelectedProfessor(professorEmail);
    setPrice(professor ? professor.cijena : '');
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token'); // Pretpostavljamo da je token sačuvan u localStorage
      const email = getEmailFromToken(token);

      // Slanje zahteva za zakazivanje časa na backend
      const response = await axios.post('http://localhost:8082/zakazani_casovi', {
        email,
        profesor: selectedProfessor,
        predmet: selectedSubject,
        cijena: price,
        datum: date,
        vrijeme: time
      });
      console.log('Zakazivanje uspješno:', response.data);
      alert('Uspješno zakazano!');
      // Dodatne akcije nakon uspešnog zakazivanja, na primer, redirekcija na stranicu sa potvrdom
    } catch (error) {
      console.error('Greška prilikom zakazivanja časa:', error);
    }
  };

  return (
    <div>
      <h2>Zakazivanje časa</h2>
      <label>Odaberite predmet:</label>
      <select value={selectedSubject} onChange={(e) => handleSubjectChange(e.target.value)}>
        <option value="">Odaberite predmet</option>
        {subjects.map(subject => (
          <option key={subject.naziv} value={subject.naziv}>{subject.naziv}</option>
        ))}
      </select>

      <label>Odaberite profesora:</label>
      <select value={selectedProfessor} onChange={(e) => handleProfessorChange(e.target.value)} disabled={!selectedSubject}>
        <option value="">Odaberite profesora</option>
        {professors.map(professor => (
          <option key={professor.email} value={professor.email}>{professor.ime} {professor.prezime}</option>
        ))}
      </select>

      <label>Odaberite nivo:</label>
      <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} disabled={!selectedProfessor}>
        <option value="">Odaberite nivo</option>
        {levels.map(level => (
          <option key={level} value={level}>{level}</option>
        ))}
      </select>

      <label>Cijena:</label>
      <input type="text" value={price} disabled />

      <label>Datum:</label>
      <input type="date" min={new Date().toISOString().split('T')[0]} value={date} onChange={(e) => setDate(e.target.value)} disabled={!selectedProfessor} />

      <label>Vreme:</label>
      <select value={time} onChange={(e) => setTime(e.target.value)} disabled={!selectedProfessor}>
        <option value="">Odaberite vreme</option>
        {availableSlots.map(slot => (
          <option key={slot} value={slot}>{slot}</option>
        ))}
      </select>

      <button onClick={handleSubmit} disabled={!selectedProfessor || !date || !time}>Zakaži</button>
    </div>
  );
};

export default Schedule;
