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
        // Removed music/song related queries and added attitude, mujra, ego, sad in Urdu
        const defaultQueries = [
            "attitude status ego urdu",
            "mujra dance status urdu",
            "badmashi attitude status urdu",
            "sad status ego urdu",
            "attitude boy status urdu",
            "mujra trending urdu",
            "ego attitude status urdu",
            "sad attitude status urdu",
            "اکڑ status", // Attitude status in Urdu
            "مجرا status", // Mujra status in Urdu
            "بدماشی status", // Badmashi status in Urdu
            "اداس status", // Sad status in Urdu
            "ego status urdu",
            "attitude shayari status",
            "mujra dance video urdu",
            "sad shayari status urdu"
        ];

        const searchQuery = defaultQueries[Math.floor(Math.random() * defaultQueries.length)];
        
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const searchUrl = `https://api.danzy.web.id/api/search/tiktok?q=${encodeURIComponent(searchQuery)}`;
        const searchRes = await axios.get(searchUrl);
        const searchData = searchRes.data;

        if (!searchData?.status || !searchData?.result?.length) {
            return await reply(`❌ کوئی ویڈیو نہیں ملی!`);
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
            return await reply(`❌ ویڈیو ڈاؤن لوڈ کرنے میں مسئلہ ہوا!`);
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
        await reply("❌ کوئی ایرر آ گیا ہے!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
