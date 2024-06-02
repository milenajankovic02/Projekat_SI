import React from 'react';
import './Pocetna.css'
function Pocetna() {
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
          <form action="">
            <input type="text" className="box" placeholder="Ime" />
            <input type="email" className="box" placeholder="Email"/>
            <textarea name="" className="box" placeholder="Poruka" id="" cols="30" rows="10"></textarea>
            <input type="submit" value="Pošalji poruku" className="btn" />
          </form>
          <div className="image">
            <img src="/images/contact-img.svg" alt="" />
          </div>
        </div>
    </section>
    </div>
  );
}

export default Pocetna;