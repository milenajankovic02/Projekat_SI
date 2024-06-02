import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Profesors = () => {
  const [profesori, setProfesori] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfesori = async () => {
      try {
        const res = await axios.get("http://localhost:8082/profesori");
        setProfesori(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfesori();
  }, []);

  const handleDelete = async (email) => {
    try {
      await axios.delete(`http://localhost:8082/profesori/${email}`);
      alert('Uspješno obrisan profesor iz baze.');
      window.location.reload();
      navigate('/profesori');
    } catch (error) {
      console.log(error);
      alert('Greška prilikom brisanja profesora iz baze.');
    }
  };

  const filteredProfesori = profesori.filter(profesor => {
    return isSearching ? profesor.ime.toLowerCase().includes(searchTerm.toLowerCase()) || profesor.prezime.toLowerCase().includes(searchTerm.toLowerCase()) : true;
  });

  return (
    <div className='s'>
      <h1>Upravljanje profesorima</h1>
      
      <input
        type="text"
        placeholder="Pretražite profesore po imenu ili prezimenu..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsSearching(true);
        }}
      />

      <div className='profesori'>
        <button className='addHome'><Link to="/add">Dodaj profesora</Link></button>
      </div>

      <div className='profesori'>
        {filteredProfesori.map(profesor => (
          <div className='profesor' key={profesor.email}>
            <h2> {profesor.ime} {profesor.prezime} </h2>
            <p> Adresa: {profesor.adresa} </p>
            <p> Grad: {profesor.grad} </p>
            <p> Telefon: {profesor.tel} </p>
            <p> Email: {profesor.email} </p>
            <p> Nivo: {profesor.nivo} </p>
            <p> Predmeti:</p>
            <ul>
              {profesor.predmeti && profesor.predmeti.map(predmet => (
                <li key={predmet.naziv}>{predmet.naziv} - {predmet.cijena} €</li>
              ))}
            </ul>

            <button className='crudBtn' onClick={() => handleDelete(profesor.email)}>Obriši profesora</button>
            <Link to={`/update/${profesor.email}`} className='updateLink'> Uredi podatke</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profesors;
