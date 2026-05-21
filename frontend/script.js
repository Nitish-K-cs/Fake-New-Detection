// Configuration
const API_BASE_URL = 'http://localhost:5000';
const PREDICT_ENDPOINT = '/predict';

// DOM Elements
const newsForm = document.getElementById('newsForm');
const newsTextArea = document.getElementById('newsText');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultContainer = document.getElementById('resultContainer');
const resultCard = document.getElementById('resultCard');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');
const submitButton = newsForm.querySelector('button[type="submit"]');

// Event Listeners
newsForm.addEventListener('submit', handleFormSubmit);

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const newsText = newsTextArea.value.trim();

    if (!newsText) {
        showError('Please enter some text to analyze');
        return;
    }

    // Hide previous results and errors
    hideError();
    hideResults();

    // Show loading spinner
    showLoading();

    try {
        const result = await sendPredictionRequest(newsText);
        displayResults(result);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

/**
 * Send prediction request to the Flask backend
 */
async function sendPredictionRequest(text) {
    try {
        const response = await fetch(`${API_BASE_URL}${PREDICT_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.error || `Server error: ${response.status}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                'Unable to connect to the backend. Make sure the Flask server is running on http://localhost:5000'
            );
        }
        throw error;
    }
}

/**
 * Display prediction results
 */
function displayResults(result) {
    const { prediction, confidence, probabilities } = result;

    // Determine if it's fake or real
    const isFake = prediction === 'Fake News';
    const badgeClass = isFake ? 'fake' : 'real';

    // Build the result card HTML
    let html = `
        <div class="result-card ${badgeClass}">
            <div class="prediction-badge ${badgeClass}">
                ${isFake ? '⚠️ FAKE NEWS' : '✅ REAL NEWS'}
            </div>

            <div class="confidence-section">
                <h3>Overall Confidence</h3>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${confidence}%">
                        ${confidence.toFixed(2)}%
                    </div>
                </div>
            </div>

            <div class="probabilities">
                <h4>Detailed Probabilities</h4>
                
                <div class="probability-item">
                    <div>
                        <div class="probability-label">🚨 Fake News Probability</div>
                        <div class="probability-bar-container">
                            <div class="probability-bar-fill" style="width: ${probabilities.fake_news}%"></div>
                        </div>
                    </div>
                    <div class="probability-value">${probabilities.fake_news.toFixed(2)}%</div>
                </div>

                <div class="probability-item">
                    <div>
                        <div class="probability-label">✅ Real News Probability</div>
                        <div class="probability-bar-container">
                            <div class="probability-bar-fill" style="width: ${probabilities.not_fake_news}%"></div>
                        </div>
                    </div>
                    <div class="probability-value">${probabilities.not_fake_news.toFixed(2)}%</div>
                </div>
            </div>
        </div>
    `;

    resultCard.innerHTML = html;
    resultContainer.classList.remove('hidden');
}

/**
 * Show loading spinner
 */
function showLoading() {
    loadingSpinner.classList.remove('hidden');
    submitButton.disabled = true;
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    loadingSpinner.classList.add('hidden');
    submitButton.disabled = false;
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorContainer.classList.remove('hidden');
}

/**
 * Hide error message
 */
function hideError() {
    errorContainer.classList.add('hidden');
    errorMessage.textContent = '';
}

/**
 * Hide results
 */
function hideResults() {
    resultContainer.classList.add('hidden');
}

// Initialize on page load
window.addEventListener('load', () => {
    console.log('Fake News Detector initialized');
    console.log('Backend API: ' + API_BASE_URL + PREDICT_ENDPOINT);
});
