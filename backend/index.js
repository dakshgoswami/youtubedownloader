import express from "express";
import cors from "cors";
import ytdl from "@distube/ytdl-core";

const app = express();
app.use(cors());

function normalizeYouTubeUrl(url) {
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
        return null;
    }
    
    // Convert shortened YouTube URLs (youtu.be) to full URLs
    if (url.includes("youtu.be")) {
        const videoId = url.split("/").pop().split("?")[0];
        return `https://www.youtube.com/watch?v=${videoId}`;
    }

    return url;
}

app.get("/videoInfo", async (req, res) => {
    let videoUrl = req.query.url;

    // Normalize and validate URL
    videoUrl = normalizeYouTubeUrl(videoUrl);
    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    try {
        const info = await ytdl.getInfo(videoUrl);

        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails.pop().url,
            url: videoUrl // Pass video URL for direct download
        });
    } catch (error) {
        console.error("Error fetching video info:", error.message);
        res.status(500).json({ error: "Failed to fetch video information" });
    }
});

app.get("/download", async (req, res) => {
    let videoUrl = req.query.url;
    videoUrl = normalizeYouTubeUrl(videoUrl);

    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ error: "Invalid or missing YouTube URL" });
    }

    try {
        res.header("Content-Disposition", "attachment; filename=video.mp4");
        ytdl(videoUrl, { quality: "highest" }).pipe(res);
    } catch (error) {
        console.error("Error downloading video:", error.message);
        res.status(500).json({ error: "Failed to download video" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
