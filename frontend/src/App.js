import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './komponente/Navbar';
import Footer from './komponente/Footer';
import Pocetna from './strane/Pocetna';
import Login from './komponente/Login';
import Signup from './komponente/Singup';
import AddProf from './komponente/AddProf';
import Schedule from './komponente/Schedule';
import UserNav from './komponente/UserNav';
import AdminNav from './komponente/AdminNav';
import './komponente/sve.css';
import Logout from './komponente/Logout';
import Profesors from './komponente/Profesors';
import Students from './komponente/Students';
import UpdateProfesor from './komponente/UpdateProfesor';
import { jwtDecode } from 'jwt-decode';
import ZakazaniCasovi from './komponente/ZakazaniCasovi';
import StudentProfile from './komponente/StudentProfile';
import SearchProf from './komponente/SearchProf';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken.role);
    }
  }, []);

  return (
    <div className="App">
      <Router>
        {user === 'admin' && <AdminNav />}
        {user === 'user' && <UserNav />}
        {user === null && <Navbar />}
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/add" element={<AddProf />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout setUser={setUser} />} />
          <Route path="/profesors" element={<Profesors />} />
          <Route path="/students" element={<Students/>}/>
          <Route path="/zakazi" element={<Schedule />} />
          <Route path="/update/:email" element={<UpdateProfesor />} />
          <Route path="/zakazaniCasovi" element={<ZakazaniCasovi/>}/>
          <Route path="/profile" element={<StudentProfile/>}/>
          <Route path="/search" element={<SearchProf/>}/>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
