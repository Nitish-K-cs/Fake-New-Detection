# Fake News Detector Frontend

A modern, responsive web interface for the Fake News Detector machine learning model. This frontend communicates with the Flask backend to classify news articles as fake or real.

## Features

✨ **User-Friendly Interface** - Clean and intuitive design for easy news submission  
🚀 **Real-Time Analysis** - Instant fake news classification with confidence scores  
📊 **Detailed Results** - Shows prediction, confidence percentage, and detailed probabilities  
📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices  
⚡ **Fast Processing** - Quick API responses from the Flask backend  

## Files Structure

```
frontend/
├── index.html      # Main HTML file
├── style.css       # Complete styling and responsive design
├── script.js       # JavaScript for API communication and interactivity
└── README.md       # This file
```

## Getting Started

### Prerequisites

1. **Flask Backend Running**
   - Navigate to the `backend/` folder
   - Install dependencies: `pip install -r requirements.txt`
   - Train the model (if not already trained): `python model_trainer.py`
   - Start the Flask server: `python app.py`
   - Server should be running on `http://localhost:5000`

2. **Modern Web Browser**
   - Chrome, Firefox, Safari, Edge, or any modern browser
   - JavaScript enabled

### Installation

1. Open the frontend files in any way:
   
   **Option A: Use Python's built-in server**
   ```bash
   cd frontend
   python -m http.server 8000
   # Then visit http://localhost:8000 in your browser
   ```

   **Option B: Open directly in browser**
   - Right-click `index.html` → Open with browser
   - Or drag `index.html` into your browser window

   **Option C: Use VS Code Live Server extension**
   - Install "Live Server" extension in VS Code
   - Right-click `index.html` → "Open with Live Server"

2. Ensure the Flask backend is running on `http://localhost:5000`

## Usage

1. **Enter News Text**
   - Paste or type the news article text in the textarea

2. **Click "Analyze News"**
   - The app will send the text to the backend for analysis

3. **View Results**
   - **Prediction Badge**: Shows "FAKE NEWS" or "REAL NEWS" with color coding
   - **Overall Confidence**: Percentage confidence in the prediction
   - **Detailed Probabilities**: Individual percentages for both classifications

## API Configuration

The frontend connects to the Flask backend at:
- **Base URL**: `http://localhost:5000`
- **Endpoint**: `/predict`
- **Method**: POST
- **Request Format**: JSON with `{ "text": "your news text here" }`

To change the backend URL, edit `script.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000'; // Change this line
```

## Response Format

Example response from the backend:
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

## Styling

The application uses:
- **Color Scheme**: Purple gradient theme
- **Typography**: Segoe UI font family
- **Responsive**: Mobile-first design with breakpoints at 600px
- **Animations**: Smooth transitions and loading spinner

### Color Meanings
- 🟣 **Purple/Gradient**: Default theme and confidence bars
- 🔴 **Red**: Fake news classification
- 🟢 **Green**: Real news classification

## Troubleshooting

### "Unable to connect to the backend" Error
1. Ensure Flask server is running: `python app.py` in the backend folder
2. Check that the backend is on `http://localhost:5000`
3. Check browser console (F12) for detailed error messages

### CORS Errors
1. Make sure `flask-cors` is installed: `pip install flask-cors`
2. Restart the Flask server after installing packages
3. Check that the app has CORS enabled in `app.py`

### Frontend not updating after changes
1. Hard refresh the page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Check console for JavaScript errors (F12)

## Future Enhancements

- Add URL input for direct article analysis
- Support for multiple languages
- Save analysis history locally
- Export results as PDF
- Integration with news RSS feeds
- Advanced filtering options

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Advanced styling and animations
- **Vanilla JavaScript**: No dependencies, pure JS
- **Fetch API**: Browser HTTP client
- **Flask**: Backend API server

## License

This project is part of the Fake News Detector system.

## Support

For issues or questions, check the main project README in the root directory.
