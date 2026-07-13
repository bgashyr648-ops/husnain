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
        // ONLY UPDATED PART (Requested Categories)
        const defaultQueries = [
            // Sad 😢
            "sad status urdu",
            "dard bhari shayari status",
            "emotional urdu status",
            "tanha dil sad video",

            // Badmashi 😈
            "badmashi status urdu",
            "attitude boy status urdu",
            "dabang style video",
            "sher attitude status",

            // Mujra 💃
            "pakistani mujra dance",
            "mehfil mujra dance",
            "desi mujra viral",
            "stage mujra performance",

            // Mehka Malak / Songs 🎶
            "mehka malak song",
            "mehka malak viral song",
            "mehka malak dance video",

            // Sharqi / Desi Songs 🎵
            "urdu song status",
            "pakistani song viral",
            "desi song status",
            "eastern song dance"
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
