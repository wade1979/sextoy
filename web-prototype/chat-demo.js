// AI互动聊天演示数据
// 预设的聊天历史记录，用于原型演示

const CHAT_DEMO_HISTORY = {
    nurse: [
        { sender: 'ai', text: '你好呀亲爱的，我是你的专属护士Irina，有什么需要帮助的吗？', timestamp: '10:28', hasRhythm: false },
        { sender: 'user', text: '你好', timestamp: '10:30' },
        { sender: 'ai', text: '让我帮你做个全面检查吧，放松身体，我会很温柔的~', timestamp: '10:30', hasRhythm: false },
        { sender: 'user', text: '给我来点刺激的', timestamp: '10:31' },
        { sender: 'ai', text: '好的，我会为你调整到更快的节奏，准备好了吗？深呼吸~', timestamp: '10:31', hasRhythm: true, media: { type: 'image', url: 'resource/ai/nurse/background.png' } }
    ],
    queen: [
        { sender: 'ai', text: '跪下，我的仆人。Ruby女王降临了。', timestamp: '14:20', hasRhythm: false },
        { sender: 'user', text: '女王陛下', timestamp: '14:22' },
        { sender: 'ai', text: '很好，你还记得规矩。今天表现如何？', timestamp: '14:22', hasRhythm: false },
        { sender: 'user', text: '请惩罚我', timestamp: '14:23' },
        { sender: 'ai', text: '既然你诚心请求，那我就满足你。感受女王的力量吧！', timestamp: '14:23', hasRhythm: true, media: { type: 'video', url: 'resource/ai/queen/video.mov' } }
    ],
    girlfriend: [
        { sender: 'ai', text: '宝贝你回来啦~想死你了💕', timestamp: '19:15', hasRhythm: false },
        { sender: 'user', text: '想你了', timestamp: '19:16' },
        { sender: 'ai', text: '真的吗？那快过来抱抱我嘛~', timestamp: '19:16', hasRhythm: false },
        { sender: 'user', text: '抱抱我', timestamp: '19:17' },
        { sender: 'ai', text: '嗯~好温暖，让我用特别的方式更贴近你好不好？', timestamp: '19:17', hasRhythm: true, media: { type: 'image', url: 'resource/ai/girlfriend/background.png' } }
    ],
    coach: [
        { sender: 'ai', text: '准备好今天的训练了吗？教练Hanna来督促你了！', timestamp: '07:00', hasRhythm: false },
        { sender: 'user', text: '教练早', timestamp: '07:05' },
        { sender: 'ai', text: '很好！今天我们要加大强度，准备好迎接挑战！', timestamp: '07:05', hasRhythm: false },
        { sender: 'user', text: '我要加强训练', timestamp: '07:06' },
        { sender: 'ai', text: '非常棒的态度！那我们开始高强度间歇训练，节奏会越来越快哦！', timestamp: '07:06', hasRhythm: true, media: { type: 'video', url: 'resource/ai/coach/video.mov' } }
    ],
    ol: [
        { sender: 'ai', text: '又加班到这么晚啊，辛苦了亲爱的~', timestamp: '22:30', hasRhythm: false },
        { sender: 'user', text: '加班辛苦了', timestamp: '22:32' },
        { sender: 'ai', text: '来，Calista帮你放松放松，忘掉工作的烦恼', timestamp: '22:32', hasRhythm: false },
        { sender: 'user', text: '放松一下', timestamp: '22:33' },
        { sender: 'ai', text: '好的，让我用温柔的节奏帮你缓解压力，闭上眼睛享受吧~', timestamp: '22:33', hasRhythm: true, media: { type: 'image', url: 'resource/ai/ol/background.png' } }
    ],
    // 女优分身聊天历史
    moena: [
        { sender: 'ai', text: '你好呀，我是河北彩花Moena，很高兴见到你~', timestamp: '15:20', hasRhythm: false },
        { sender: 'user', text: '你好呀', timestamp: '15:22' },
        { sender: 'ai', text: '今天想要什么样的体验呢？温柔的还是刺激的？', timestamp: '15:22', hasRhythm: false },
        { sender: 'user', text: '给我来点刺激的', timestamp: '15:23' },
        { sender: 'ai', text: '嗯哼~那我要认真起来了哦！准备好迎接快节奏了吗？', timestamp: '15:23', hasRhythm: true, media: { type: 'image', url: 'resource/idol/moena/image.png' } }
    ],
    umisea: [
        { sender: 'ai', text: '嗨~我是八掛海UmiSea，请多多指教💕', timestamp: '16:10', hasRhythm: false },
        { sender: 'user', text: '想你了', timestamp: '16:12' },
        { sender: 'ai', text: '真的吗？我也一直在想你呢~让我好好陪陪你吧', timestamp: '16:12', hasRhythm: false },
        { sender: 'user', text: '温柔一点', timestamp: '16:13' },
        { sender: 'ai', text: '好的，我会很温柔的，慢慢享受这个节奏~', timestamp: '16:13', hasRhythm: true }
    ],
    tojonatsu: [
        { sender: 'ai', text: 'こんにちは！東條なつです，请叫我なつ就好~', timestamp: '11:00', hasRhythm: false },
        { sender: 'user', text: '你好呀', timestamp: '11:02' },
        { sender: 'ai', text: '今天心情怎么样？要不要一起开心一下？', timestamp: '11:02', hasRhythm: false },
        { sender: 'user', text: '快一点', timestamp: '11:03' },
        { sender: 'ai', text: 'わかりました！那我要加速了哦，紧紧跟上我的节奏~', timestamp: '11:03', hasRhythm: true, media: { type: 'video', url: 'resource/idol/tojonatsu/video.mp4' } }
    ],
    ruruka: [
        { sender: 'ai', text: '嗨嗨~るるたん来啦！想我了吗？', timestamp: '13:45', hasRhythm: false },
        { sender: 'user', text: '想你了', timestamp: '13:47' },
        { sender: 'ai', text: '呜呜真是的，人家也超想你的！快来抱抱~', timestamp: '13:47', hasRhythm: false },
        { sender: 'user', text: '温柔一点', timestamp: '13:48' },
        { sender: 'ai', text: '好的好的，我会轻轻的，用最温柔的方式对你~', timestamp: '13:48', hasRhythm: true, media: { type: 'image', url: 'resource/idol/ruruka/image.png' } }
    ],
    tubasa: [
        { sender: 'ai', text: 'やっほー！つばさ舞だよ，一起玩吧~', timestamp: '17:30', hasRhythm: false },
        { sender: 'user', text: '你好呀', timestamp: '17:32' },
        { sender: 'ai', text: '今天想玩点什么？我可是很会玩的哦~', timestamp: '17:32', hasRhythm: false },
        { sender: 'user', text: '给我来点刺激的', timestamp: '17:33' },
        { sender: 'ai', text: '哇哦！那我要放大招了，准备好迎接冲击~', timestamp: '17:33', hasRhythm: true, media: { type: 'video', url: 'resource/idol/tubasa/video.mp4' } }
    ],
    koroko: [
        { sender: 'ai', text: 'こんにちは~浅野こころです！叫我こころ就好啦', timestamp: '20:15', hasRhythm: false },
        { sender: 'user', text: '你好呀', timestamp: '20:17' },
        { sender: 'ai', text: '欢迎欢迎！想要什么样的服务呢？', timestamp: '20:17', hasRhythm: false },
        { sender: 'user', text: '慢一点', timestamp: '20:18' },
        { sender: 'ai', text: '了解~那我用最舒服的慢节奏，让你好好放松', timestamp: '20:18', hasRhythm: true, media: { type: 'image', url: 'resource/idol/koroko/image.png' } }
    ]
};

