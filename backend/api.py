from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from joblib import load
from typing import List

origins = [
    "http://localhost",
    "http://localhost:8080", 
    "http://localhost:3000" 
]
class TextRequest(BaseModel):
    clean_tweet: str

class PredictionResult(BaseModel):
    prediction: int

class MetricsResult(BaseModel):
    f1_score: float
    confusion_matrix: List[List[int]]
    accuracy: float
    roc_curve: dict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

model = load('models/gb_model.pkl')

def calculate_features(clean_tweet: str):
    word_count = len(clean_tweet.split())
    text_length = len(clean_tweet)
    return word_count, text_length

@app.post('/predict')
def predict(request: TextRequest):
    try:
        word_count, text_length = calculate_features(request.clean_tweet)
        data = pd.DataFrame([{
            'word_count': word_count,
            'text_length': text_length,
            'clean_tweet': request.clean_tweet
        }])
        prediction = model.predict(data)[0]
        prediction = prediction.item() if isinstance(prediction, np.generic) else prediction
        
        return {'prediction': int(prediction)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Error al predecir: {e}')

# real data results of Gradient Boosting classifier for demonstration purposes
mock_evaluation_results = {
  "model": "GradientBoostingClassifier",
  "train_accuracy": 0.9282893898866387,
  "train_classification_report": {
    "0": {
      "precision": 0.76,
      "recall": 0.93,
      "f1-score": 0.84,
      "support": 5933
    },
    "1": {
      "precision": 0.96,
      "recall": 0.81,
      "f1-score": 0.88,
      "support": 6272
    },
    "2": {
      "precision": 0.97,
      "recall": 0.94,
      "f1-score": 0.95,
      "support": 6465
    },
    "3": {
      "precision": 0.99,
      "recall": 0.98,
      "f1-score": 0.98,
      "support": 6367
    },
    "4": {
      "precision": 1.00,
      "recall": 0.98,
      "f1-score": 0.99,
      "support": 6367
    },
    "accuracy": 0.93,
    "macro_avg": {
      "precision": 0.93,
      "recall": 0.93,
      "f1-score": 0.93,
      "support": 31404
    },
    "weighted_avg": {
      "precision": 0.94,
      "recall": 0.93,
      "f1-score": 0.93,
      "support": 31404
    }
  },
  "test_accuracy": 0.9182373917473255,
  "test_classification_report": {
    "0": {
      "precision": 0.75,
      "recall": 0.91,
      "f1-score": 0.82,
      "support": 1550
    },
    "1": {
      "precision": 0.95,
      "recall": 0.80,
      "f1-score": 0.87,
      "support": 1566
    },
    "2": {
      "precision": 0.96,
      "recall": 0.93,
      "f1-score": 0.95,
      "support": 1529
    },
    "3": {
      "precision": 0.98,
      "recall": 0.97,
      "f1-score": 0.97,
      "support": 1623
    },
    "4": {
      "precision": 0.99,
      "recall": 0.97,
      "f1-score": 0.98,
      "support": 1584
    },
    "accuracy": 0.92,
    "macro_avg": {
      "precision": 0.93,
      "recall": 0.92,
      "f1-score": 0.92,
      "support": 7852
    },
    "weighted_avg": {
      "precision": 0.93,
      "recall": 0.92,
      "f1-score": 0.92,
      "support": 7852
    }
  }
}

@app.get('/metrics', response_model=dict)
def get_evaluation_metrics():
    return mock_evaluation_results
