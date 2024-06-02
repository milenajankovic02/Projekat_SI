import React from 'react';
import '../strane/Pocetna.css'

function Footer() {
  return (
    <section className="footer">
      <div className="box-container">
        <div className="box">
          <h3>Brzi linkovi</h3>
          <a href="#">Početna</a>
          <a href="#">O nama</a>
          <a href="#">Zakazani časovi</a>
          <a href="#">Kontakt</a>
        </div>
        <div className="box">
          <h3>Dodatni linkovi</h3>
          <a href="#">Moj profil</a>
          <a href="#">Moji časovi</a>
        </div>
        <div className="box">
          <h3>Kontakt</h3>
          <a href="#">+381-69-356-276</a>
          <a href="#">allas@gmail.com</a>
          <a href="#">Podgorica, Crna Gora, 81 000</a>
        </div>
        <div className="box">
          <h3>Lokacija</h3>
          <a href="#">Nzm sto odje da stavim</a>
        </div>
      </div>
      <div className="credit">
        Napravljeno od strane <span>All A's</span> 
      </div>
    </section>
  );
}

export default Footer;
