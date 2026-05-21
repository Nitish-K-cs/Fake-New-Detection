# Fake News Classifier API

A REST API for classifying news as fake or real using machine learning.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Train the Model

Run this once to train the model and save it:

```bash
python model_trainer.py
```

This will create two files:
- `model.pkl` - Trained Logistic Regression model
- `vectorizer.pkl` - TF-IDF vectorizer

### 3. Start the API Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Usage

### Make a Prediction

**Endpoint:** `POST /predict`

**Request:**
```json
{
  "text": "Your news text here"
}
```

**Response:**
```json
{
  "prediction": "Fake News",
  "confidence": 85.23,
  "probabilities": {
    "fake_news": 85.23,
    "not_fake_news": 14.77
  }
}
```

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "model": "Fake News Classifier",
  "version": "1.0"
}
```

### Get API Info

**Endpoint:** `GET /`

Shows all available endpoints and usage examples.

## Testing with Python

```python
import requests

response = requests.post('http://localhost:5000/predict', json={
    'text': 'Your news text here'
})

print(response.json())
```

Or use the provided client script:

```bash
python client.py
```

## Testing with curl

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Your news text here"}'
```

## Model Information

- **Algorithm:** Logistic Regression
- **Vectorization:** TF-IDF (Term Frequency-Inverse Document Frequency)
- **Classes:** 
  - 0: Fake News
  - 1: Not Fake News

## Files

- `model_trainer.py` - Script to train and save the model
- `app.py` - Flask API server
- `client.py` - Python client for testing
- `requirements.txt` - Python dependencies
- `model.pkl` - Trained model (generated after training)
- `vectorizer.pkl` - TF-IDF vectorizer (generated after training)

## Example

### Using cURL:
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Breaking: Local community raises funds for local school"}'
```

### Using Python requests:
```python
import requests

url = "http://localhost:5000/predict"
data = {"text": "Breaking: Local community raises funds for local school"}

response = requests.post(url, json=data)
print(response.json())
```

Output:
```json
{
  "prediction": "Not Fake News",
  "confidence": 92.45,
  "probabilities": {
    "fake_news": 7.55,
    "not_fake_news": 92.45
  }
}
```

## Notes

- The model needs to be trained once before the API can make predictions
- Text is automatically cleaned and preprocessed before classification
- The API returns confidence scores for both classes
- All responses are in JSON format

## Troubleshooting

**Error: "model.pkl or vectorizer.pkl not found"**
- Run `python model_trainer.py` first to train and save the model

**Error: "Cannot connect to API"**
- Make sure `python app.py` is running
- Check that port 5000 is not in use by another application

**Port 5000 already in use**
- Edit `app.py` and change the port number in the last line:
  ```python
  app.run(debug=True, host='0.0.0.0', port=8000)  # Change 5000 to 8000
  ```
