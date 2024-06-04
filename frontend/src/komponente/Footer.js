import React from 'react';
import '../strane/Pocetna.css'

function Footer() {
  return (
    <section className="footer">
      <div className="box-container">
        <div className="box">
          <h3>Brzi linkovi</h3>
          <a href="/#pocetna">Početna</a>
          <a href="/#about">O nama</a>
          <a href="/biblioteka">Biblioteka</a>
        </div>
        <div className="box">
          <h3>Kontakt</h3>
          <a href="/#kontakt">+382-69-356-276</a>
          <a href="/#kontakt">all.a.business.mne@gmail.com</a>
          <a href="/#kontakt">Podgorica, Crna Gora, 81 000</a>
        </div>
      </div>
      <div className="credit">
        Napravljeno od strane <span>All A's</span> 
      </div>
    </section>
  );
}

export default Footer;
