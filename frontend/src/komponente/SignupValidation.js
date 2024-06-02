function Validation(values) {
    let errors = {};

    //dozvoljeni oblik za email i lozinku
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$/;

    if (!values.ime) 
    {
        errors.ime = "Ime je obavezno. Molimo unesite svoje ime.";
    } 
    if (!values.email) 
    {
        errors.email = "Email ne smije biti prazan.";
    } 
    else if (!emailPattern.test(values.email)) 
    {
        errors.email = "Nevalidan format email adrese.";
    }

    if (!values.lozinka) 
    {
        errors.lozinka = "Lozinka ne smije biti prazna.";
    } 
    else if (!passwordPattern.test(values.lozinka)) 
    {
        errors.lozinka = "Lozinka mora sadržati najmanje 8 znakova, barem jedno malo slovo, jedno veliko slovo i jedan broj.";
    }

    return errors;
}

export default Validation;