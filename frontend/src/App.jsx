import { useState } from "react";
import axios from "axios";

export default function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVideoInfo = async () => {
    setError(null);
    setVideoInfo(null);

    if (!videoUrl.trim()) {
      setError("❌ Please enter a valid YouTube URL.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/videoInfo?url=${encodeURIComponent(videoUrl)}`
      );
      setVideoInfo(response.data);
    } catch (err) {
      setError(
        "⚠️ Failed to fetch video details. Check the URL and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = () => {
    if (!videoInfo || !videoInfo.url) return;
    window.location.href = `http://localhost:5000/download?url=${encodeURIComponent(
      videoInfo.url
    )}`;
  };

  return (
    <div className="app-container flex flex-col items-center justify-center gap-5 text-center w-full h-screen mx-auto p-4 bg-blue-50 rounded-lg shadow-lg postion-relative">
      <h1 className="text-5xl font-bold text-red-600 font-mono mt-5">
        YouTube Video Downloader
      </h1>

      <div className="input-container my-4 flex justify-center items-center postion-relative w-full gap-4">
        <input
          type="text"
          placeholder="Paste YouTube URL here..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="input-field w-full max-w-md p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={fetchVideoInfo}
          disabled={loading}
          className="fetch-btn px-4 py-2 rounded-lg bg-blue-500 text-white font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        >
          {loading ? "Fetching..." : "Fetch Video"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {videoInfo && (
        <div className="video-container flex flex-col items-center gap-4">
          <h2 className="video-title text-xl font-bold text-blue-600 font-mono mt-5 postion-relative w-full">{videoInfo.title}</h2>
          <img src={videoInfo.thumbnail} alt="Video Thumbnail" className="video-thumbnail w-96"/>
          <button onClick={downloadVideo} className="download-btn px-4 py-2 rounded-lg bg-blue-500 text-white font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer">
            Download
          </button>
        </div>
      )}
    </div>
  );
}
