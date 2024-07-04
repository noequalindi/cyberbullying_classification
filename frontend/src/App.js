import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import EvaluationChart from './components/Metrics';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import tweetIcon from './assets/tweet-icon.png';

function App() {
  const [tweet, setTweet] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const headers = {
    'Content-Type': 'application/json',
  };

  const apiURL = 'http://localhost:8001/predict';

  const handleAnalyze = async (e) => {
    setResult('');
    e.preventDefault();
    setError('');
    if (tweet.trim() === '') {
      setError('Por favor, ingrese un tweet para analizar.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(apiURL, { clean_tweet: tweet }, headers);
      const prediction = response.data.prediction;

      const predictionMapping = {
        0: { text: "No cyberbullying", color: "#52aa1d", icon: faCheckCircle },
        1: { text: "Gender-based cyberbullying", color: "orange", icon: faExclamationTriangle },
        2: { text: "Religion-based cyberbullying", color: "orange", icon: faExclamationTriangle },
        3: { text: "Age-based cyberbullying", color: "orange", icon: faExclamationTriangle },
        4: { text: "Ethnicity-based cyberbullying", color: "orange", icon: faExclamationTriangle }
      };

      setTimeout(() => {
        setResult(predictionMapping[prediction] || { text: "Unknown category", color: 'gray', icon: faExclamationTriangle });
        setLoading(false);
      }, 2000);
    } catch (error) {
      setResult({ text: `Error al conectar con la API: ${error}`, color: "red", icon: null });
      setLoading(false);
    }
  };

  return (
    <div className='App'>
    <header className='App-header'>
    <div className="container">
      <div className="content">
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={tweetIcon} alt="Tweet Icon" style={{ width: '55px', marginRight: '12px' }} />
              <h1 className='title'>Cyberbullying Classification</h1>
        </div>
        <form onSubmit={handleAnalyze}>
          <label>Escribe tu tweet (en inglés)</label>
          <textarea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            placeholder="Escribe tu tweet aquí..."
          />
          <button type="submit">Analizar el tweet</button>
        </form>
        {error && <p style={{ color: '#df8615', fontWeight: 600 }}>{error}</p>}
        {loading ? (
          <div className="loader-container">
          <Oval
            height={80}
            width={80}
            color="orange"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="white"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
          </div>
        ) : result && (
          <>
            <div className="result">
              <h3>Resultado del Análisis:</h3>
              <div style={{ color: result.color }}>
                {result.icon && <FontAwesomeIcon icon={result.icon} />} {result.text}
              </div>
            </div>
            <div className='charts-container'>
              <EvaluationChart />
            </div>
          </>
        )}
      </div>
    </div>
    </header>
    </div>

  );
}

export default App;
