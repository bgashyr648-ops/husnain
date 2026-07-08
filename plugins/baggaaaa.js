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
        // Updated queries to include global/Indian/Pakistani dance and various status types
        const defaultQueries = [
            "indian girl dance viral",
            "trending dance video",
            "hot indian dance status",
            "pakistani girl dance viral",
            "desi dance status song",
            "cute girl tiktok dance",
            "sad poetry status urdu",
            "badmashi attitude status urdu",
            "boys attitude status",
            "emotional sad status",
            "pakistani mujra dance status",
            "attitude shayari status video",
            "bollywood dance status",
            "broken heart status",
            "funny tiktok video",
            "اکڑ والا اسٹیٹس",
            "بدماشی اسٹیٹس",
            "اداس شاعری اسٹیٹس",
            "پاکستانی لڑکی ڈانس",
            "urdu sad poetry status",
            "full attitude status",
            "best tiktok dance video",
            "all type tiktok status",
            "desi dance video viral",
            "shayeri status",
            "attitude boys status video",
            "sad song status"
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
