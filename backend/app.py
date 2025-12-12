# app.py
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

# global model handles
sentiment_analyzer = None
gemini_model = None

def init_models():
    global sentiment_analyzer, gemini_model

    try:
        logger.info("Loading Hugging Face multilingual sentiment model...")
        # Multilingual sentiment model -> returns 1-5 stars labels
        sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="nlptown/bert-base-multilingual-uncased-sentiment"
        )
        logger.info("Sentiment model loaded (nlptown/bert-base-multilingual-uncased-sentiment).")

        logger.info("Configuring Gemini API...")
        genai.configure(api_key=Config.GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-pro')
        logger.info("Gemini configured.")

    except Exception as e:
        logger.error(f"Model init error: {str(e)}")
        # raise so startup fails loudly if needed (but you can comment out init_models() in main if it blocks startup)
        raise

def analyze_sentiment(text):
    """
    Uses multilingual 1-5 star model and maps to positive/neutral/negative.
    """
    try:
        # limit length to avoid extremely long pipeline input
        result = sentiment_analyzer(text[:512])[0]
        raw_label = result.get('label', '')
        score = float(result.get('score', 0.0))

        # extract first digit as star rating if present
        star = None
        for ch in raw_label:
            if ch.isdigit():
                star = int(ch)
                break

        if star is not None:
            if star in (4, 5):
                return 'positive', score
            elif star == 3:
                return 'neutral', score
            else:
                return 'negative', score
        else:
            lower = raw_label.lower()
            if 'positive' in lower:
                return 'positive', score
            if 'negative' in lower:
                return 'negative', score
            return 'neutral', score

    except Exception as e:
        logger.error(f"Sentiment error: {str(e)}")
        # fallback conservative
        return 'neutral', 0.0

def extract_key_points(text):
    """
    Use Gemini to extract 3-5 key points. If Gemini fails, return safe fallback list.
    """
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
        # log raw body for debugging (helps when Content-Type or JSON is malformed)
        raw_body = request.get_data(as_text=True)
        logger.info(f"Raw request body: {raw_body}")

        # parse JSON silently
        data = request.get_json(silent=True)
        logger.info(f"Parsed JSON payload: {data}")

        if not data or 'review_text' not in data:
            return jsonify({'error': 'review_text is required', 'raw_body': raw_body}), 400

        text = data['review_text'].strip()
        # robust mapping: accept both snake_case and camelCase
        product_name = data.get('product_name') or data.get('productName')
        skin_type = data.get('skin_type') or data.get('skinType')

        logger.info(f"Mapped fields -> product_name: {product_name!r}, skin_type: {skin_type!r}")

        if len(text) < 10:
            return jsonify({'error': 'review_text too short'}), 400

        sentiment, confidence = analyze_sentiment(text)
        key_points = extract_key_points(text)

        review = Review(
            product_name=product_name,
            skin_type=skin_type,
            review_text=text,
            sentiment=sentiment,
            confidence=float(confidence),
            key_points=key_points
        )

        db.session.add(review)
        db.session.commit()

        logger.info(f"Saved review id={review.id} product_name={product_name} skin_type={skin_type}")
        return jsonify(review.to_dict()), 201

    except Exception as e:
        # full stacktrace to log
        logger.exception("Analyze error")
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'detail': str(e)}), 500

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    try:
        reviews = Review.query.order_by(Review.created_at.desc()).all()
        return jsonify([r.to_dict() for r in reviews])
    except Exception as e:
        logger.exception("Fetch error")
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
        # create missing tables (does not ALTER existing tables)
        db.create_all()
        init_models()

    app.run(debug=True, port=5000, host='0.0.0.0')
