import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProfesor = () => {
  const [profesor, setProfesor] = useState({});
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    grad: '',
    adresa: '',
    tel: '',
    email: '',
    nivo: '',
  });
  const [gradovi, setGradovi] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  const [selectedPredmeti, setSelectedPredmeti] = useState([]);
  const [selectedPredmet, setSelectedPredmet] = useState({
    naziv: '',
    cijena: ''
  });

  const navigate = useNavigate();
  const { email } = useParams();

  useEffect(() => {
    const fetchProfesor = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/profesori/${email}`);
        setProfesor(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Greška prilikom dohvatanja podataka o profesoru:', error);
      }
    };

    const fetchGradovi = async () => {
      try {
        const gradoviResponse = await axios.get('http://localhost:8082/gradovi');
        setGradovi(gradoviResponse.data);
      } catch (error) {
        console.error('Greška prilikom dohvatanja gradova:', error);
      }
    };

    const fetchPredmeti = async () => {
      try {
        const predmetiResponse = await axios.get('http://localhost:8082/predmeti');
        setPredmeti(predmetiResponse.data);
      } catch (error) {
        console.error('Greška prilikom dohvatanja predmeta:', error);
      }
    };

    fetchProfesor();
    fetchGradovi();
    fetchPredmeti();
  }, [email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredmetiChange = (index, field, value) => {
    setSelectedPredmeti(prevPredmeti => {
      const updatedPredmeti = [...prevPredmeti];
      updatedPredmeti[index][field] = value;
      return updatedPredmeti;
    });
  };

  const handleAddPredmet = () => {
    setSelectedPredmeti(prevPredmeti => ([...prevPredmeti, { naziv: '', cijena: '' }]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8082/profesori/${email}`, formData);
      alert('Podaci o profesoru su uspješno ažurirani!');
      navigate('/profesori');
    } catch (error) {
      console.error('Greška prilikom ažuriranja podataka o profesoru:', error);
      alert('Došlo je do greške prilikom ažuriranja podataka o profesoru.');
    }
  };

  const handleAddNewPredmet = async () => {
    try {
      const predmetData = {
        profesor: profesor.email, // Prilagođeno za slanje email-a profesora
        predmeti: selectedPredmeti // Koristimo stanje odabranih predmeta
      };

      const response = await axios.post(`http://localhost:8082/profesor_predmet`, predmetData);
      if (response.status === 200) {
        alert('Predmet uspješno dodan profesoru!');
        setSelectedPredmet({ naziv: '', cijena: '' });
      } else {
        alert('Došlo je do greške prilikom dodavanja predmeta profesoru.');
      }
    } catch (error) {
      console.error('Greška prilikom dodavanja predmeta profesoru:', error);
      alert('Došlo je do greške prilikom dodavanja predmeta profesoru.');
    }
  };

  return (
    <div>
      <h2>Ažuriraj podatke o profesoru: {profesor.ime} {profesor.prezime}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Ime" 
          name="ime"
          value={formData.ime} 
          required
          onChange={handleChange}
        />
        <input 
          type="text" 
          placeholder="Prezime" 
          name="prezime"
          value={formData.prezime} 
          required
          onChange={handleChange}
        />
        <select 
          value={formData.grad} 
          name="grad"
          required
          onChange={handleChange}>
          <option value="">Odaberi grad</option>
          {gradovi.map(grad => (
            <option key={grad} value={grad}>{grad}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Adresa" 
          name="adresa"
          value={formData.adresa} 
          required
          onChange={handleChange}
        />
        <input 
          type="text" 
          placeholder="Telefon" 
          name="tel"
          value={formData.tel} 
          required
          maxLength="9"
          onChange={handleChange}
        />
        <input 
          type="email" 
          placeholder="Email" 
          name="email"
          value={formData.email} 
          required
          disabled // Ne može se menjati jer je primarni ključ
          onChange={handleChange}
        />
        <select 
          value={formData.nivo} 
          name="nivo"
          required
          onChange={handleChange}>
          <option value="">Odaberi nivo</option>
          <option value="nizaosnovna">Niza osnovna škola</option>
          <option value="visaosnovna">Visa osnovna škola</option>
          <option value="nizasrednja">Niža srednja škola</option>
          <option value="visasrednja">Visa srednja škola</option>
        </select>
        <br/>
        <button type="submit">Ažuriraj Profesora</button>
      </form>
      <p>Napomena: Email profesora se ne može mijenjati jer je primarni ključ u bazi podataka.</p>

      {/* Dodaj predmet */}
      <div>
        <h3>Dodaj predmet:</h3>
        <button type="button" onClick={handleAddPredmet}>Dodaj predmet</button>
        {selectedPredmeti.map((predmet, index) => (
          <div key={index}>
            <select
              value={predmet.naziv}
              required
              onChange={(e) => handlePredmetiChange(index, 'naziv', e.target.value)}>
              <option value="">Odaberi predmet</option>
              {predmeti.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="Cijena" 
              value={predmet.cijena}
              required
              step="0.01"
              onChange={(e) => handlePredmetiChange(index, 'cijena', e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddNewPredmet}>
          Dodaj
        </button>
      </div>
    </div>
  );
};

export default UpdateProfesor;
