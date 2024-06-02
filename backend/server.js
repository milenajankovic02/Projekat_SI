const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Import jwt

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "all_a"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to database.");
});

app.post('/signup', async (req, res) => {
    try {
      const q = "INSERT INTO korisnici (`ime`, `prezime`, `email`, `lozinka`, `uloga`, `nivo`) VALUES (?, ?, ?, ?, ?, ?)";
  
      const values = [
        req.body.ime,
        req.body.prezime,
        req.body.email,
        req.body.lozinka, // Koristimo nesheširanu lozinku
        req.body.email === 'jankovicmilena33@gmail.com' ? 'admin' : 'user',
        req.body.nivo
    ];
  
      db.query(q, values, (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Greška prilikom čuvanja korisnika." });
        }
        return res.json({ message: "Korisnik uspješno dodat." });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
});
  
app.post('/login', (req, res) => {
    const { email, lozinka } = req.body; //ono sto se unosi
  const q = "SELECT * FROM korisnici WHERE email = ?";

  db.query(q, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Greška prilikom pretraživanja baze.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Pogrešan email ili lozinka.' });
    }

    const user = results[0];

    // Uporedi nesheširanu lozinku
    if (lozinka !== user.lozinka) {
      return res.status(400).json({ error: 'Pogrešan email ili lozinka.' });
    }

    // Generiši JWT token
    const token = jwt.sign({ email: user.email, role: user.uloga }, 'tajna_tajna_tajna', { expiresIn: '1h' });
    res.json({ token });
  });
});

// Dodavanje profesora
app.post('/profesori', (req, res) => {
    const { ime, prezime, grad, adresa, tel, email, nivo, predmeti } = req.body;
    
    const q = "INSERT INTO profesori (ime, prezime, grad, adresa, tel, email, nivo) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [ime, prezime, grad, adresa, tel, email, nivo];

    db.query(q, values, (err, result) => {
        if (err) {
            console.error('Greška prilikom dodavanja profesora:', err);
            return res.status(500).json({ error: 'Greška prilikom dodavanja profesora' });
        }
        res.status(200).json({ message: 'Profesor uspješno dodat', profesorEmail: result.insertEmail });
    });
});
  
//Dodavanje u profesor_predmet
app.post('/profesor_predmet', (req, res) => {
    const { profesor, predmeti } = req.body; //predajemo email profesora i naziv predmeta
  
    const query = "INSERT INTO profesor_predmet (profesor, predmet, cijena) VALUES ?";
    const values = predmeti.map(predmet => [profesor, predmet.naziv, predmet.cijena]);
  
    db.query(query, [values], (err) => {
        if (err) {
            console.error('Greška prilikom unošenja predmeta: ', err);
            return res.status(500).json({ error: 'Greška prilikom unošenja predmeta.' });
        }
        res.status(200).json({ message: 'Predmeti uspješno dodati.' });
    });
  });
  
// Prikaz profesora
app.get('/profesori', (req, res) => {
    const query = "SELECT * FROM profesori";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Greška pri dohvatanju profesora: ', err);
            return res.status(500).json({ error: 'Greška pri dohvatanju profesora.' });
        }
        console.log('Rezultati iz baze:', results);
        res.json(results);
    });
});

//Prikaz profesor_predmet
app.get('/profesor_predmet', (req, res) => {
    const query = "SELECT * FROM profesor_predmet";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Greška pri dohvatanju predmeta: ', err);
            return res.status(500).json({ error: 'Greška pri dohvatanju predmeta.' });
        }
        res.json(results);
    });
  });

// Azuriranje profesora
app.put('/profesori/:email', (req, res) => {
    const { email } = req.params;
    const { ime, prezime, grad, adresa, tel, nivo } = req.body;
  
    const query = "UPDATE profesori SET ime = ?, prezime = ?, grad = ?, adresa = ?, tel = ?, nivo = ? WHERE email = ?";
    const values = [ime, prezime, grad, adresa, tel, nivo, email];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Greška prilikom ažuriranja podataka o profesoru: ', err);
        return res.status(500).json({ error: 'Greška prilikom ažuriranja podataka o profesoru.' });
      }
      res.status(200).json({ message: 'Podaci o profesoru uspješno ažurirani' });
    });
  });
  

