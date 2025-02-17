import React, { useState } from 'react';
import { analyzePrivacyPolicy } from './api';

function App() {
  const [policyText, setPolicyText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      const analysisResult = await analyzePrivacyPolicy(policyText);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing privacy policy:', error);
      setError('Failed to analyze privacy policy');
    }
  };
  return (
    <div>
      <h1>Privacy Policy Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={policyText}
          onChange={(e) => setPolicyText(e.target.value)}
          placeholder="Paste your privacy policy here"
          style={{ width: '100%', height: '200px' }}
        />
        <button type="submit">Analyze</button>
      </form>
      {result && (
        <div>
          <h2>Analysis Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;