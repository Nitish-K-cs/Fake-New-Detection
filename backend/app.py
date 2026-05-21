"""
Flask API for fake news classification
Run with: python app.py
Then make requests to: http://localhost:5000/predict
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re
import string

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

# Load model and vectorizer at startup
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
    print("Model and vectorizer loaded successfully!")
except FileNotFoundError:
    print("Error: model.pkl or vectorizer.pkl not found!")
    print("Please run model_trainer.py first to train and save the model.")
    exit(1)

def wordopt(text):
    """Clean and preprocess text"""
    text = text.lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub("\\W", " ", text)
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text

def predict_fake_news(text):
    """Predict if text is fake news"""
    # Preprocess
    cleaned_text = wordopt(text)
    
    # Vectorize
    text_vector = vectorizer.transform([cleaned_text])
    
    # Predict
    prediction = model.predict(text_vector)[0]
    probability = model.predict_proba(text_vector)[0]
    
    # Format response
    result = {
        "prediction": "Fake News" if prediction == 0 else "Not Fake News",
        "confidence": float(max(probability)) * 100,
        "probabilities": {
            "fake_news": float(probability[0]) * 100,
            "not_fake_news": float(probability[1]) * 100
        }
    }
    
    return result

@app.route('/predict', methods=['POST'])
def predict():
    """
    API endpoint for fake news prediction
    
    Expected JSON input:
    {
        "text": "Your news text here"
    }
    
    Example response:
    {
        "prediction": "Fake News",
        "confidence": 85.23,
        "probabilities": {
            "fake_news": 85.23,
            "not_fake_news": 14.77
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                "error": "Missing 'text' field in JSON input"
            }), 400
        
        news_text = data.get('text', '').strip()
        
        if not news_text:
            return jsonify({
                "error": "Text field cannot be empty"
            }), 400
        
        result = predict_fake_news(news_text)
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "OK",
        "model": "Fake News Classifier",
        "version": "1.0"
    }), 200

@app.route('/', methods=['GET'])
def home():
    """Home endpoint with usage instructions"""
    return jsonify({
        "message": "Fake News Classifier API",
        "endpoints": {
            "POST /predict": "Classify news as fake or real",
            "GET /health": "Health check",
            "GET /": "This help message"
        },
        "example_usage": {
            "url": "POST http://localhost:5000/predict",
            "body": {
                "text": "Your news text here"
            }
        }
    }), 200

if __name__ == '__main__':
    print("Starting Fake News Classifier API...")
    print("Visit http://localhost:5000 for API documentation")
    print("To make predictions, send POST requests to http://localhost:5000/predict")
    app.run(debug=True, host='0.0.0.0', port=5000)
