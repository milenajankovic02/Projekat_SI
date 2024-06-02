import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProf = () => {
  const [profesor, setProfesor] = useState({
    ime: '',
    prezime: '',
    grad: '',
    adresa: '',
    tel: '',
    email: '',
    nivo: '',
    predmeti: [],
    gradovi: [],
    sviPredmeti: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGradoviPredmeti = async () => {
      try {
        const gradoviResponse = await axios.get('http://localhost:8082/gradovi');
        const predmetiResponse = await axios.get('http://localhost:8082/predmeti');
        setProfesor(prevProfesor => ({
          ...prevProfesor,
          gradovi: gradoviResponse.data,
          sviPredmeti: predmetiResponse.data
        }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchGradoviPredmeti();
  }, []);

  const handlePredmetChange = (index, field, value) => {
    const updatedPredmeti = [...profesor.predmeti];
    updatedPredmeti[index][field] = value;
    setProfesor(prev => ({ ...prev, predmeti: updatedPredmeti }));
  };

  const handleAddPredmet = () => {
    setProfesor(prev => ({
      ...prev,
      predmeti: [...prev.predmeti, { naziv: '', cijena: '' }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8082/profesori', profesor);
  
      if (response.status === 200) {
        alert('Profesor uspješno dodat u bazu!');
        navigate('/profesori');
      } else {
        alert('Greška prilikom dodavanja profesora. Status:', response.status);
      }
    } catch (error) {
      alert('Greška prilikom slanja zahtjeva na server:', error.message);
    }
  };

  return (
    <div className="container">
      <h2>Dodaj novog profesora</h2>
      <div className='crudDiv'>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Ime" 
            value={profesor.ime} 
            required
            onChange={(e) => setProfesor(prev => ({ ...prev, ime: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder="Prezime" 
            value={profesor.prezime} 
            required
            onChange={(e) => setProfesor(prev => ({ ...prev, prezime: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder="Adresa" 
            value={profesor.adresa} 
            required
            onChange={(e) => setProfesor(prev => ({ ...prev, adresa: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder="Telefon" 
            value={profesor.tel} 
            required
            onChange={(e) => setProfesor(prev => ({ ...prev, tel: e.target.value }))}
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={profesor.email} 
            required
            onChange={(e) => setProfesor(prev => ({ ...prev, email: e.target.value }))}
          /> 
          <select 
            value={profesor.nivo} 
            required
            onChange={(e) => setProfesor(prev => ({ ...prev, nivo: e.target.value }))}>
              <option value="">Odaberi nivo</option>
              <option value="nizaosnovna">Niza osnovna škola</option>
              <option value="visaosnovna">Visa osnovna škola</option>
              <option value="nizasrednja">Niža srednja škola</option>
              <option value="visasrednja">Visa srednja škola</option>
          </select>
          <select 
            value={profesor.grad} 
            required
            onChange={(e) => setProfesor(prev => ({ ...prev, grad: e.target.value }))}>
            <option value="">Odaberi grad</option>
            {profesor.gradovi.map(grad => (
              <option key={grad} value={grad}>{grad}</option>
            ))}
          </select>
          <div>
            <h3>Dodaj predmete:</h3>
            {profesor.predmeti.map((predmet, index) => (
              <div key={index}>
                <select
                  value={predmet.naziv}
                  required
                  onChange={(e) => handlePredmetChange(index, 'naziv', e.target.value)}>
                  <option value="">Odaberi predmet</option>
                  {profesor.sviPredmeti.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  placeholder="Cijena" 
                  value={predmet.cijena}
                  required
                  onChange={(e) => handlePredmetChange(index, 'cijena', e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={handleAddPredmet}>Dodaj predmet</button>
          </div>
          <br/>
          <button type="submit">Dodaj profesora</button>
        </form>
      </div>
    </div>
  );
};

export default AddProf;
