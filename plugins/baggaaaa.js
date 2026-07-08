const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "t",
    alias: ["ta", "v"],
    desc: "Send random TikTok videos",
    category: "download",
    react: "🎵",
    filename: __filename,
    use: ".t"
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Updated queries to strictly exclude English content
        const defaultQueries = [
            "pakistani girl dance viral",
            "indian girl dance viral",
            "desi romantic song status",
            "sad poetry status urdu",
            "badmashi attitude status",
            "romantic dance status",
            "pakistani mujra dance",
            "funny pakistani tiktok",
            "emotional status",
            "attitude shayari status",
            "broken heart romantic status",
            "cute girl dance viral",
            "heart touching urdu status",
            "desi viral dance video",
            "attitude boy status",
            "sad song status",
            "romantic girl dance status"
        ];

        const searchQuery = defaultQueries[Math.floor(Math.random() * defaultQueries.length)];
        
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const searchUrl = `https://api.danzy.web.id/api/search/tiktok?q=${encodeURIComponent(searchQuery)}`;
        const searchRes = await axios.get(searchUrl);
        const searchData = searchRes.data;

        if (!searchData?.status || !searchData?.result?.length) {
            return await reply(`❌ No video found for: ${searchQuery}`);
        }

        const videos = searchData.result;
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        
        let videoUrl = randomVideo.link;
        if (videoUrl && videoUrl.includes('tikwm.comhttps://')) {
            videoUrl = videoUrl.replace('https://tikwm.com', '');
        }
        
        if (!videoUrl || !videoUrl.startsWith('http')) {
            videoUrl = randomVideo.watermark_link;
        }

        if (!videoUrl || !videoUrl.startsWith('http')) {
            return await reply(`❌ Error in downloading the video!`);
        }

        const avatar = randomVideo.author?.avatar || '';

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `> Powered by LOVE-MD | Owner: BAGGA-SHER-MD ✅`,
            thumbnail: avatar ? { url: avatar } : null
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .t:", e);
        await reply("❌ An internal error occurred!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
