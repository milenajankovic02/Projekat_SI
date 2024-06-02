import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchProf = () => {
  const [professors, setProfessors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const res = await axios.get("http://localhost:8082/profesori");
        setProfessors(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfessors();
  }, []);

  const filteredProfessors = professors.filter(professor => {
    return isSearching ? professor.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professor.prezime.toLowerCase().includes(searchTerm.toLowerCase()) : true;
  });

  return (
    <div className='s'>
      <h1>Pretraga profesora</h1>
      
      {/* Search bar */}
      <input
        type="text"
        placeholder="Pretražite profesore po imenu ili prezimenu..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsSearching(true);
        }}
      />

      {/* Prikaz svih profesora iz baze */}
      <div className='profesori'>
        {filteredProfessors.map(professor => (
          <div className='profesor' key={professor.email}>
            <h2> {professor.ime} {professor.prezime} </h2>
            <p> Grad: {professor.grad} </p>
            <p> Telefon: {professor.tel} </p>
            <p> Email: {professor.email} </p>
            <p> Nivo: {professor.nivo} </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchProf;
