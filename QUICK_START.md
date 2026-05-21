# 🚀 Quick Start Guide - Fake News Detector

This guide will get you up and running in minutes!

## Step 1: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 2: Train the Model (if not already done)

```bash
python model_trainer.py
```

This creates `model.pkl` and `vectorizer.pkl` files needed for predictions.

## Step 3: Start the Flask Backend

```bash
python app.py
```

You should see:
```
Starting Fake News Classifier API...
Visit http://localhost:5000 for API documentation
To make predictions, send POST requests to http://localhost:5000/predict
 * Running on http://0.0.0.0:5000
```

**Keep this terminal open!**

## Step 4: Start the Frontend

Open a new terminal and navigate to the frontend folder:

### Option A: Python Server (Recommended)
```bash
cd frontend
python -m http.server 8000
```

Then open: `http://localhost:8000` in your browser

### Option B: Direct Browser
1. Navigate to the `frontend` folder
2. Right-click `index.html`
3. Open with your preferred browser

### Option C: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

## Step 5: Use the Application

1. **Paste or type news text** in the textarea
2. **Click "Analyze News"** button
3. **View results** showing:
   - Fake News or Real News prediction
   - Confidence percentage
   - Detailed probabilities breakdown

## Project Structure

```
Fakenews/
├── backend/
│   ├── app.py                 ← Flask API
│   ├── model_trainer.py       ← Model training
│   ├── requirements.txt       ← Python dependencies
│   ├── model.pkl              ← Trained model (after running model_trainer.py)
│   ├── vectorizer.pkl         ← Feature vectorizer (after running model_trainer.py)
│   ├── FakeNew.csv            ← Fake news dataset
│   ├── TrueNew.csv            ← Real news dataset
│   └── fakeNews.ipynb         ← Jupyter notebook
└── frontend/
    ├── index.html             ← Main page
    ├── style.css              ← Styling
    ├── script.js              ← JavaScript logic
    └── README.md              ← Detailed documentation
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Web Browser (Frontend)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  index.html (UI) + style.css + script.js            │  │
│  │  - Text input textarea                              │  │
│  │  - Send requests to backend                         │  │
│  │  - Display results with styling                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕ (HTTP POST)
                    JSON: { text: "..." }
┌─────────────────────────────────────────────────────────────┐
│               Flask Backend (http://localhost:5000)         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  app.py (/predict endpoint)                         │  │
│  │  - Receives news text                               │  │
│  │  - Preprocesses text (cleaning)                     │  │
│  │  - Vectorizes using trained vectorizer              │  │
│  │  - Predicts using ML model                          │  │
│  │  - Returns: prediction, confidence, probabilities   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Machine Learning Model (model.pkl)                 │  │
│  │  - Trained on news classification dataset           │  │
│  │  - Classifies: Fake News (0) or Real News (1)       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Troubleshooting

### Issue: "Cannot GET /predict" or connection errors
**Solution**: Make sure Flask backend is running on `http://localhost:5000`

### Issue: CORS error in browser console
**Solution**: Ensure `flask-cors` is installed and Flask server is restarted

### Issue: "Model not found" error from backend
**Solution**: Run `python model_trainer.py` in the backend folder first

### Issue: Frontend not loading
**Solution**: Try hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)

## API Endpoints

### Health Check
```bash
GET http://localhost:5000/health
```

### Predict News
```bash
POST http://localhost:5000/predict
Content-Type: application/json

{
  "text": "Your news article text here"
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

## Performance Tips

- The first prediction might take a moment (model loading)
- Subsequent predictions are faster
- Longer texts might take slightly longer to process
- Keep your news text between 50-2000 characters for best results

## Next Steps

1. ✅ Frontend created with HTML, CSS, JS
2. ✅ Backend updated with CORS support
3. 🔄 Ready to use! Follow the steps above

Enjoy analyzing news! 🎉
