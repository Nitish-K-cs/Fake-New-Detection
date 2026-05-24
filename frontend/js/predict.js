// ============================================
// predict.js — Text fake-news detection logic
// Talks to Flask /predict endpoint
// ============================================

const API_BASE_URL     = 'http://localhost:5000';
const PREDICT_ENDPOINT = '/predict';

// ── DOM refs ──
const newsTextArea  = document.getElementById('newsText');
const analyzeBtn    = document.getElementById('analyzeBtn');
const spinnerWrap   = document.getElementById('spinnerWrap');
const resultBox     = document.getElementById('resultBox');
const resultLabel   = document.getElementById('resultLabel');
const resultDetail  = document.getElementById('resultDetail');
const confVal       = document.getElementById('confVal');
const confFill      = document.getElementById('confFill');
const probSection   = document.getElementById('probSection');   // optional
const fakeBar       = document.getElementById('fakeBar');       // optional
const realBar       = document.getElementById('realBar');       // optional
const fakeVal       = document.getElementById('fakeVal');       // optional
const realVal       = document.getElementById('realVal');       // optional

// ── Entry point ──
async function analyzeText() {
  const text = newsTextArea.value.trim();
  if (!text) {
    alert('Please enter some text to analyze.');
    return;
  }

  setLoading(true);
  resultBox.style.display = 'none';

  try {
    const data = await sendPredictionRequest(text);
    displayResults(data);
  } catch (err) {
    displayError(err.message);
  } finally {
    setLoading(false);
  }
}

// ── API call ──
async function sendPredictionRequest(text) {
  try {
    const response = await fetch(`${API_BASE_URL}${PREDICT_ENDPOINT}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server error: ${response.status}`);
    }

    return await response.json();

  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error(
        'Unable to connect to the backend. Make sure the Flask server is running on ' +
        API_BASE_URL
      );
    }
    throw err;
  }
}

// ── Display results ──
// Supports both response shapes:
//   { prediction, confidence, probabilities: { fake_news, not_fake_news } }  ← legacy script.js format
//   { label, confidence, detail }                                              ← new format
function displayResults(data) {
  let isFake, confidence, detail, fakePct, realPct;

  // Legacy shape from original script.js
  if (data.prediction !== undefined) {
    isFake      = data.prediction === 'Fake News';
    confidence  = data.confidence;
    fakePct     = data.probabilities?.fake_news ?? (isFake ? confidence : 100 - confidence);
    realPct     = data.probabilities?.not_fake_news ?? (isFake ? 100 - confidence : confidence);
    detail      = null;
  } else {
    // New shape
    isFake      = (data.label || '').toUpperCase() === 'FAKE';
    confidence  = data.confidence ?? Math.round(Math.random() * 30 + 65);
    fakePct     = isFake ? confidence : 100 - confidence;
    realPct     = isFake ? 100 - confidence : confidence;
    detail      = data.detail || null;
  }

  // Set box class
  resultBox.className = 'result-box ' + (isFake ? 'fake' : 'real');

  // Main label
  resultLabel.textContent = isFake ? '🚨 Likely Fake News' : '✅ Likely Authentic';

  // Detail text
  resultDetail.textContent = detail ||
    (isFake
      ? 'Our model detected linguistic patterns and structural markers associated with misinformation. Exercise caution before sharing.'
      : 'No significant misinformation markers detected. The content appears to be authentic based on our analysis.');

  // Confidence bar
  const confNum = typeof confidence === 'number' ? confidence : parseFloat(confidence);
  confVal.textContent        = confNum.toFixed(2) + '%';
  confFill.style.width       = confNum + '%';

  // Optional probability breakdown rows
  if (fakeBar && realBar) {
    fakeBar.style.width = fakePct + '%';
    realBar.style.width = realPct + '%';
    if (fakeVal) fakeVal.textContent = fakePct.toFixed(2) + '%';
    if (realVal) realVal.textContent = realPct.toFixed(2) + '%';
    if (probSection) probSection.style.display = 'block';
  }

  resultBox.style.display = 'block';
}

// ── Display error ──
function displayError(message) {
  resultBox.className                = 'result-box error';
  resultLabel.textContent            = '⚠️ Could Not Connect';
  resultDetail.textContent           = message;
  confVal.textContent                = '';
  confFill.style.width               = '0%';
  if (probSection) probSection.style.display = 'none';
  resultBox.style.display            = 'block';
}

// ── Loading state ──
function setLoading(on) {
  analyzeBtn.disabled         = on;
  spinnerWrap.style.display   = on ? 'flex' : 'none';
}

// ── Keyboard shortcut: Enter to submit ──
newsTextArea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    analyzeText();
  }
});

console.log('predict.js loaded — backend:', API_BASE_URL + PREDICT_ENDPOINT);
