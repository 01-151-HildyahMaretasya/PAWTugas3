import { useState, useEffect } from "react";
import {
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  BarChart3,
  CheckCircle,
  MessageSquare,
  Star,
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
    "This moisturizer is amazing! My dry skin feels so hydrated and soft. I've been using it for 2 weeks and noticed significant improvement.",
    "Disappointed with this serum. It broke me out after 3 days of use. The texture is too heavy for my oily skin.",
    "Decent product but nothing special. It moisturizes okay but I don't see any dramatic changes. The price is reasonable though.",
  ];

  const getSentimentIcon = (sentiment) => {
    if (sentiment === "positive")
      return <TrendingUp className="text-emerald-500" size={18} />;
    if (sentiment === "negative")
      return <TrendingDown className="text-rose-500" size={18} />;
    return <Minus className="text-amber-500" size={18} />;
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === "positive") return "border-emerald-200 bg-emerald-50/50";
    if (sentiment === "negative") return "border-rose-200 bg-rose-50/50";
    return "border-amber-200 bg-amber-50/50";
  };

  const getSentimentBadge = (sentiment) => {
    if (sentiment === "positive") return "bg-emerald-500 text-white";
    if (sentiment === "negative") return "bg-rose-500 text-white";
    return "bg-amber-500 text-white";
  };

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`${API_URL}/reviews`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAllReviews(data);
    } catch (err) {
      console.error("Load reviews error:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    const trimmed = (review ?? "").trim();
    if (!trimmed) return setError("Please enter a review");
    if (trimmed.length < 20)
      return setError("Review must be at least 20 characters");

    const payload = {
      product_name: productName || null,
      skin_type: skinType || null,
      review_text: trimmed,
    };

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const msg =
          (data && (data.error || data.detail)) ||
          `Request failed (${response.status})`;
        throw new Error(msg);
      }

      setResult(data);
      setAllReviews((prev) => [data, ...(prev || [])]);
      setReview("");
      setProductName("");
      setSkinType("");
    } catch (err) {
      console.error("Analyze error:", err);
      setError(err.message || "Failed to analyze review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Skincare Analyzer
                </h1>
                <p className="text-xs text-slate-500">AI-Powered Insights</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Analyze Skincare Reviews
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Get instant AI-powered sentiment analysis and extract key insights from product reviews
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Positive</p>
                <p className="text-2xl font-bold text-slate-900">
                  {allReviews.filter((r) => r.sentiment === "positive").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Negative</p>
                <p className="text-2xl font-bold text-slate-900">
                  {allReviews.filter((r) => r.sentiment === "negative").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="text-rose-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Analyzed</p>
                <p className="text-2xl font-bold text-slate-900">
                  {allReviews.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-violet-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="border-b border-slate-200/60 px-6 py-4 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <MessageSquare size={20} className="text-violet-600" />
                  New Review Analysis
                </h3>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Product Name
                      <span className="text-slate-400 font-normal ml-1">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g., CeraVe Moisturizing Cream"
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Skin Type
                      <span className="text-slate-400 font-normal ml-1">
                        (Optional)
                      </span>
                    </label>
                    <select
                      value={skinType}
                      onChange={(e) => setSkinType(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Review
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your detailed experience with the product..."
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none transition-all"
                    rows={5}
                    disabled={loading}
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    {review.length} / 20 characters minimum
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-600 mb-2">
                    Quick examples:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exampleReviews.map((ex, idx) => (
                      <button
                        key={idx}
                        onClick={() => setReview(ex)}
                        className="px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                        disabled={loading}
                      >
                        Example {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                    <AlertCircle className="text-rose-600 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-sm text-rose-800">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || !review.trim()}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Analyze Review
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Result Card */}
            {result && (
              <div className={`rounded-xl shadow-sm border-2 overflow-hidden mt-6 ${getSentimentColor(result.sentiment)}`}>
                <div className="bg-white/80 backdrop-blur-sm px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      {getSentimentIcon(result.sentiment)}
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Analysis Complete
                        </h3>
                        <p className="text-sm text-slate-600">
                          {(result.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getSentimentBadge(
                        result.sentiment
                      )}`}
                    >
                      {result.sentiment.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-slate-700">
                        Confidence Score
                      </p>
                      <span className="text-xl font-bold text-slate-900">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          result.confidence >= 0.8
                            ? "bg-emerald-500"
                            : result.confidence >= 0.6
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Original Review
                    </p>
                    <p className="text-slate-800 text-sm leading-relaxed">
                      {result.review_text}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                      <Sparkles size={16} className="text-violet-600" />
                      Key Insights
                    </p>
                    <ul className="space-y-2">
                      {(Array.isArray(result.key_points)
                        ? result.key_points
                        : []
                      ).map((point, idx) => (
                        <li
                          key={idx}
                          className="flex gap-2.5 items-start p-2.5 bg-slate-50 rounded-lg"
                        >
                          <span className="flex-shrink-0 w-5 h-5 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                            {idx + 1}
                          </span>
                          <span className="text-slate-800 text-sm leading-relaxed">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Cards Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-violet-100 leading-relaxed">
                Our advanced AI analyzes sentiment, extracts key points, and provides confidence scores for every review.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Features
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-600 rounded-full"></div>
                  Sentiment Detection
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-600 rounded-full"></div>
                  Key Points Extraction
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-600 rounded-full"></div>
                  Confidence Scoring
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-600 rounded-full"></div>
                  Instant Results
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="text-amber-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                How It Works
              </h3>
              <ol className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="font-semibold text-violet-600">1.</span>
                  Enter product details
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-violet-600">2.</span>
                  Paste or write review
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-violet-600">3.</span>
                  Get instant analysis
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-violet-600">4.</span>
                  View key insights
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="border-b border-slate-200/60 px-6 py-4 bg-slate-50/50">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Reviews
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Previously analyzed skincare reviews
            </p>
          </div>

          <div className="p-6">
            {loadingReviews ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2
                  size={36}
                  className="animate-spin text-violet-600 mb-3"
                />
                <p className="text-slate-600 text-sm">Loading reviews...</p>
              </div>
            ) : allReviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="text-slate-400" size={28} />
                </div>
                <p className="text-slate-900 font-semibold mb-1">
                  No reviews yet
                </p>
                <p className="text-slate-500 text-sm">
                  Be the first to analyze a review!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {allReviews.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-4 hover:shadow-sm transition-all ${getSentimentColor(
                      item.sentiment
                    )}`}
                  >
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {getSentimentIcon(item.sentiment)}
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold ${getSentimentBadge(
                            item.sentiment
                          )}`}
                        >
                          {item.sentiment.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-600">
                          {(item.confidence * 100).toFixed(0)}% confident
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock size={13} />
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    <p className="text-slate-800 text-sm leading-relaxed mb-3">
                      {item.review_text}
                    </p>

                    <details className="group">
                      <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium text-sm flex items-center gap-2 list-none">
                        <Sparkles size={14} />
                        <span>View Insights</span>
                        <span className="ml-auto text-slate-400 group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <ul className="space-y-2">
                          {(Array.isArray(item.key_points)
                            ? item.key_points
                            : []
                          ).map((pt, idx) => (
                            <li
                              key={idx}
                              className="flex gap-2 items-start text-sm"
                            >
                              <span className="flex-shrink-0 w-5 h-5 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                {idx + 1}
                              </span>
                              <span className="text-slate-700">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200">
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-1">
              Built with React • Flask • PostgreSQL • AI APIs
            </p>
            <p className="text-xs text-slate-400">
              © 2025 Skincare Analyzer. AI-powered beauty insights.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}