const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "t",
    alias: ["ta", "v"],
    desc: "Send random TikTok videos",
    category: "download",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const defaultQueries = [
            "songs",
            "music", 
            "motivation",
            "funny videos",
            "sad songs",
            "urdu poetry",
            "ego"
        ];

        const searchQuery = defaultQueries[Math.floor(Math.random() * defaultQueries.length)];
        
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const searchUrl = `https://api.danzy.web.id/api/search/tiktok?q=${encodeURIComponent(searchQuery)}`;
        const searchRes = await axios.get(searchUrl);
        const searchData = searchRes.data;

        if (!searchData?.status || !searchData?.result?.length) {
            return await reply(`❌ No videos found!`);
        }

        const videos = searchData.result;
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        
        // Try no-watermark first
        let videoUrl = randomVideo.link;
        if (videoUrl && videoUrl.includes('tikwm.comhttps://')) {
            videoUrl = videoUrl.replace('https://tikwm.com', '');
        }
        
        // If no-watermark fails, use watermark
        if (!videoUrl || !videoUrl.startsWith('http')) {
            videoUrl = randomVideo.watermark_link;
        }

        if (!videoUrl || !videoUrl.startsWith('http')) {
            return await reply(`❌ Failed to get video!`);
        }

        const avatar = randomVideo.author?.avatar || '';

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `> Powered by LOVE-MD ✅`,
            thumbnail: avatar ? { url: avatar } : null
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .t:", e);
        await reply("❌ Error occurred!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
