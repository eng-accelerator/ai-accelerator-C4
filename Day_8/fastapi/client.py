import requests

API_URL = "http://localhost:8000/analyze"

def test_sentiment_analysis():
    # Test cases
    test_texts = [
        "I love this product! It's amazing!",
        "This is terrible and disappointing.",
        "It's okay, nothing special.",
        "Best purchase ever! Highly recommend!"
    ]
    
    print("Testing Sentiment Analysis API\n" + "="*50)
    
    for text in test_texts:
        try:
            response = requests.post(API_URL, json={"text": text})
            response.raise_for_status()
            
            result = response.json()
            print(f"\nText: {result['text']}")
            print(f"Sentiment: {result['label']}")
            print(f"Confidence: {result['score']:.2%}")
            print("-" * 50)
            
        except requests.exceptions.ConnectionError:
            print("ERROR: Cannot connect to API. Make sure the server is running!")
            print("Run: uvicorn main:app --reload")
            break
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_sentiment_analysis()
