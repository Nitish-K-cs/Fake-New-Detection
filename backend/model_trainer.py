"""
Train and save the fake news classification model
Run this script once to train the model and save it
"""

import pandas as pd
import re
import string
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

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

def train_model():
    """Train the fake news classifier and save model and vectorizer"""
    
    print("Loading data...")
    df_fake = pd.read_csv('FakeNew.csv')
    df_true = pd.read_csv('TrueNew.csv')
    
    # Label the data
    df_fake["class"] = 0
    df_true["class"] = 1
    
    # Remove last 10 samples from each for manual testing
    df_fake_manual_testing = df_fake.tail(10)
    for i in range(23480, 23470, -1):
        df_fake.drop([i], axis=0, inplace=True)
    
    df_true_manual_testing = df_true.tail(10)
    for i in range(21416, 21406, -1):
        df_true.drop([i], axis=0, inplace=True)
    
    # Merge datasets
    df_merge = pd.concat([df_fake, df_true], axis=0)
    
    # Keep only text column
    data = df_merge.drop(["title", "subject", "date"], axis=1)
    
    # Shuffle and reset index
    data = data.sample(frac=1)
    data.reset_index(inplace=True)
    data.drop(['index'], axis=1, inplace=True)
    
    # Clean text
    print("Preprocessing text...")
    data['text'] = data['text'].apply(wordopt)
    
    # Prepare features and labels
    x = data['text']
    y = data['class']
    
    # Split data
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.25)
    
    # Vectorize text
    print("Training vectorizer...")
    vectorization = TfidfVectorizer()
    xv_train = vectorization.fit_transform(x_train)
    xv_test = vectorization.transform(x_test)
    
    # Train model
    print("Training classifier...")
    LR = LogisticRegression()
    LR.fit(xv_train, y_train)
    
    # Evaluate
    score = LR.score(xv_test, y_test)
    print(f"Model accuracy: {score:.4f}")
    
    # Save model and vectorizer
    print("Saving model...")
    with open('model.pkl', 'wb') as f:
        pickle.dump(LR, f)
    
    with open('vectorizer.pkl', 'wb') as f:
        pickle.dump(vectorization, f)
    
    print("Model and vectorizer saved successfully!")
    print("Files: model.pkl, vectorizer.pkl")

if __name__ == "__main__":
    train_model()