const DEFAULT_MESSAGE_DURATION = {
    ai: 3,
    user: 2
};

Object.keys(CHAT_DEMO_HISTORY).forEach((key) => {
    CHAT_DEMO_HISTORY[key] = CHAT_DEMO_HISTORY[key].map(entry => ({
        ...entry,
        transcript: entry.transcript || entry.text,
        channel: entry.channel || 'voice',
        duration: entry.duration ?? DEFAULT_MESSAGE_DURATION[entry.sender] ?? 2
    }));
});

// AI自动回复模板 - 根据关键词匹配回复
const AI_AUTO_REPLIES = {
    greetings: [
        '你好呀~今天想要什么样的体验呢？',
        '嗨嗨，很高兴见到你💕',
        '欢迎回来，想我了吗？'
    ],
    miss: [
        '我也一直在想你呢，快来让我好好陪陪你~',
        '真的吗？那让我们亲密接触一下吧💕',
        '呜呜，人家也超想你的！'
    ],
    see_you_photo: [
        { text: '想我了吗？这是最近的照片哦~', needMedia: true, mediaType: 'image' },
        { text: '给你看看我现在的样子💕', needMedia: true, mediaType: 'image' },
        { text: '特意为你准备的，喜欢吗？', needMedia: true, mediaType: 'image' },
        { text: '嘿嘿，让你看看我~', needMedia: true, mediaType: 'image' },
        { text: '看！这就是我呀✨', needMedia: true, mediaType: 'image' }
    ],
    see_you_video: [
        { text: '想看我的表情吗？立刻发个小视频给你~', needMedia: true, mediaType: 'video' },
        { text: '给你一个专属表情，注意接收 💋', needMedia: true, mediaType: 'video' },
        { text: '录了段小视频给你，喜欢吗？', needMedia: true, mediaType: 'video' },
        { text: '表情包太low？那就看我现场演绎吧~', needMedia: true, mediaType: 'video' }
    ],
    exciting: [
        { text: '哦？想要刺激的是吗？那我要认真起来了哦！', hasRhythm: true },
        { text: '好的！让我为你提升节奏，准备好迎接快感~', hasRhythm: true },
        { text: '嗯哼~那我可要放大招了，hold住哦！', hasRhythm: true }
    ],
    gentle: [
        { text: '好的，我会很温柔的，慢慢享受这个节奏~', hasRhythm: true },
        { text: '没问题，让我用最温柔的方式对你💕', hasRhythm: true },
        { text: '嗯嗯，我会轻轻的，放心交给我吧~', hasRhythm: true }
    ],
    faster: [
        { text: '收到！马上为你加速，紧紧跟上我的节奏~', hasRhythm: true },
        { text: '好的好的，要加快了哦，准备好了吗？', hasRhythm: true },
        { text: '了解！立刻提升频率，享受快感吧！', hasRhythm: true }
    ],
    slower: [
        { text: '好的，我会放慢节奏，让你慢慢享受~', hasRhythm: true },
        { text: '嗯，那我用更舒缓的节奏，放松身心吧', hasRhythm: true },
        { text: '了解，调整为慢速模式，好好品味每一刻~', hasRhythm: true }
    ],
    default: [
        '嗯嗯，我明白了~',
        '好的呢，继续吗？',
        '还想要什么吗？告诉我吧~',
        '嘻嘻，喜欢这样吗？'
    ]
};

// 导出数据供app.js使用
window.CHAT_DEMO_HISTORY = CHAT_DEMO_HISTORY;
window.AI_AUTO_REPLIES = AI_AUTO_REPLIES;

