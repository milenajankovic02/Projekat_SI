const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Import jwt
const nodemailer = require('nodemailer');
const fileUpload = require("express-fileupload");

const path = require('path');

const app = express();

const fs = require('fs');


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload());

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'all.a.business.mne@gmail.com',  // Unesite svoj e-mail
    pass: 'cive joiu tini twku'           // Unesite svoju lozinku
  }
});

app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  // Podaci za slanje e-maila
  let mailOptions = {
    from: 'all.a.business.mne@gmail.com',    // Unesite svoj e-mail
    to: 'all.a.business.mne@gmail.com', // Unesite e-mail primaoca
    subject: 'Poruka sa vaše web stranice',
    text: `Ime: ${name}\nEmail: ${email}\nPoruka: ${message}`
  };

  // Slanje e-maila
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Greška prilikom slanja e-maila:', error);
      res.status(500).send('Došlo je do greške prilikom slanja e-maila.');
    } else {
      console.log('E-mail uspješno poslat:', info.response);
      res.status(200).send('E-mail uspješno poslat!');
    }
  });
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root1234",
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
    const q = "INSERT INTO korisnici (ime, prezime, email, lozinka, uloga, nivo) VALUES (?, ?, ?, ?, ?, ?)";

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
    console.log('Rezultati iz baze login:', user);

    // Generiši JWT token
    const token = jwt.sign({ email: user.email, role: user.uloga }, 'tajna_tajna_tajna', { expiresIn: '1h' });
    res.json({ token });
  });
});

app.get('/biblioteka', (req, res) => {
  const q = "SELECT * FROM biblioteka";
  db.query(q, (err, results) => {
    if (err) {
      console.error('Greška prilikom dohvatanja fajlova:', err);
      return res.status(500).json({ error: 'Greška prilikom dohvatanja fajlova' });
    }
    res.json(results);
  });
});

// Metoda za upload fajla
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("uzas");
    return res.status(400).json({ error: 'No files were uploaded.' }); 
  }

  const file = req.files.file;
  const uploadPath = path.join(__dirname, 'biblioteka', file.name);

  file.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const q = "INSERT INTO biblioteka (ime, predmet, opis, putanja, korisnik_id) VALUES (?, ?, ?, ?, ?)";
    const values = [
      req.body.ime,
      req.body.predmet,
      req.body.opis,
      uploadPath,
      req.body.korisnik_id
    ];

    db.query(q, values, (err, results) => {
      if (err) {
        console.error('Greška prilikom unosa fajla u bazu:', err);
        return res.status(500).json({ error: 'Greška prilikom unosa fajla u bazu' });
      }
      res.json({ success: true, message: 'Fajl uspešno uploadovan' });
    });
  });
});

// Metoda za preuzimanje fajla
app.get('/download/:id', (req, res) => {
  const fileId = req.params.id;
  const q = "SELECT putanja FROM biblioteka WHERE id = ?";

  db.query(q, [fileId], (err, results) => {
    if (err) {
      console.error('Greška prilikom dohvatanja putanje fajla:', err);
      return res.status(500).json({ error: 'Greška prilikom dohvatanja putanje fajla' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Fajl nije pronađen' });
    }

    const filePath = results[0].putanja;
    res.download(filePath);
  });
});

// Metoda za brisanje fajla
app.delete('/delete/:id', (req, res) => {
  const fileId = req.params.id;
  const q = "SELECT putanja FROM biblioteka WHERE id = ?";

  db.query(q, [fileId], (err, results) => {
    if (err) {
      console.error('Greška prilikom dohvatanja putanje fajla:', err);
      return res.status(500).json({ error: 'Greška prilikom dohvatanja putanje fajla' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Fajl nije pronađen' });
    }

    const filePath = results[0].putanja;

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Greška prilikom brisanja fajla:', err);
        return res.status(500).json({ error: 'Greška prilikom brisanja fajla' });
      }

      const deleteQuery = "DELETE FROM biblioteka WHERE id = ?";
      db.query(deleteQuery, [fileId], (err, results) => {
        if (err) {
          console.error('Greška prilikom brisanja fajla iz baze:', err);
          return res.status(500).json({ error: 'Greška prilikom brisanja fajla iz baze' });
        }
        res.json({ success: true, message: 'Fajl uspešno obrisan' });
      });
    });
  });
});

// Metoda za dohvaćanje predmeta
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

      const predmetQuery = "INSERT INTO profesor_predmet (email, predmet, cijena, grad) VALUES ?";
      const predmetValues = predmeti.map(predmet => [email, predmet.naziv, predmet.cijena, grad]);

      db.query(predmetQuery, [predmetValues], (err) => {
          if (err) {
              console.error('Greška prilikom dodavanja predmeta za profesora:', err);
              return res.status(500).json({ error: 'Greška prilikom dodavanja predmeta za profesora' });
          }

          res.status(200).json({ message: 'Profesor i predmeti uspješno dodati' });
      });
  });
});
  
// Dohvatanje profesora prema predmetu i gradu
app.get('/profesori/pretraga', (req, res) => {
  const { predmet, grad } = req.query;

  const q = `
      SELECT p.email, p.ime, p.prezime, pp.cijena 
      FROM profesori p
      JOIN profesor_predmet pp ON p.email = pp.email
      WHERE pp.predmet = ? AND pp.grad = ?`;

  db.query(q, [predmet, grad], (err, results) => {
      if (err) {
          console.error('Greška prilikom dohvatanja profesora:', err);
          return res.status(500).json({ error: 'Greška prilikom dohvatanja profesora' });
      }
      res.json(results);
  });
});


