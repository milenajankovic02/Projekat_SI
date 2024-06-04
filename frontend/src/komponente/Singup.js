import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ulogovanje.css'

function Signup() {
    const [values, setValues] = useState({
        ime: '',
        prezime: '',
        email: '',
        lozinka: '',
        nivo: '' 
        //uloga se odredjuje u serveru
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const res = await axios.post('http://localhost:8082/signup', {
                    ime: values.ime,
                    prezime: values.prezime,
                    email: values.email,
                    lozinka: values.lozinka,
                    nivo: values.nivo 
                });
                alert('Korisnik uspješno kreiran!');
                navigate('/');
            } catch (err) {
                console.error("Greška prilikom dodavanja korisnika: ", err);
                alert('Greška prilikom kreiranja korisnika. Pokušajte ponovo.', err);
            }
        }
    };

    return (
        <div className="prvidiv_s">
            <div className="drugidiv_s">
                <h2>Registruj se</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form">
                        <label htmlFor="ime" className="label"><strong>Ime</strong></label>
                        <input 
                            type="text" 
                            placeholder="Unesite vaše ime" 
                            name="ime"
                            value={values.ime} 
                            onChange={handleChange} 
                            className="input" 
                            required
                        />
                        {errors.ime && <span>{errors.ime}<br /></span>}
                    </div>
                    <div className="form">
                        <label htmlFor="prezime" className="label"><strong>Prezime</strong></label>
                        <input 
                            type="text" 
                            placeholder="Unesite vaše prezime" 
                            name="prezime"
                            value={values.prezime} 
                            onChange={handleChange} 
                            className="input" 
                            required
                        />
                        {errors.prezime && <span>{errors.prezime}<br /></span>}
                    </div>
                    <div className="form">
                        <label htmlFor="email" className="label"><strong>Email</strong></label>
                        <input 
                            type="email" 
                            placeholder="youremail@gmail.com"
                            name="email"
                            value={values.email}
                            onChange={handleChange} 
                            className="input"
                        />
                        {errors.email && <span>{errors.email}<br /></span>}
                    </div>
                    <div className="form">
                        <label htmlFor="lozinka" className="label"><strong>Lozinka</strong></label>
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
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {errors.lozinka && <span>{errors.lozinka}<br /></span>}                    
                        </div>
                    </div>
                    <div className="form">
                        <label htmlFor="nivo" className="label"><strong>Nivo</strong></label>
                        <select name="nivo" onChange={handleChange} className="input">
                            <option value="">Odaberite...</option>
                            <option value="nizaosnovna">Niza osnovna škola</option>
                            <option value="visaosnovna">Visa osnovna škola</option>
                            <option value="nizasrednja">Niža srednja škola</option>
                            <option value="visasrednja">Visa srednja škola</option>

                        </select>
                        {errors.nivo && <span>{errors.nivo}<br /></span>}
                    </div>
                    <div className="remember-me">
                        <input 
                            type="checkbox" 
                            id="rememberMe" 
                        />
                        <label htmlFor="rememberMe" className="remember-me-label">Zapamti me</label>
                    </div>
                    <button type="submit" className="button">
                        Registruj se
                    </button>
                    <p>Prihvatam uslove i politiku korišćenja. </p>
                    <Link to="/login" className="ahref-el">Već imaš nalog? Prijavi se</Link> <br></br>
                    <Link to="/" className='ahref-el-pocetna'>Nazad na početnu stranicu</Link>
                </form>
            </div>
        </div>
    );
}

export default Signup;
