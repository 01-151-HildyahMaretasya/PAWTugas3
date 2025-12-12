import { useState, useEffect } from "react";
import {
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
  Heart,
  Star,
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function App() {
  const [review, setReview] = useState("");
  const [productName, setProductName] = useState("");
  const [skinType, setSkinType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const skinTypes = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];

  const exampleReviews = [
    "This moisturizer is amazing! My dry skin feels so hydrated and soft. I've been using it for 2 weeks and noticed significant improvement. No irritation at all!",
    "Disappointed with this serum. It broke me out after 3 days of use. The texture is too heavy for my oily skin and didn't absorb well.",
    "Decent product but nothing special. It moisturizes okay but I don't see any dramatic changes. The price is reasonable though.",
  ];

  const getSentimentIcon = (sentiment) => {
    if (sentiment === "positive")
      return <CheckCircle2 className="text-green-500" size={24} />;
    if (sentiment === "negative")
      return <XCircle className="text-red-500" size={24} />;
    return <AlertTriangle className="text-yellow-500" size={24} />;
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === "positive")
      return "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200";
    if (sentiment === "negative")
      return "bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border-red-200";
    return "bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-yellow-200";
  };

  const getSentimentBadge = (sentiment) => {
    if (sentiment === "positive")
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
    if (sentiment === "negative")
      return "bg-gradient-to-r from-red-500 to-rose-600 text-white";
    return "bg-gradient-to-r from-yellow-500 to-amber-600 text-white";
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-blue-600";
    return "text-yellow-600";
  };

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`${API_URL}/reviews`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAllReviews(data);
    } catch {
      setError("Failed to load reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmit = async () => {
    if (!review.trim()) return setError("Please enter a review");
    if (review.trim().length < 20)
      return setError("Review must be at least 20 characters");

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_text: review }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setResult(data);
      setAllReviews((prev) => [data, ...prev]);
      setReview("");
      setProductName("");
      setSkinType("");
    } catch (err) {
      setError("Failed to analyze review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillExample = (example) => {
    setReview(example);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white py-12 shadow-xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={40} className="animate-pulse" />
            <h1 className="text-5xl font-black tracking-tight">
              Skincare Review Analyzer
            </h1>
            <Heart size={40} className="animate-pulse" />
          </div>
          <p className="text-center text-xl text-pink-100 font-medium">
            AI-Powered Sentiment Analysis for Skincare Products
          </p>
          <p className="text-center text-sm text-pink-200 mt-2">
            Get instant insights on product effectiveness, skin compatibility, and user experiences
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 mt-8">
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-2">
              <Star className="text-purple-500" size={24} />
              <h3 className="font-bold text-gray-800">Smart Analysis</h3>
            </div>
            <p className="text-sm text-gray-600">
              Advanced AI detects sentiment and extracts key product insights
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-pink-500">
            <div className="flex items-center gap-3 mb-2">
              <Package className="text-pink-500" size={24} />
              <h3 className="font-bold text-gray-800">Product Context</h3>
            </div>
            <p className="text-sm text-gray-600">
              Understand effectiveness, side effects, and user experiences
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-rose-500">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="text-rose-500" size={24} />
              <h3 className="font-bold text-gray-800">Skin Type Aware</h3>
            </div>
            <p className="text-sm text-gray-600">
              Filter reviews by skin type for personalized recommendations
            </p>
          </div>
        </div>

        {/* Main Input Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-10 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-purple-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">
              Analyze Skincare Review
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Product Name (Optional)
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Cetaphil Moisturizer, The Ordinary Niacinamide"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Skin Type (Optional)
              </label>
              <select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                disabled={loading}
              >
                <option value="">Select skin type...</option>
                {skinTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Product Review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your detailed experience with the product...&#10;&#10;Example: 'I've been using this vitamin C serum for 3 weeks. My skin looks brighter and dark spots are fading. However, it tingles a bit on application. Overall satisfied with results!'"
            className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-gray-50 text-gray-800"
            disabled={loading}
          />

          <div className="flex items-center gap-2 mt-3 mb-4 flex-wrap">
            <span className="text-xs text-gray-500">Quick fill:</span>
            {exampleReviews.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => fillExample(ex)}
                className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                disabled={loading}
              >
                Example {idx + 1}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !review.trim()}
            className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg transition-all disabled:from-gray-400 disabled:to-gray-500 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Analyzing Review...
              </>
            ) : (
              <>
                <Send size={22} />
                Analyze Review
              </>
            )}
          </button>
        </div>

        {/* Result Card */}
        {result && (
          <div
            className={`rounded-2xl shadow-2xl p-8 mb-10 border-2 ${getSentimentColor(
              result.sentiment
            )}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                {getSentimentIcon(result.sentiment)}
                Analysis Complete
              </h2>
              <span
                className={`px-5 py-2 rounded-full text-sm font-bold shadow-md ${getSentimentBadge(
                  result.sentiment
                )}`}
              >
                {result.sentiment.toUpperCase()}
              </span>
            </div>

            <div className="space-y-6">
              <div className="bg-white bg-opacity-60 p-5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">
                    Confidence Score
                  </p>
                  <span
                    className={`text-2xl font-bold ${getConfidenceColor(
                      result.confidence
                    )}`}
                  >
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.confidence >= 0.8
                        ? "bg-green-500"
                        : result.confidence >= 0.6
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white bg-opacity-60 p-5 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Original Review
                </p>
                <p className="text-gray-800 leading-relaxed">
                  {result.review_text}
                </p>
              </div>

              <div className="bg-white bg-opacity-60 p-5 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-500" />
                  Key Insights Extracted
                </p>
                <ul className="space-y-3">
                  {result.key_points.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 items-start text-gray-800"
                    >
                      <span className="text-purple-600 font-bold text-lg mt-1">
                        •
                      </span>
                      <span className="flex-1">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Recent Reviews Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-purple-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Star className="text-purple-500" size={28} />
            Recent Skincare Reviews
          </h2>

          {loadingReviews ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 size={48} className="animate-spin text-purple-600 mb-4" />
              <p className="text-gray-500">Loading reviews...</p>
            </div>
          ) : allReviews.length === 0 ? (
            <div className="text-center py-16">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                No reviews yet
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Be the first to share your skincare experience!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allReviews.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-xl border-2 ${getSentimentColor(
                    item.sentiment
                  )} hover:shadow-lg transition-all`}
                >
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      {getSentimentIcon(item.sentiment)}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getSentimentBadge(
                          item.sentiment
                        )}`}
                      >
                        {item.sentiment.toUpperCase()}
                      </span>
                      <span
                        className={`text-sm font-semibold ${getConfidenceColor(
                          item.confidence
                        )}`}
                      >
                        {(item.confidence * 100).toFixed(0)}% confident
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-gray-800 text-sm leading-relaxed mb-3">
                    {item.review_text}
                  </p>

                  <details className="mt-3">
                    <summary className="cursor-pointer text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-2">
                      <Sparkles size={16} />
                      View Key Insights
                    </summary>
                    <ul className="mt-3 ml-6 space-y-2 bg-white bg-opacity-50 p-4 rounded-lg">
                      {item.key_points.map((pt, idx) => (
                        <li
                          key={idx}
                          className="text-gray-700 text-sm flex gap-2"
                        >
                          <span className="text-purple-500 font-bold">•</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 mt-10 py-6 border-t border-gray-200">
          <p className="flex items-center justify-center gap-2 mb-2">
            <Heart size={16} className="text-pink-500" />
            Built with React • Flask • PostgreSQL • HuggingFace • Gemini API
          </p>
          <p className="text-xs text-gray-400">
            Empowering skincare decisions with AI-driven insights
          </p>
        </footer>
      </div>
    </div>
  );
}