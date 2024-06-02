import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ulogovanje.css'

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    lozinka: '',
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
        ...prevValues,
        [name]: value
      }));
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) { 
      axios.post('http://localhost:8082/login', values)
        .then(res => {
          if (res.data.token) { 
            localStorage.setItem('token', res.data.token);
            alert("Ulogovani ste na na All A's sajt!");
            navigate('/');
            window.location.reload();
          } else {
            alert(res.data);
            navigate('/'); 
          }
        })
        .catch(err => console.log(err));
    }
  };


  return (
    <div className="prvidiv">
      <div className="drugidiv">
        <h2>Prijavi se</h2>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <label htmlFor="email"><strong>Email</strong></label>
            <input 
              type="email" 
              placeholder="youremail@gmail.com" 
              name="email"
              value={values.email}
              onChange={handleChange} 
              className="input"
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="form">
            <label htmlFor="lozinka" className='label'><strong>Lozinka</strong></label>
            <div className="password-container">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="********"
                name="lozinka"
                value={values.lozinka}
                onChange={handleChange}
                required
                className="input password-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password-visibility"
              >
                {passwordVisible ? <FaEyeSlash/> : <FaEye/>}
              </button>
              {errors.lozinka && <span>{errors.lozinka}<br/></span>}
            </div>
          </div>
          <div className="remember-me">
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe" className="remember-me-label">Zapamti me</label>
          </div>
          <button type="submit" className="button">Prijavi se</button>
          <p>Slažeš se sa našim uslovima i politikom. </p>
          <Link to="/signup" className="ahref-el">Nemaš nalog? Registruj se</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
