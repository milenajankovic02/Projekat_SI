import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Biblioteka.css';
import book from '../slike/book1.png'

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

const BibliotekaUser = () => {
    const [fajlovi, setFajlovi] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filterTerm, setFilterTerm] = useState('');
    const [isFiltering, setIsFiltering] = useState(false);
    const [predmeti, setPredmeti] = useState([]);
    const [user, setUser] = useState(null);
    const [isUploadFormVisible, setIsUploadFormVisible] = useState(false);
    const [newFile, setNewFile] = useState({ ime: '', predmet: '', opis: '', file: null });
  
    useEffect(() => {
      const fetchFajlovi = async () => {
        try {
          const res = await axios.get("http://localhost:8082/biblioteka");
          setFajlovi(res.data);
        } catch (error) {
          console.log(error);
        }
      };
  
      const fetchPredmeti = async () => {
        try {
          const res = await axios.get("http://localhost:8082/predmeti");
          setPredmeti(res.data);
        } catch (error) {
          console.log(error);
        }
      };

      const checkLoginStatus = () => {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setUser(decodedToken.role);
        }
      };
    
      fetchFajlovi();
      fetchPredmeti();
      checkLoginStatus();
    }, []);

    const handleDelete = async (id) => {
        try {
          await axios.delete(`http://localhost:8082/delete/${id}`);
          setFajlovi(prevFajlovi => prevFajlovi.filter(fajl => fajl.id !== id));
        } catch (error) {
          console.log('Greška prilikom brisanja fajla:', error);
        }
      };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const token = localStorage.getItem('token');
        const email = getEmailFromToken(token);
        const id = await getIdFromEmail(email);
        formData.append('file', newFile.file);
        formData.append('ime', newFile.ime);
        formData.append('predmet', newFile.predmet);
        formData.append('opis', newFile.opis);
        formData.append('korisnik_id', id);
    
        try {
          await axios.post('http://localhost:8082/upload', formData);
          setIsUploadFormVisible(false);
          const res = await axios.get("http://localhost:8082/biblioteka");
          setFajlovi(res.data);
        } catch (error) {
          console.log('Greška prilikom upload-a fajla:', error);
        }
    };
  
    const filteredFajlovi = fajlovi.filter(fajl => {
        const matchesSearchTerm = isSearching ? fajl.ime.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        const matchesFilterTerm = isFiltering ? fajl.predmet.toLowerCase() === filterTerm.toLowerCase() : true;
        return matchesSearchTerm && matchesFilterTerm;
    });
  
    return (
      <div className="app-bib">
        <div className="header-bib">
          <img src={book} className="book-img" alt="book" />
          <input
          type="text"
          placeholder="Pretražite fajl po nazivu..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearching(true);
          }}
          />
          <select
          value={filterTerm}
          onChange={(e) => {
            setFilterTerm(e.target.value);
            setIsFiltering(true);
          }}
          >
          <option value="">Svi predmeti</option>
          {predmeti.map((predmet, index) => (
            <option key={index} value={predmet}>
              {predmet}
            </option>
          ))}
        </select>
        {user && (
          <button className="upload-button" onClick={() => setIsUploadFormVisible(true)}>
            Objavite fajl
          </button>
        )}
      </div>

      {isUploadFormVisible && (
        <div className="upload-form">
          <h2>Objavite fajl</h2>
          <form onSubmit={handleUpload} encType="multipart/form-data">
            <input
              type="text"
              placeholder="Ime fajla"
              value={newFile.ime}
              onChange={(e) => setNewFile({ ...newFile, ime: e.target.value })}
              required
            />
            <textarea
              placeholder="Opis fajla"
              value={newFile.opis}
              onChange={(e) => setNewFile({ ...newFile, opis: e.target.value })}
              required
            ></textarea>
            <select
              value={newFile.predmet}
              onChange={(e) => setNewFile({ ...newFile, predmet: e.target.value })}
              required
            >
              <option value="">Odaberite predmet</option>
              {predmeti.map((predmet, index) => (
                <option key={index} value={predmet}>
                  {predmet}
                </option>
              ))}
            </select>
            <input
              type="file"
              onChange={(e) => setNewFile({ ...newFile, file: e.target.files[0] })}
              required
            />
            <button className='upload_dugme' type="submit">Objavite fajl</button>
          </form>
          <button className='cancel_dugme' onClick={() => setIsUploadFormVisible(false)}>Otkažite</button>
        </div>
      )}


      <div className="file-cards">
        {filteredFajlovi.map((fajl) => (
          <div className="file-card" key={fajl.id}>
            <h3>{fajl.ime}</h3>
            <p>Predmet: {fajl.predmet}</p>
            <p>Korisnik ID: {fajl.korisnik_id}</p>
            <button className='preuzimanje' onClick={() => window.open(`http://localhost:8082/download/${fajl.id}`, '_blank')}>
              Preuzmite fajl
            </button>
            {user === 'admin' && (
              <button className='brisanje' onClick={() => handleDelete(fajl.id)}>
                Obriši fajl
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
    );
};

export default BibliotekaUser;