from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Review
from config import Config
from transformers import pipeline
import google.generativeai as genai
import logging
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)

sentiment_analyzer = None
gemini_model = None

def init_models():
    global sentiment_analyzer, gemini_model

    try:
        logger.info("Loading Hugging Face sentiment model...")
        sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english"
        )
        logger.info("Sentiment model loaded.")

        logger.info("Configuring Gemini API...")
        genai.configure(api_key=Config.GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-pro')
        logger.info("Gemini configured.")

    except Exception as e:
        logger.error(f"Model init error: {str(e)}")
        raise

def analyze_sentiment(text):
    try:
        result = sentiment_analyzer(text[:512])[0]
        sentiment = result['label'].lower()
        confidence = result['score']

        if sentiment == 'positive' and confidence > 0.6:
            return 'positive', confidence
        elif sentiment == 'negative' and confidence > 0.6:
            return 'negative', confidence
        else:
            return 'neutral', confidence

    except Exception as e:
        logger.error(f"Sentiment error: {str(e)}")
        raise

def extract_key_points(text):
    try:
        prompt = f"""Extract 3–5 key points from this review.
Return ONLY a JSON array of strings.

Review: {text}
"""
        response = gemini_model.generate_content(prompt)
        raw = response.text.strip()
        raw = raw.replace('`json','').replace('`','').strip()

        return json.loads(raw)

    except Exception as e:
        logger.error(f"Keypoint error: {str(e)}")
        return [
            "General product quality noted",
            "Customer experience observed",
            "Overall sentiment included"
        ]

@app.route('/api/analyze-review', methods=['POST'])
def analyze_review():
    try:
        data = request.get_json()

        if not data or 'review_text' not in data:
            return jsonify({'error': 'review_text is required'}), 400

        text = data['review_text'].strip()

        if len(text) < 10:
            return jsonify({'error': 'review_text too short'}), 400

        sentiment, confidence = analyze_sentiment(text)
        key_points = extract_key_points(text)

        review = Review(
            review_text=text,
            sentiment=sentiment,
            confidence=float(confidence),
            key_points=key_points
        )

        db.session.add(review)
        db.session.commit()

        return jsonify(review.to_dict()), 201

    except Exception as e:
        logger.error(f"Analyze error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    try:
        reviews = Review.query.order_by(Review.created_at.desc()).all()
        return jsonify([r.to_dict() for r in reviews])
    except Exception as e:
        logger.error(f"Fetch error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'sentiment_model_loaded': sentiment_analyzer is not None,
        'gemini_configured': gemini_model is not None
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        init_models()

    app.run(debug=True, port=5000, host='0.0.0.0')
