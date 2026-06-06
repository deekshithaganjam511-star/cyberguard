import { useState } from "react";

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/•/g, "•");
}

function ResultText({ text }) {
  const lines = text.split("\n").filter((l) => l.trim() !== "");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => (
        <p
          key={i}
          className="text-sm text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(line) }}
        />
      ))}
    </div>
  );
}

function App() {
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [smsText, setSmsText] = useState("");
  const [smsResult, setSmsResult] = useState(null);
  const [smsVerdict, setSmsVerdict] = useState(null);
  const [smsLoading, setSmsLoading] = useState(false);
  const [urlText, setUrlText] = useState("");
  const [urlResult, setUrlResult] = useState(null);
  const [urlVerdict, setUrlVerdict] = useState(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [tipResult, setTipResult] = useState(null);
  const [tipLoading, setTipLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeTab, setActiveTab] = useState("job");

  const getVerdict = (text) => {
    if (text.includes("HIGH RISK") || text.includes("SCAM")) return "scam";
    if (text.includes("MODERATE RISK") || text.includes("SUSPICIOUS"))
      return "suspicious";
    if (text.includes("LOW RISK") || text.includes("LEGITIMATE"))
      return "legitimate";
    return "unknown";
  };

  const analyzeJob = async () => {
    if (!jobText.trim()) return;
    setLoading(true);
    setResult(null);
    setVerdict(null);
    try {
      const res = await fetch("http://localhost:8000/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: jobText }),
      });
      const data = await res.json();
      setResult(data.result);
      setVerdict(getVerdict(data.result));
    } catch {
      setResult("Error connecting to server.");
      setVerdict("unknown");
    }
    setLoading(false);
  };

  const analyzeSMS = async () => {
    if (!smsText.trim()) return;
    setSmsLoading(true);
    setSmsResult(null);
    setSmsVerdict(null);
    try {
      const res = await fetch("http://localhost:8000/analyze-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: smsText }),
      });
      const data = await res.json();
      setSmsResult(data.result);
      setSmsVerdict(getVerdict(data.result));
    } catch {
      setSmsResult("Error connecting to server.");
      setSmsVerdict("unknown");
    }
    setSmsLoading(false);
  };

  const analyzeURL = async () => {
    if (!urlText.trim()) return;
    setUrlLoading(true);
    setUrlResult(null);
    setUrlVerdict(null);
    try {
      const res = await fetch("http://localhost:8000/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: urlText }),
      });
      const data = await res.json();
      setUrlResult(data.result);
      setUrlVerdict(getVerdict(data.result));
    } catch {
      setUrlResult("Error connecting to server.");
      setUrlVerdict("unknown");
    }
    setUrlLoading(false);
  };

  const getTip = async (topic) => {
    setActiveTopic(topic);
    setTipLoading(true);
    setTipResult(null);
    try {
      const res = await fetch("http://localhost:8000/get-tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setTipResult(data.result);
    } catch {
      setTipResult("Error connecting to server.");
    }
    setTipLoading(false);
  };

  const verdictConfig = {
    scam: {
      bg: "bg-red-50",
      border: "border-red-300",
      badge: "bg-red-100 text-red-700",
      icon: "🚨",
      label: "SCAM DETECTED",
    },
    suspicious: {
      bg: "bg-yellow-50",
      border: "border-yellow-300",
      badge: "bg-yellow-100 text-yellow-700",
      icon: "⚠️",
      label: "SUSPICIOUS",
    },
    legitimate: {
      bg: "bg-green-50",
      border: "border-green-300",
      badge: "bg-green-100 text-green-700",
      icon: "✅",
      label: "LOOKS SAFE",
    },
    unknown: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      badge: "bg-gray-100 text-gray-700",
      icon: "🔍",
      label: "ANALYZED",
    },
  };

  const topics = [
    {
      icon: "🎣",
      title: "Phishing Emails",
      key: "phishing emails for Indian students",
    },
    {
      icon: "🔐",
      title: "Password Safety",
      key: "password safety tips for students",
    },
    {
      icon: "📱",
      title: "Social Media Privacy",
      key: "social media privacy for Indian students",
    },
    {
      icon: "🛍️",
      title: "Safe Online Shopping",
      key: "safe online shopping tips for Indian students",
    },
    {
      icon: "💼",
      title: "Internship Scams",
      key: "internship scams targeting Indian fresh graduates",
    },
    {
      icon: "📶",
      title: "Public WiFi Risks",
      key: "public WiFi dangers for college students",
    },
  ];

  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4 inline mr-2"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  );

  const ResultCard = ({ result, verdictKey }) => {
    const vc = verdictConfig[verdictKey];
    return (
      <div
        className={`mt-6 ${vc.bg} ${vc.border} border rounded-xl p-4 animate-pulse-once`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{vc.icon}</span>
          <span
            className={`${vc.badge} text-xs font-bold px-3 py-1 rounded-full tracking-wide`}
          >
            {vc.label}
          </span>
        </div>
        <ResultText text={result} />
      </div>
    );
  };

  const vc = verdict ? verdictConfig[verdict] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 text-blue-300 text-sm mb-4">
            🛡️ Student Cybersecurity Tool
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            CyberGuard
          </h1>
          <p className="text-slate-400 mt-2">
            Protecting students & fresh graduates from online scams
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            ["job", "💼", "Fake Job"],
            ["sms", "💬", "Scam SMS"],
            ["url", "🔗", "URL Check"],
            ["tips", "💡", "Learn"],
          ].map(([tab, icon, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Job Tab */}
        {activeTab === "job" && (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-xl">
                🔍
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">
                  Fake Job Detector
                </h2>
                <p className="text-slate-400 text-sm">
                  Paste any job offer to check if it's a scam
                </p>
              </div>
            </div>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
              rows={5}
              placeholder="Paste job description here..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
            />
            <button
              onClick={analyzeJob}
              disabled={loading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner />
                  Analyzing...
                </>
              ) : (
                "🔍 Analyze Job"
              )}
            </button>
            {result && vc && (
              <ResultCard result={result} verdictKey={verdict} />
            )}
          </div>
        )}

        {/* SMS Tab */}
        {activeTab === "sms" && (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-xl">
                💬
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">
                  Scam SMS Analyzer
                </h2>
                <p className="text-slate-400 text-sm">
                  Paste any suspicious SMS or WhatsApp message
                </p>
              </div>
            </div>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={5}
              placeholder="Paste suspicious message here..."
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
            />
            <button
              onClick={analyzeSMS}
              disabled={smsLoading}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {smsLoading ? (
                <>
                  <Spinner />
                  Analyzing...
                </>
              ) : (
                "💬 Analyze Message"
              )}
            </button>
            {smsResult && smsVerdict && (
              <ResultCard result={smsResult} verdictKey={smsVerdict} />
            )}
          </div>
        )}

        {/* URL Tab */}
        {activeTab === "url" && (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-xl">
                🔗
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">
                  URL Analyzer
                </h2>
                <p className="text-slate-400 text-sm">
                  Check if a link is safe before clicking
                </p>
              </div>
            </div>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={3}
              placeholder="Paste URL here... e.g. http://sbi-kyc-update.xyz/login"
              value={urlText}
              onChange={(e) => setUrlText(e.target.value)}
            />
            <button
              onClick={analyzeURL}
              disabled={urlLoading}
              className="mt-4 w-full bg-green-600 hover:bg-green-500 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {urlLoading ? (
                <>
                  <Spinner />
                  Analyzing...
                </>
              ) : (
                "🔗 Check URL"
              )}
            </button>
            {urlResult && urlVerdict && (
              <ResultCard result={urlResult} verdictKey={urlVerdict} />
            )}
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === "tips" && (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center text-xl">
                💡
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">
                  Cybersecurity Tips
                </h2>
                <p className="text-slate-400 text-sm">
                  Click a topic to get a quick tip
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {topics.map((t) => (
                <button
                  key={t.key}
                  onClick={() => getTip(t.key)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 active:scale-95 ${activeTopic === t.key ? "bg-yellow-500/20 border-yellow-400/50 shadow-lg" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"}`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="text-white text-sm font-medium">
                    {t.title}
                  </div>
                </button>
              ))}
            </div>
            {tipLoading && (
              <div className="text-center py-6">
                <Spinner />
                <span className="text-slate-400 text-sm">Loading tip...</span>
              </div>
            )}
            {tipResult && !tipLoading && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <ResultText text={tipResult} />
              </div>
            )}
          </div>
        )}

        <p className="text-center text-slate-600 text-xs mt-6">
          CyberGuard — Built for students by students 🎓
        </p>
      </div>
    </div>
  );
}

export default App;
