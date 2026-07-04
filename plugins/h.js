const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "tiktoksearch",
    alias: ["ttsearch", "t"],
    desc: "Search TikTok videos for songs, motivation, funny, sad, poetry & ego",
    category: "download",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
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

        // Use provided query or pick random default
        let searchQuery = q;
        if (!searchQuery) {
            searchQuery = defaultQueries[Math.floor(Math.random() * defaultQueries.length)];
            await reply(`🎯 No query provided! Searching random: *${searchQuery}*`);
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Search TikTok videos
        const searchUrl = `https://api.danzy.web.id/api/search/tiktok?q=${encodeURIComponent(searchQuery)}`;
        const searchRes = await axios.get(searchUrl);
        const searchData = searchRes.data;

        if (!searchData?.status || !searchData?.result?.length) {
            return await reply(`❌ No videos found for "${searchQuery}"! Try another query.`);
        }

        // Select random video from results
        const videos = searchData.result;
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        
        // Get video details
        const videoTitle = randomVideo.title || 'No Title';
        const videoUrl = randomVideo.link || randomVideo.watermark_link;
        const author = randomVideo.author?.nickname || 'Unknown';
        const avatar = randomVideo.author?.avatar || '';
        const stats = randomVideo.stats || {};
        
        // Get music info if available
        const music = randomVideo.music || 'No music info';

        // Send video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `
🎬 *Title:* ${videoTitle}
👤 *Author:* ${author}
🎵 *Music:* ${music}
📊 *Stats:*
   • 👁️ Plays: ${stats.plays || 'N/A'}
   • ❤️ Likes: ${stats.likes || 'N/A'}
   • 💬 Comments: ${stats.comments || 'N/A'}
   • 🔗 Shares: ${stats.shares || 'N/A'}
🔍 *Searched:* ${searchQuery}

> *Powered by LOVE-MD ✅*
            `.trim(),
            thumbnail: avatar ? { url: avatar } : null
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .tiktoksearch:", e);
        
        if (e.response?.status === 404) {
            await reply("❌ API endpoint not found! The service might be temporarily unavailable.");
        } else {
            await reply("❌ Error occurred while processing your request!\n\n" + e.message);
        }
        
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