//Dodavanje u profesor_predmet
app.post('/profesor_predmet', (req, res) => {
  const { profesor, predmeti } = req.body;

  const query = "INSERT INTO profesor_predmet (email, predmet, cijena, grad) VALUES ?";
  const values = predmeti.map(predmet => [profesor, predmet.naziv, predmet.cijena, predmet.grad]);

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
  const query = `
  SELECT p.email, p.ime, p.prezime, p.grad, p.adresa, p.tel, p.nivo, GROUP_CONCAT(pp.predmet) AS predmeti
  FROM profesori p
  LEFT JOIN profesor_predmet pp ON p.email = pp.email
  GROUP BY p.email, p.ime, p.prezime, p.grad, p.adresa, p.tel, p.nivo;`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Greška pri dohvatanju profesora: ', err);
            return res.status(500).json({ error: 'Greška pri dohvatanju profesora.' });
        }
        console.log('Rezultati iz baze pretraga profesora:', results);
        res.json(results);
    });
});


// Dohvatanje profesora prema predmetu i gradu
app.get('/profesori/pretraga', (req, res) => {
  const { predmet, grad } = req.query;
  
  const q = `
  SELECT p.email, p.ime, p.prezime, pp.cijena 
  FROM profesori p
  JOIN profesor_predmet pp ON p.email = pp.email
  JOIN gradovi g ON p.grad = g.naziv
  JOIN predmeti pr ON pp.predmet = pr.naziv
  WHERE pr.naziv = ? AND g.naziv = ?
  `;

    db.query(q, [predmet, grad], (err, results) => {
    if (err) {
      console.error('Greška prilikom dohvatanja profesora:', err);
      return res.status(500).json({ error: 'Greška prilikom dohvatanja profesora' });
    }
    res.json(results);
    console.log('nenene:', results);
  });
});

// Ruta za dobijanje ID-a korisnika na osnovu email adrese
app.get('/korisnici/id', (req, res) => {
  const { email } = req.query;
  
  const q = "SELECT id FROM korisnici WHERE email = ?";
  
  db.query(q, [email], (err, result) => {
    if (err) {
      console.error('Greška prilikom dohvatanja ID-a korisnika:', err);
      return res.status(500).json({ error: 'Greška prilikom dohvatanja ID-a korisnika' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Korisnik nije pronađen' });
    }
    res.json({ id: result[0].id });
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

  const query = "DELETE FROM profesor_predmet WHERE id = ?";
  db.query(query, [id], (err, result) => {
      if (err) {
          console.error('Greška prilikom brisanja predmeta iz profesor_predmet: ', err);
          return res.status(500).json({ error: 'Greška prilikom brisanja predmeta iz profesor_predmet.' });
      }
      res.status(200).json({ message: 'Uspješno obrisano iz profesor_predmet.' });
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
  








// Dodavanje studenta
app.post("/students", async (req, res) => {
  try {
    const { ime, prezime, email, lozinka, uloga, nivo } = req.body;
    const hashedPassword = await bcrypt.hash(lozinka, 10);
  
    const q = "INSERT INTO korisnici (ime, prezime, email, lozinka, uloga, nivo) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [ime, prezime, email, hashedPassword, uloga, nivo];
  
    db.query(q, values, (err, result) => {
      if (err) {
        console.error("Greška prilikom dodavanja studenta:", err);
        return res.status(500).json({ error: "Greška prilikom dodavanja studenta" });
      }
      return res.json({ message: "Student uspješno dodat." });
    });
  } catch (error) {
    console.error("Greška prilikom dodavanja studenta:", error);
    res.status(500).json({ error: "Greška prilikom dodavanja studenta" });
  }
});

// Prikaz studenata
app.get("/students", (req, res) => {
  const q = "SELECT id, ime, prezime, email, nivo FROM korisnici WHERE uloga != 'admin'";
  db.query(q, (err, data) => {
    if (err) {
      return res.status(500).json("Greška prilikom dohvatanja informacija o studentima.");
    }
    return res.json(data);
  });
});

// Brisanje studenta
app.delete("/students/:id", (req, res) => {
  const studentId = req.params.id;

  const query = "DELETE FROM korisnici WHERE id = ?";
  db.query(query, [studentId], (error, result) => {
    if (error) {
      console.error("Greška prilikom brisanja studenta iz baze: ", error);
      return res.status(500).json({ error: "Greška prilikom brisanja studenta iz baze." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student sa datim ID-om nije pronađen." });
    }

    return res.status(200).json({ message: "Student uspješno obrisan." });
  });
});



// Dohvatanje podataka o korisniku
app.post('/get-user-info', (req, res) => {
  const { email } = req.body;

  const query = 'SELECT ime, prezime, email FROM korisnici WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Greška prilikom dohvatanja podataka o korisniku:', err);
      return res.status(500).json({ error: 'Greška prilikom dohvatanja podataka o korisniku.' });
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Korisnik nije pronađen.' });
    }
  });
});

// Dohvatanje zakazanih časova za korisnika
app.post('/user-classes', (req, res) => {
  const { email } = req.body;

  const query = `
    SELECT zc.id, zc.profesor, zc.predmet, zc.datum, zc.vrijeme 
    FROM zakazani_casovi zc
    JOIN korisnici k ON zc.korisnik = k.id
    WHERE k.email = ?
  `;
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Greška prilikom dohvatanja zakazanih časova:', err);
      return res.status(500).json({ error: 'Greška prilikom dohvatanja zakazanih časova.' });
    }
    res.json(results);
  });
});

// Otkazivanje zakazanog časa
app.delete('/classes/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM zakazani_casovi WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Greška prilikom otkazivanja časa:', err);
      return res.status(500).json({ error: 'Greška prilikom otkazivanja časa.' });
    }
    res.json({ message: 'Čas uspješno otkazan.' });
  });
});


const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
