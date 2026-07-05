const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "t",
    alias: ["v", "ttvid"],
    desc: "Send random TikTok videos",
    category: "download",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Default search queries array
        const defaultQueries = [
            "songs",
            "music", 
            "motivation",
            "funny videos",
            "sad songs",
            "urdu poetry",
            "ego"
        ];

        // Pick random query
        const searchQuery = defaultQueries[Math.floor(Math.random() * defaultQueries.length)];
        
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Search TikTok videos
        const searchUrl = `https://api.danzy.web.id/api/search/tiktok?q=${encodeURIComponent(searchQuery)}`;
        const searchRes = await axios.get(searchUrl);
        const searchData = searchRes.data;

        if (!searchData?.status || !searchData?.result?.length) {
            return await reply(`❌ No videos found! Try again.`);
        }

        // Select random video from results
        const videos = searchData.result;
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        
        // Get video URL
        const videoUrl = randomVideo.link || randomVideo.watermark_link;
        const avatar = randomVideo.author?.avatar || '';

        // Send video with only powered by text
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `> Powered by LOVE-MD ✅`,
            thumbnail: avatar ? { url: avatar } : null
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .t:", e);
        
        if (e.response?.status === 404) {
            await reply("❌ API endpoint not found!");
        } else {
            await reply("❌ Error occurred!\n\n" + e.message);
        }
        
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
