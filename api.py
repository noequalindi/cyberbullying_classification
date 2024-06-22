from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np

class TextRequest(BaseModel):
    clean_tweet: str

app = FastAPI()

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

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
