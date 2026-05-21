"""
Client script to test the fake news classifier API
"""

import requests
import json

API_URL = "http://localhost:5000/predict"

def classify_news(text):
    """Send a text to the API and get the prediction"""
    try:
        payload = {"text": text}
        response = requests.post(API_URL, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            return result
        else:
            return {"error": f"API Error: {response.status_code}", "details": response.json()}
    
    except requests.exceptions.ConnectionError:
        return {"error": "Cannot connect to API. Make sure app.py is running on localhost:5000"}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Test examples
    test_texts = [
        "Breaking news: Scientists discover new method to cure cancer",
        "Political scandal: Secret documents leaked online revealing corruption",
        "Celebrity gossip: Famous actor spotted at local restaurant"
    ]
    
    print("=" * 60)
    print("Fake News Classifier - Client Test")
    print("=" * 60)
    
    for text in test_texts:
        print(f"\nTesting: {text[:50]}...")
        result = classify_news(text)
        print(json.dumps(result, indent=2))
    
    # Interactive mode
    print("\n" + "=" * 60)
    print("Interactive Mode (type 'quit' to exit)")
    print("=" * 60)
    
    while True:
        user_text = input("\nEnter news text to classify (or 'quit'): ").strip()
        
        if user_text.lower() == 'quit':
            print("Goodbye!")
            break
        
        if user_text:
            result = classify_news(user_text)
            print("\nResult:")
            print(json.dumps(result, indent=2))