// Brisanje profesora
app.delete('/profesori/:email', (req, res) => {
    const email = req.params.email;
    const q = "DELETE FROM profesori WHERE email = ?";
    
    db.query(q, [email], (err, result) => {
      if (err) {
        console.error('Greška prilikom brisanja profesora:', err);
        return res.status(500).json({ error: 'Greška prilikom brisanja profesora' });
      }
      return res.json({ message: 'Profesor uspješno obrisan.' });
    });
});

// Brisanje profesor_predmet
app.delete('/profesor_predmet/:id', (req, res) => {
    const { id } = req.params;
  
    const query = "DELETE FROM salon_usluga WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Greška prilikom brisanja predmeta iz profesor_predmet: ', err);
        return res.status(500).json({ error: 'Greška prilikom brisanja predmeta iz profesor_predmet.' });
      }
      res.status(200).json({ message: 'Usluga uspješno obrisana iz profesor_predmet.' });
    });
  });
  
// Dohvatanje pojedinacnog profesora (koristimo u updateProfesor)
app.get('/profesori/:email', (req, res) => {
    const email = req.params.email;
    const q = "SELECT * FROM profesori WHERE email = ?";
    
    db.query(q, [email], (err, result) => {
      if (err) {
        console.error('Greška prilikom dohvatanja podataka o profesoru:', err);
        return res.status(500).json({ error: 'Greška prilikom dohvatanja podataka o profesoru' });
      }
      return res.json(result[0]);
    });
});
  
// Dohvatanje imena svih gradova
app.get('/gradovi', (req, res) => {
    const q = "SELECT naziv FROM gradovi";
    db.query(q, (err, results) => {
      if (err) {
        console.error('Greška prilikom dohvatanja gradova:', err);
        return res.status(500).json({ error: 'Greška prilikom dohvatanja gradova' });
      }
      const gradovi = results.map(row => row.naziv);
      return res.json(gradovi);
    });
});
  
// Dohvatanje imena svih predmeta
app.get('/predmeti', (req, res) => {
    const q = "SELECT naziv FROM predmeti";
    db.query(q, (err, results) => {
      if (err) {
        console.error('Greška prilikom dohvatanja predmeta:', err);
        return res.status(500).json({ error: 'Greška prilikom dohvatanja predmeta' });
      }
      const predmeti = results.map(row => row.naziv);
      return res.json(predmeti);
    });
});



// Zakazivanje, dodavanje casova u bazu
app.post("/casovi", (req, res) => {
    const { korisnik, profesor, predmet, datum, vrijeme } = req.body;
    
    const q = "INSERT INTO zakazani_casovi (korisnik, profesor, predmet, datum, vrijeme) VALUES (?, ?, ?, ?, ?)";
    const values = [korisnik, profesor, predmet, datum, vrijeme];
    
    db.query(q, values, (err, result) => {
        if (err) {
            console.error("Greška prilikom dodavanja zakazanog časa: ", err);
            return res.status(500).json({ error: "Greška prilikom dodavanja zakazanog časa." });
        }
        return res.json({ message: "Čas uspješno dodat." });
    });
});

// Ruta za dohvatanje svih zakazanih časova za admina
app.get('/casovi', (req, res) => {
    const query = "SELECT * FROM zakazani_casovi";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Greška pri dohvatanju zakazanih časova: ', err);
            return res.status(500).json({ error: 'Greška pri dohvatanju zakazanih časova.' });
        }
        res.json(results);
    });
});
  
// Ruta za otkazivanje zakazanog časa za admina
app.delete('/casovi/:id', (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM zakazani_casovi WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Greška prilikom otkazivanja zakazanog časa:', err);
            return res.status(500).json({ error: 'Greška prilikom otkazivanja zakazanog časa.' });
        }
        res.json({ message: 'Čas uspješno otkazan.' });
    });
});



// DOHVATANJE PREDMETA ZA KONKRETNOG PROFESORA
app.get('/profesor_predmeti/:email', (req, res) => {
    const { email } = req.params;
  
    const query = "SELECT * FROM profesor_predmet WHERE profesor = ?";
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Greška prilikom dohvatanja predmeta za profesora: ', err);
        return res.status(500).json({ error: 'Greška prilikom dohvatanja predmeta za profesora.' });
      }
      res.json(results);
    });
});
  


const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
