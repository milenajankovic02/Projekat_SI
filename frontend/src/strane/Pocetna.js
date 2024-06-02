import React, { useState } from 'react';
import axios from 'axios';
import './Pocetna.css';

const Pocetna = () => {
  const [contact, setContact] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  //ovo ne radi nisam napravila ne umijem
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8082/send-email', contact);
      if (response.status === 200) {
        alert('Email uspešno poslat!');
        setContact({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Greška prilikom slanja emaila:', error);
      alert('Došlo je do greške prilikom slanja emaila.');
    }
  };

  return (
    <div>
      <section className="pocetna" id="pocetna">
        <div className="sadrzaj">
          <h3>All A's</h3>
          <span>Vaš uspijeh je naš prioritet!</span>
          <p>Unaprijedi proces učenja!</p>
          <a href="pridruzise" className="btn">Pridruži nam se!</a>
        </div>
      </section>
      <section className="about" id="about">
        <h1 className="heading"><span>O</span> nama</h1>
        <div className="row">
          <div className="content">
            <h3>Zašto izabrati nas?</h3>
            <p>Dobrodošli u našu aplikaciju za zakazivanje časova! Posvećeni smo tome da korisnicima omogućimo što brže i lakše povezivanje sa profesorima za zakazivanje časova i pristup obrazovnim materijalima.
            Naša platforma je dizajnirana da pojednostavi proces pronalaženja pravog tutora, zakazivanja termina, i obezbeđivanja svih resursa potrebnih za vaš akademski uspeh.</p>
            <p>Bilo da ste student koji traži dodatnu pomoć u učenju ili profesor koji nudi usluge podučavanja, naša aplikacija pruža korisnički pristupačan interfejs koji zadovoljava vaše potrebe. Prioritet nam je efikasnost i pristupačnost, kako biste mogli da pronađete pravog tutora i zakažete svoje termine uz samo nekoliko klikova.</p>
            <a href="#" className="btn">Saznajte više</a>
          </div>
        </div>
      </section>
      <section className="contact" id="kontakt">
        <h1 className="heading"><span>Kontaktirajte</span> nas</h1>
        <div className="row">
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" className="box" placeholder="Ime" value={contact.name} onChange={handleChange} />
            <input type="email" name="email" className="box" placeholder="Email" value={contact.email} onChange={handleChange} />
            <textarea name="message" className="box" placeholder="Poruka" value={contact.message} onChange={handleChange} cols="30" rows="10"></textarea>
            <input type="submit" value="Pošalji poruku" className="btn" />
          </form>
          <div className="image">
            <img src="/images/contact-img.svg" alt="" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pocetna;
