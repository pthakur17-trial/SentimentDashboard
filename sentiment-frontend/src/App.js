import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState([]);

  // Fetch recent analyses on load
  useEffect(() => {
    fetchRecent();
  }, []);

  const analyzeText = async () => {
    if (!text) return;
    try {
      const res = await axios.post('http://localhost:7071/analyze', { text });
      setResult(res.data);
      setText('');
      fetchRecent(); // refresh recent analyses
    } catch (err) {
      console.error(err);
      alert('Error analyzing text');
    }
  };

  const fetchRecent = async () => {
    try {
      const res = await axios.get('http://localhost:7071/recent');
      setRecent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>Sentiment Analysis Dashboard</h1>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter text to analyze"
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={analyzeText}>Analyze</button>

      {result && (
        <div className="result">
          <h2>Result</h2>
          <p><strong>Text:</strong> {result.text}</p>
          <p><strong>Sentiment:</strong> {result.sentiment}</p>
          <p><strong>Scores:</strong> Positive: {result.scores.positive}, Neutral: {result.scores.neutral}, Negative: {result.scores.negative}</p>
          <p><strong>Key Phrases:</strong> {result.keyPhrases.join(', ')}</p>
        </div>
      )}

      <div className="recent">
        <h2>Recent Analyses</h2>
        {recent.length === 0 && <p>No analyses yet.</p>}
        {recent.map(item => (
          <div key={item.id} className="recent-item">
            <p><strong>{item.text}</strong></p>
            <p>Sentiment: {item.sentiment} | Key Phrases: {item.keyPhrases.join(', ')}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
