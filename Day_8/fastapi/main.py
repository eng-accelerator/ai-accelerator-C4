from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# Load model at startup
sentiment_model = pipeline("sentiment-analysis", 
                          model="distilbert-base-uncased-finetuned-sst-2-english")

class TextRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    text: str
    label: str
    score: float

@app.get("/")
def health_check():
    return {"status": "API is running"}

@app.post("/analyze", response_model=SentimentResponse)
def analyze_sentiment(request: TextRequest):
    result = sentiment_model(request.text)[0]
    
    return SentimentResponse(
        text=request.text,
        label=result["label"],
        score=round(result["score"], 4)
    )
