# 🌸 Skincare Review Analyzer

AI-powered sentiment analysis application for skincare product reviews using HuggingFace and Google Gemini API.

![Tech Stack](https://img.shields.io/badge/React-18.x-blue)
![Flask](https://img.shields.io/badge/Flask-3.x-green)
![Python](https://img.shields.io/badge/Python-3.8+-yellow)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)

## Features

- **AI-Powered Sentiment Analysis**: Uses HuggingFace's DistilBERT model to classify reviews as positive, negative, or neutral
- **Key Insights Extraction**: Leverages Google Gemini API to extract important points from reviews
- **Confidence Scoring**: Displays confidence level for each sentiment prediction
- **Persistent Storage**: Saves all reviews and analysis results to PostgreSQL database
- **Beautiful UI**: Modern, responsive interface built with React and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Tampilan awal
<img width="596" height="413" alt="image" src="https://github.com/user-attachments/assets/4e169acd-65af-4cab-9e2d-f1cc95ef7fae" />

### Tampilan setelah review analyzer
<img width="616" height="416" alt="image" src="https://github.com/user-attachments/assets/bb530abf-281f-4b24-8aa5-6d8be97f48ee" />
<img width="586" height="209" alt="image" src="https://github.com/user-attachments/assets/dc77f74a-e46c-49cf-bf78-918d6b25dc3e" />

### Data pada PostgreSQL
<img width="740" height="74" alt="image" src="https://github.com/user-attachments/assets/0db256e2-7acf-46a8-92b8-1fe82fd3ffe5" />

## Architecture

```
┌─────────────┐        ┌──────────────┐       ┌─────────────────┐
│   React     │ ────▶  │  Flask API   │ ────▶ │   PostgreSQL    │
│  Frontend   │ ◀────  │   Backend    │ ◀──── │    Database     │
└─────────────┘        └──────────────┘       └─────────────────┘
                              │
                              ├───▶ HuggingFace (Sentiment)
                              └───▶ Gemini API (Key Points)
```

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 16.x or higher
- PostgreSQL 14 or higher
- HuggingFace account (free)
- Google Gemini API key (free tier available)

### Installation

#### 1. Clone the repository

```bash
git clone <your-repo-url>
cd skincare-review-analyzer
```

#### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/skincare_reviews
GEMINI_API_KEY=your_gemini_api_key_here
```

Create the PostgreSQL database:

```sql
CREATE DATABASE skincare_reviews;
```

#### 3. Frontend Setup

```bash
cd frontend
npm install
```

### Running the Application

#### Start Backend Server

```bash
# Make sure virtual environment is activated
python app.py
```

The backend will run on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔌 API Endpoints

### `POST /api/analyze-review`

Analyze a skincare product review.

**Request Body:**
```json
{
  "product_name": "Emina Suncream",
  "skin_type": "Oily",
  "review_text": "This product works amazingly well on my skin. I noticed improvements within just a few days"
}
```

**Response:**
```json
{
  "id": 12,
  "product_name": "Emina Suncream",
  "skin_type": "Oily",
  "review_text": "This product works amazingly well on my skin. I noticed improvements within just a few days",
  "sentiment": "positive",
  "confidence": 0.93,
  "key_points": ["Absorbs quickly", "Hydrating", "Good for oily skin"],
  "created_at": "2025-12-12T22:03:13.123456"
}
```

### `GET /api/reviews`

Get all analyzed reviews.

**Response:**
```json
  {
    "id": 1,
    "review_text": "...",
    "sentiment": "positive",
    "confidence": 0.9876,
    "key_points": [...],
    "created_at": "2024-12-12T10:30:00"
  },
```

### `GET /api/health`

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "sentiment_model_loaded": true,
  "gemini_configured": true
}
```

**Response:**
```json
{
    "id": 12,
    "product_name": "Emina Suncream",
    "skin_type": "Oily",
    "review_text": "This product works amazingly well ...",
    "sentiment": "positive",
    "confidence": 0.93,
    "key_points": ["Absorbs quickly", "Hydrating"],
    "created_at": "2025-12-12T22:03:13.123456"
  },
```

## Testing the Application

### Manual Testing

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Click one of the "Example" buttons to fill the textarea
4. Click "Analyze Review" button
5. View the analysis results including sentiment, confidence score, and key insights
6. Check the "Recent Skincare Reviews" section to see all analyzed reviews

### Example Test Cases

**Positive Review:**
```
I've been using this vitamin C serum for 3 weeks and my skin looks amazing! 
Dark spots are fading, my complexion is more even, and I'm getting compliments. 
Highly recommend for anyone wanting brighter skin.
```

**Negative Review:**
```
Terrible product! Broke me out within 2 days. Very disappointed as it was expensive. 
The texture is too thick and didn't absorb well on my oily skin. Would not recommend.
```

**Neutral Review:**
```
It's an okay moisturizer. Does the job but nothing special. 
The price is reasonable and it doesn't irritate my skin, but I don't see any dramatic improvements.
```

## UI Features

- **Hero Header**: Eye-catching gradient header with animated icons
- **Feature Cards**: Highlight key features of the analyzer
- **Product Context**: Optional fields for product name and skin type
- **Quick Examples**: One-click buttons to fill example reviews
- **Real-time Analysis**: Loading states with spinner animations
- **Confidence Visualization**: Progress bar showing AI confidence level
- **Collapsible Insights**: Expandable key points in review history
- **Color-Coded Sentiments**: 
  - Green for positive reviews
  - Red for negative reviews
  - Yellow for neutral reviews

## Technologies Used

### Frontend
- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

### Backend
- **Flask**: Lightweight Python web framework
- **Flask-CORS**: Handle Cross-Origin Resource Sharing
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Relational database
- **Transformers (HuggingFace)**: State-of-the-art NLP models
- **Google Generative AI**: Gemini API for text generation

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |

## Database Schema

### `reviews` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key, auto-increment |
| `review_text` | TEXT | Original review content |
| `sentiment` | VARCHAR(20) | Detected sentiment (positive/negative/neutral) |
| `confidence` | FLOAT | Confidence score (0.0 - 1.0) |
| `key_points` | JSON | Array of extracted key insights |
| `created_at` | DATETIME | Timestamp of analysis |

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'transformers'`
```bash
pip install transformers torch
```

**Problem**: `Connection refused` to database
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env file
- Ensure database exists

**Problem**: `Invalid API key` error
- Check GEMINI_API_KEY in .env file
- Verify API key is active at https://makersuite.google.com/app/apikey

### Frontend Issues

**Problem**: `CORS error` when making API calls
- Ensure Flask-CORS is installed
- Check if backend is running on port 5000

**Problem**: Tailwind styles not working
- Run `npm install`
- Check if tailwind.config.js exists
- Verify postcss.config.js is properly configured

## Security Notes

- Never commit `.env` file to version control
- Use environment variables for all sensitive data
- Implement rate limiting for production deployment
- Add input validation and sanitization
- Use HTTPS in production

## Deployment

### Backend 

1. Set environment variables in platform dashboard
2. Update DATABASE_URL for production database
3. Configure Procfile:
```
web: gunicorn app:app
```

### Frontend (Vercel, Netlify)

1. Build the project:
```bash
npm run build
```
2. Deploy the `dist` folder
3. Update API_URL to production backend URL

## Future Enhancements

- [ ] User authentication and personal review history
- [ ] Product recommendations based on skin type
- [ ] Ingredient analysis
- [ ] Review comparison and trends
- [ ] Export reviews as PDF/CSV
- [ ] Multi-language support
- [ ] Image upload for product photos
- [ ] Rating system (1-5 stars)
- [ ] Social sharing features
- [ ] Advanced filtering and search

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
