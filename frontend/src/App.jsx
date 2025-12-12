import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, TrendingUp, TrendingDown, Minus, Loader2, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'positive') return <TrendingUp className="text-green-500" size={24} />;
    if (sentiment === 'negative') return <TrendingDown className="text-red-500" size={24} />;
    return <Minus className="text-yellow-500" size={24} />;
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'positive') return 'bg-green-50 border-green-200';
    if (sentiment === 'negative') return 'bg-red-50 border-red-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  const getSentimentBadge = (sentiment) => {
    if (sentiment === 'positive') return 'bg-green-100 text-green-800';
    if (sentiment === 'negative') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await axios.get(`${API_URL}/reviews`);
      setAllReviews(response.data);
    } catch {
      setError('Failed to load reviews');
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmit = async () => {
    if (!review.trim()) {
      setError('Please enter a review');
      return;
    }
    if (review.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/analyze-review`, {
        review_text: review
      });

      setResult(response.data);
      setAllReviews(prev => [response.data, ...prev]);
      setReview('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Review Analyzer</h1>
          <p className="text-gray-600">AI-powered sentiment analysis and key points extraction</p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter Product Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Type your product review here... (minimum 10 characters)"
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading}
          />
          
          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !review.trim()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing...
              </>
            ) : (
              <>
                <Send size={20} />
                Analyze Review
              </>
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className={`rounded-2xl shadow-lg p-6 mb-8 border-2 ${getSentimentColor(result.sentiment)}`}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Analysis Result</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getSentimentIcon(result.sentiment)}
                <div>
                  <p className="text-sm text-gray-600">Sentiment</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentBadge(result.sentiment)}`}>
                      {result.sentiment.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {(result.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Review</p>
                <p className="text-gray-800 bg-white p-3 rounded-lg border border-gray-200">
                  {result.review_text}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Key Points</p>
                <ul className="space-y-2">
                  {result.key_points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* All Reviews */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reviews</h2>

          {loadingReviews ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : allReviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet. Submit your first review above!</p>
          ) : (
            <div className="space-y-4">
              {allReviews.map((item) => (
                <div key={item.id} className={`p-4 rounded-lg border ${getSentimentColor(item.sentiment)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(item.sentiment)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentBadge(item.sentiment)}`}>
                        {item.sentiment}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-2">{item.review_text}</p>

                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-700">View key points</summary>
                    <ul className="mt-2 space-y-1 ml-4">
                      {item.key_points.map((point, idx) => (
                        <li key={idx} className="text-gray-600">• {point}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Tech Stack: React + Flask + PostgreSQL + Hugging Face + Gemini API</p>
        </div>

      </div>
    </div>
  );
}
