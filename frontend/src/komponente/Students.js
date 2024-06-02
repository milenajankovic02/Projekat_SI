import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8082/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Greška prilikom preuzimanja studenata:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://localhost:8082/students/${studentId}`);
      setStudents(students.filter(student => student.id !== studentId));
    } catch (error) {
      console.error('Greška prilikom brisanja studenta:', error);
      alert('Greška prilikom brisanja studenta');
    }
  };

  const filteredStudents = students.filter(student =>
    student.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="students-container">
      <h1>Studenti</h1>
      <input
        type="text"
        placeholder="Pretraži studente..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <table className="students-table">
        <thead>
          <tr>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Email</th>
            <th>Nivo</th>
            <th>Upravljanje</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id}>
              <td>{student.ime}</td>
              <td>{student.prezime}</td>
              <td>{student.email}</td>
              <td>{student.nivo}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  Obriši
                </button>
                <h6>Napomena: brisanjem studenta brišu se i svi njegovi zakazani termini</h6>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
