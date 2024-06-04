import './ChatBot.css'
import React, { useState, useEffect } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [commonQuestions, setCommonQuestions] = useState([]);
  const [firstEntry, setFirstEntry] = useState(true);

  // Funkcija za postavljanje najčešćih pitanja za odabranu kategoriju
  const setCommonQuestionsForCategory = (category) => {
    switch (category) {
      case 'Saznaj više o nama':
        setCommonQuestions([
            'Šta je All A\'s?',
            'Šta je glavni cilj aplikacije All A\'s?',
            'Zašto bih trebao da koristim ovu aplikaciju?'
        ]);
        break;
      case 'Savjeti':
        setCommonQuestions([
            'Želim savjete za bržu i bolju organizaciju školskih zadataka.',
            'Loše mi idu prirodne nauke. Šta da uradim da bih bio bolji?',
            'Loše mi idu društvene nauke. Šta da uradim da bih bio bolji?',
            'Savjeti za bolje pamćenje.',
            'Savjeti za učenje.'
        ]);
        break;
      case 'Pomoć':
        setCommonQuestions([
            'Kako mogu da pretražim profesore?',
            'Kako mogu da otkažem čas?',
            'Kako mogu da zakažem čas?'
        ]);
        break;
      default:
        setCommonQuestions([]);
    }
  };

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, sender: 'user' }]);
      handleBotResponse(input.trim());
      setInput('');
    }
  };
  
  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(''); //da bi klikom na glavni case ugasili glavni case
      setCommonQuestions([]);
    } else {
      setSelectedCategory(category);
      setCommonQuestionsForCategory(category);
    }
  };

  const handleQuestionSelect = (question) => {
    setMessages([...messages, { text: question, sender: 'user' }]);
    handleBotResponse(question);
  };

  const handleBotResponse = (question) => {
    let response = '';
    switch (selectedCategory) {
      case 'Saznaj više o nama':
        switch (question) {
          case 'Šta je All A\'s?':
            response = 'All A\'s je inovativna platforma za zakazivanje časova i pomoć učenicima da ostvare bolje rezultate u školi.';
            break;
          case 'Šta je glavni cilj aplikacije All A\'s?':
            response = 'Glavni cilj aplikacije All A\'s je da olakša učenicima pronalaženje kvalifikovanih profesora i zakazivanje časova na brz i jednostavan način.';
            break;
          case 'Zašto bih trebao da koristim ovu aplikaciju?':
            response = 'Aplikacija All A\'s je sigurna, pouzdana i jednostavna platforma koja će Vam omogućiti da ostvarite svoj puni akademski potencijal, razvijete samopouzdanje u učenju i uživate u profesu sticanja znanja. Svrha je da transformišemo način na koji se učenje doživljava, pružajući podršku.';
            break;
          default:
            response = 'Nemam odgovor na to pitanje. Odaberite jednu od kategorija ponuđenih ispod.';
        }
        break;
      case 'Savjeti':
        switch (question) {
          case 'Želim savjete za bržu i bolju organizaciju školskih zadataka.':
            response = 'Savjet za bolju organizaciju je da svake noći napravite raspored koji ćete pratiti sljedećeg dana. I na kraju dana zabilježiti uspjehe. Postavite prioritete i redovno pratite svoj napredak.';
            break;
          case 'Loše mi idu prirodne nauke. Šta da uradim da bih bio bolji?':
            response = 'Za bolje rezultate u prirodnim naukama, preporučujemo konstantan rad. Uz savjet da kada naiđete na prepreku, istražite i saznate rješenje. Nikada ništa ne ostavljajte nedovršeno i za kasnije. Prirodne nauke su takve da je sve povezano, tako da bi ste se prije ili kasnije susreli opet sa istim problemom. Čak i gorim. Takođe korišćenje i drugih materijala, ne samo ono što je rađeno u školi.';
            break;
          case 'Loše mi idu društvene nauke. Šta da uradim da bih bio bolji?':
            response = 'Za bolje rezultate u društvenim naukama, preporučujemo čitanje dodatne literature, učenje sa razumijevanjem, kao i diskusije sa drugim đacima';
            break;
            case 'Savjeti za bolje pamćenje.':
            response = 'Za bolje pamćenje, preporučujemo tehnike kao što su ponavljanje, asocijacije i vizualizacija informacija. Takođe redovan san je ključan, bez redovnog sna i unosa određene količine vode mozgu treba mnogo više vremena da upamti određene informacije. Takođe postoji različita hrana koja pomaže u tome. Koštunjavo voće je dobro za pamćenje, kao i različite vrste čajeva.';
            break;
          case 'Savjeti za učenje.':
            response = 'Savjeti za učenje uključuju pravljenje beleški, korišćenje različitih izvora informacija i redovne pauze tokom učenja. Učenju ne treba pristupati sa stresom, već polako i smireno. Trebamo se radovati da proširimo svoje znanje.';
            break;
          default:
            response = 'Ne mogu odgovoriti na to pitanje. Odaberite jednu od kategorija ponuđenih ispod.';
        }
        break;
      case 'Pomoć':
        switch (question) {
          case 'Kako mogu da pretražim profesore?':
            response = 'Možete pretraživati profesore na našoj platformi u dijelu "Pretrazi profesore", nakon čega će vam biti prikazani dostupni profesori.';
            break;
          case 'Kako mogu da otkažem čas?':
            response = 'Čas možete otkazati putem opcije "Otkaži termin" u vašem profilu.';
            break;
          case 'Kako mogu kontaktirati podršku za korisnike?':
            response = 'Naša podrška za korisnike dostupna je putem e-maila support@bookalook.com ili telefonom na broj 123-456-789.';
            break;
          case 'Kako mogu da zakažem čas?':
            response = 'Termin možete otkazati putem opcije "Zakaži čas" u vašem profilu.';
            break; 
          default:
            response = 'Ne mogu odgovoriti na to pitanje. Odaberite jednu od kategorija ponuđenih ispod.';
        }
        break;
      default:
        response = 'Zdravo! Ja sam All A\'s asistent. Molim vas odaberite jednu od kategorija: "Saznaj više o nama", "Savjeti" ili "Pomoć" i dozvolite da Vam pomognem.';
    }
    setTimeout(() => {
      setMessages([...messages, { text: response, sender: 'bot' }]);
    }, 1000);
  };
  
  const clearMessages = () => {
    setMessages([]);
  };

  useEffect(() => {
    if (firstEntry) {
      setFirstEntry(false);
      handleBotResponse('');
    }
  }, []);

  return (
    <div className="chatbot-container">
        <h1>All A's - Vaš AI asistent za učenje<span>!</span></h1>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="category-options">
        <button onClick={() => handleCategorySelect('Saznaj više o nama')}>Saznaj više o nama</button>
        <button onClick={() => handleCategorySelect('Savjeti')}>Savjeti</button>
        <button onClick={() => handleCategorySelect('Pomoć')}>Pomoć</button>
      </div>
      <div className="common-questions">
        {commonQuestions.map((question, index) => (
          <button key={index} onClick={() => handleQuestionSelect(question)}>{question}</button>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Unesite poruku..."
        />
        <button onClick={handleSendMessage}>Pošalji</button>
      </div>
      <div className="chatbot-clear">
        <button onClick={clearMessages}>Obriši chat</button>
      </div>
    </div>
  );
};

export default ChatBot;