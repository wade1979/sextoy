// Characters and Scenarios Configuration
// 角色和场景配置数据

// Personality选项列表
const PERSONALITY_OPTIONS = [
    { id: 'custom', name: 'Custom', emoji: '✨', description: '自定义' },
    { id: 'nympho', name: 'Nympho', emoji: '🔥', description: '欲女' },
    { id: 'lover', name: 'Lover', emoji: '💕', description: '恋人' },
    { id: 'submissive', name: 'Submissive', emoji: '💝', description: '顺从' },
    { id: 'dominant', name: 'Dominant', emoji: '👑', description: '主导' },
    { id: 'temptress', name: 'Temptress', emoji: '🌹', description: '诱惑' },
    { id: 'innocent', name: 'Innocent', emoji: '⭐', description: '纯真' },
    { id: 'caregiver', name: 'Caregiver', emoji: '🤗', description: '照护者' },
    { id: 'experimenter', name: 'Experimenter', emoji: '⚗️', description: '实验者' },
    { id: 'mean', name: 'Mean', emoji: '💔', description: '冷酷' },
    { id: 'confidant', name: 'Confidant', emoji: '🤝', description: '知己' },
    { id: 'shy', name: 'Shy', emoji: '😊', description: '害羞' },
    { id: 'queen', name: 'Queen', emoji: '👑', description: '女王' }
];

// Voice选项列表
const VOICE_OPTIONS = [
    { id: 'voice1', name: 'Voice 1', description: 'Confident', icon: '🔊' },
    { id: 'voice2', name: 'Voice 2', description: 'Cheerful', icon: '🔊' },
    { id: 'voice3', name: 'Voice 3', description: 'Dominant', icon: '🔊' },
    { id: 'voice4', name: 'Voice 4', description: 'Innocent', icon: '🔊' },
    { id: 'voice5', name: 'Voice 5', description: 'Sweet', icon: '🔊' },
    { id: 'voice6', name: 'Voice 6', description: 'Sultry', icon: '🔊' },
    { id: 'voice7', name: 'Voice 7', description: 'Calm', icon: '🔊' },
    { id: 'voice8', name: 'Voice 8', description: 'Thoughtful', icon: '🔊' },
    { id: 'voice9', name: 'Voice 9', description: 'Whimsical', icon: '🔊' }
];

// Relationship选项列表
const RELATIONSHIP_OPTIONS = [
    { id: 'girlfriend', name: 'Girlfriend', emoji: '💕' },
    { id: 'wife', name: 'Wife', emoji: '💍' },
    { id: 'friend', name: 'Friend', emoji: '👫' },
    { id: 'lover', name: 'Lover', emoji: '💖' },
    { id: 'mistress', name: 'Mistress', emoji: '👠' },
    { id: 'companion', name: 'Companion', emoji: '🤝' }
];

// Occupation选项列表
const OCCUPATION_OPTIONS = [
    { id: 'student', name: 'Student', icon: '🎓' },
    { id: 'nurse', name: 'Nurse', icon: '👩‍⚕️' },
    { id: 'teacher', name: 'Teacher', icon: '👩‍🏫' },
    { id: 'office', name: 'Office Lady', icon: '👩‍💼' },
    { id: 'coach', name: 'Coach', icon: '🏃‍♀️' },
    { id: 'artist', name: 'Artist', icon: '🎨' },
    { id: 'model', name: 'Model', icon: '✨' }
];

// Kinks选项列表
const KINKS_OPTIONS = [
    { id: 'bdsm', name: 'BDSM', emoji: '🔗' },
    { id: 'daddy', name: 'Daddy Dominance', emoji: '👨' },
    { id: 'roleplay', name: 'Roleplay', emoji: '🎭' },
    { id: 'bondage', name: 'Bondage', emoji: '🪢' },
    { id: 'tease', name: 'Tease', emoji: '😈' },
    { id: 'gentle', name: 'Gentle', emoji: '🌸' },
    { id: 'rough', name: 'Rough', emoji: '💪' },
    { id: 'romantic', name: 'Romantic', emoji: '💖' }
];

// 角色定义
const CHARACTERS = {
    nurse: {
        id: 'nurse',
        name: 'Irina',
        englishName: 'Irina',
        style: '护理型',
        age: 26,
        description: '温柔专业的护理师，擅长细心照护和舒缓放松。Style: 护理型',
        personality: 'submissive',
        relationship: 'friend',
        occupation: 'nurse',
        kinks: ['gentle', 'romantic'],
        voice: 'voice1',
        backgroundImage: 'resource/background_nurse.png',
        videoPath: 'resource/role_nurse.mov',
        voiceStyle: '温柔女声',
        color: '#e91e63'
    },
    queen: {
        id: 'queen',
        name: 'Ruby',
        englishName: 'Ruby',
        style: '女王',
        age: 28,
        description: '高贵优雅的御姐，掌控欲强，善于主导节奏。Style: 女王',
        personality: 'dominant',
        relationship: 'mistress',
        occupation: 'model',
        kinks: ['bdsm', 'daddy', 'tease'],
        voice: 'voice3',
        backgroundImage: 'resource/background_queen.png',
        videoPath: 'resource/role_queen.mov',
        voiceStyle: '成熟女声',
        color: '#9c27b0'
    },
    girlfriend: {
        id: 'girlfriend',
        name: 'Aria',
        englishName: 'Aria',
        style: '女友型',
        age: 21,
        description: '甜美可爱的女友，充满爱意和亲密感。Style: 女友型',
        personality: 'lover',
        relationship: 'girlfriend',
        occupation: 'student',
        kinks: ['romantic', 'gentle'],
        voice: 'voice4',
        backgroundImage: 'resource/background_girlfriend.png',
        videoPath: 'resource/role_girlfriend.mov',
        voiceStyle: '甜美女声',
        color: '#ff9800'
    },
    coach: {
        id: 'coach',
        name: 'Hanna',
        englishName: 'Hanna',
        style: '教练',
        age: 25,
        description: '专业健身教练，注重节奏训练和体能提升。Style: 教练',
        personality: 'dominant',
        relationship: 'friend',
        occupation: 'coach',
        kinks: ['rough', 'tease'],
        voice: 'voice3',
        backgroundImage: 'resource/background_coach.png',
        videoPath: 'resource/role_coach.mov',
        voiceStyle: '活力女声',
        color: '#4caf50'
    },
    ol: {
        id: 'ol',
        name: 'Calista',
        englishName: 'Calista',
        style: '办公室白领',
        age: 27,
        description: '知性优雅的白领女性，工作之余的放松时光。Style: 办公室白领',
        personality: 'confidant',
        relationship: 'friend',
        occupation: 'office',
        kinks: ['romantic', 'roleplay'],
        voice: 'voice7',
        backgroundImage: 'resource/background_ol.png',
        videoPath: 'resource/role_ol.mov',
        voiceStyle: '知性女声',
        color: '#2196f3'
    }
};

// 场景定义
const SCENARIOS = {
    intimate: {
        id: 'intimate',
        name: '私密唤醒',
        englishName: 'Intimate Wake',
        description: '轻柔的唤醒体验，从温柔开始逐渐升温',
        duration: 15,
        intensity: 'gentle',
        icon: '🌸',
        color: '#f8bbd9'
    },
    relaxation: {
        id: 'relaxation',
        name: '休息放松',
        englishName: 'Relaxation',
        description: '舒缓的放松模式，帮助释放压力和疲劳',
        duration: 20,
        intensity: 'soft',
        icon: '🧘',
        color: '#c8e6c9'
    },
    training: {
        id: 'training',
        name: '节奏训练',
        englishName: 'Rhythm Training',
        description: '专业的节奏训练，提升耐力和控制力',
        duration: 25,
        intensity: 'moderate',
        icon: '🏃',
        color: '#ffecb3'
    },
    care: {
        id: 'care',
        name: '温柔照护',
        englishName: 'Gentle Care',
        description: '贴心的照护模式，充满关爱和呵护',
        duration: 18,
        intensity: 'gentle',
        icon: '💕',
        color: '#fce4ec'
    },
    tease: {
        id: 'tease',
        name: '主控调戏',
        englishName: 'Dominant Tease',
        description: '充满挑战性的主导模式，刺激而富有激情',
        duration: 30,
        intensity: 'intense',
        icon: '🔥',
        color: '#ffcdd2'
    }
};

// 语音指令定义
const VOICE_COMMANDS = [
    {
        id: 'faster',
        text: '快点',
        englishText: 'Faster',
        icon: '⚡',
        action: 'increase_speed'
    },
    {
        id: 'slower',
        text: '慢点',
        englishText: 'Slower',
        icon: '🐌',
        action: 'decrease_speed'
    },
    {
        id: 'tighter',
        text: '紧一点',
        englishText: 'Tighter',
        icon: '🤏',
        action: 'increase_intensity'
    },
    {
        id: 'skip',
        text: '跳过',
        englishText: 'Skip',
        icon: '⏭️',
        action: 'skip_phase'
    },
    {
        id: 'pause',
        text: '暂停',
        englishText: 'Pause',
        icon: '⏸️',
        action: 'pause'
    }
];

// 语音播报内容模板
const VOICE_RESPONSES = {
    // 通用响应
    general: {
        faster: ['好的，我会加快节奏', '马上加速', '节奏提升中'],
        slower: ['好的，我会放慢节奏', '马上减速', '节奏放缓中'],
        tighter: ['好的，我会增加力度', '马上调整', '力度提升中'],
        skip: ['好的，跳过当前阶段', '进入下一阶段', '阶段切换中'],
        pause: ['好的，暂停运行', '设备暂停', '暂停中']
    },
    
    // 角色特定响应
    nurse: {
        faster: ['护理师：好的，我会加快护理节奏', '让我为您调整护理强度', '护理节奏提升中'],
        slower: ['护理师：好的，我会放慢护理节奏', '让我为您舒缓一下', '护理节奏放缓中'],
        tighter: ['护理师：好的，我会增加护理力度', '让我为您加强护理', '护理力度提升中'],
        skip: ['护理师：好的，跳过当前护理阶段', '进入下一护理阶段', '护理阶段切换中'],
        pause: ['护理师：好的，暂停护理', '护理暂停', '护理暂停中']
    },
    
    queen: {
        faster: ['女王：如您所愿，加快节奏', '朕会满足您的要求', '节奏提升，享受吧'],
        slower: ['女王：好的，朕会放慢节奏', '让朕为您舒缓', '节奏放缓，感受朕的温柔'],
        tighter: ['女王：如您所愿，增加力度', '朕会加强控制', '力度提升，臣服于朕'],
        skip: ['女王：好的，跳过当前阶段', '进入下一阶段', '阶段切换，继续享受'],
        pause: ['女王：好的，暂停运行', '朕暂停控制', '暂停中，等待朕的指令']
    },
    
    girlfriend: {
        faster: ['宝贝：好的，我会加快节奏', '让我为你调整', '节奏提升，感受我的爱'],
        slower: ['宝贝：好的，我会放慢节奏', '让我为你舒缓', '节奏放缓，享受我的温柔'],
        tighter: ['宝贝：好的，我会增加力度', '让我为你加强', '力度提升，感受我的爱意'],
        skip: ['宝贝：好的，跳过当前阶段', '进入下一阶段', '阶段切换，继续我们的时光'],
        pause: ['宝贝：好的，暂停运行', '暂停一下', '暂停中，等待你的指令']
    },
    
    coach: {
        faster: ['教练：好的，加快训练节奏', '让我们提升强度', '训练节奏提升，加油'],
        slower: ['教练：好的，放慢训练节奏', '让我们调整一下', '训练节奏放缓，保持节奏'],
        tighter: ['教练：好的，增加训练强度', '让我们加强训练', '训练强度提升，坚持住'],
        skip: ['教练：好的，跳过当前训练阶段', '进入下一训练阶段', '训练阶段切换，继续努力'],
        pause: ['教练：好的，暂停训练', '训练暂停', '暂停中，休息一下']
    },
    
    ol: {
        faster: ['好的，我会加快节奏', '让我为您调整', '节奏提升，享受时光'],
        slower: ['好的，我会放慢节奏', '让我为您舒缓', '节奏放缓，放松一下'],
        tighter: ['好的，我会增加力度', '让我为您加强', '力度提升，感受体验'],
        skip: ['好的，跳过当前阶段', '进入下一阶段', '阶段切换，继续体验'],
        pause: ['好的，暂停运行', '暂停一下', '暂停中，等待您的指令']
    }
};

// 场景运行中的语音播报
const SCENARIO_VOICE_PLAYBOOK = {
    intimate: {
        start: ['让我们开始这个温柔的唤醒', '轻轻地，感受我的触碰', '放松，让我来照顾你'],
        progress: ['感觉如何？', '这样舒服吗？', '让我调整一下节奏'],
        climax: ['就是这样，感受我的温柔', '放松，享受这一刻', '让我给你最温柔的体验'],
        end: ['结束了，感觉怎么样？', '希望你喜欢这个体验', '下次再见']
    },
    relaxation: {
        start: ['让我们开始放松', '深呼吸，放松身体', '让我帮你释放压力'],
        progress: ['感觉压力在释放吗？', '放松，不要紧张', '让我继续为你舒缓'],
        climax: ['就是这样，完全放松', '感受身心的平静', '让压力完全释放'],
        end: ['放松结束，感觉好多了吗？', '希望你能好好休息', '下次需要放松时找我']
    },
    training: {
        start: ['训练开始，准备好了吗？', '让我们提升你的耐力', '跟着我的节奏'],
        progress: ['坚持住，你可以的', '调整呼吸，保持节奏', '很好，继续努力'],
        climax: ['就是这样，坚持住', '感受力量的提升', '你已经很棒了'],
        end: ['训练结束，你做得很好', '耐力有所提升', '下次继续挑战']
    },
    care: {
        start: ['让我来照顾你', '感受我的关爱', '我会温柔地对待你'],
        progress: ['这样舒服吗？', '让我调整一下', '感受我的呵护'],
        climax: ['就是这样，感受我的爱', '让我给你最好的照顾', '享受这份温柔'],
        end: ['照顾结束，感觉怎么样？', '希望你喜欢我的照顾', '随时需要照顾时找我']
    },
    tease: {
        start: ['准备好接受挑战了吗？', '让我来主导这个游戏', '感受我的控制'],
        progress: ['感觉如何？', '想要更多吗？', '让我继续挑战你'],
        climax: ['就是这样，感受我的控制', '让我给你最刺激的体验', '享受这份激情'],
        end: ['挑战结束，感觉怎么样？', '希望你喜欢这个挑战', '下次继续挑战']
    }
};

// 导出配置
window.CHARACTERS = CHARACTERS;
window.SCENARIOS = SCENARIOS;
window.VOICE_COMMANDS = VOICE_COMMANDS;
// 快捷消息模板
const QUICK_MESSAGE_TEMPLATES = {
    common: [
        { id: 'hello', text: '你好呀 👋', category: 'greeting' },
        { id: 'miss', text: '想你了 💕', category: 'emotion' },
        { id: 'see_you', text: '想你的模样 👀', category: 'media' },
        { id: 'exciting', text: '给我来点刺激的 🔥', category: 'request' },
        { id: 'gentle', text: '温柔一点 🌸', category: 'request' },
        { id: 'faster', text: '快一点 ⚡', category: 'control' },
        { id: 'slower', text: '慢一点 🐌', category: 'control' }
    ],
    scenarios: {
        nurse: [
            '帮我检查一下身体 💊',
            '需要特殊护理 💉',
            '我哪里不舒服 🏥',
            '护士姐姐 👩‍⚕️'
        ],
        queen: [
            '请惩罚我 👑',
            '我会听话的 🙇',
            '女王陛下 👸',
            '我错了 😔'
        ],
        girlfriend: [
            '抱抱我 🤗',
            '亲亲 💋',
            '想和你在一起 💑',
            '爱你 ❤️'
        ],
        coach: [
            '教练指导我 🏃‍♀️',
            '我要加强训练 💪',
            '帮我热身 🔥',
            '运动一下 ⚡'
        ],
        ol: [
            '加班辛苦了 💼',
            '放松一下 😌',
            '下班了吗 🏢',
            '想你想疯了 💭'
        ],
        privatewakeup: [
            '早安 🌅',
            '叫醒我 ⏰',
            '还想睡 😴',
            '起床困难户 🛏️'
        ],
        sweetmorning: [
            '早上好亲爱的 ☀️',
            '今天也要元气满满 💪',
            '早安吻 💋',
            '美好的一天开始了 🌸'
        ],
        midnightwhisper: [
            '深夜了 🌙',
            '睡不着 😔',
            '陪我聊聊 💬',
            '想你 💭'
        ],
        afterwork: [
            '累了一天 😮‍💨',
            '放松放松 🛀',
            '陪我解压 💆',
            '辛苦了 🌟'
        ],
        yogastretch: [
            '一起拉伸 🧘',
            '放松身心 🌿',
            '瑜伽时间 🕉️',
            '伸展一下 💫'
        ]
    }
};

// 角色媒体资源配置
const CHARACTER_MEDIA = {
    nurse: [
        { type: 'image', url: 'resource/background_nurse.png' },
        { type: 'video', url: 'resource/role_nurse.mov' }
    ],
    queen: [
        { type: 'image', url: 'resource/background_queen.png' },
        { type: 'video', url: 'resource/role_queen.mov' }
    ],
    girlfriend: [
        { type: 'image', url: 'resource/background_girlfriend.png' },
        { type: 'video', url: 'resource/role_girlfriend.mov' }
    ],
    coach: [
        { type: 'image', url: 'resource/background_coach.png' },
        { type: 'video', url: 'resource/role_coach.mov' }
    ],
    ol: [
        { type: 'image', url: 'resource/background_ol.png' },
        { type: 'video', url: 'resource/role_ol.mov' }
    ],
    moena: [
        { type: 'image', url: 'resource/realperson/moena.png' },
        { type: 'video', url: 'resource/realperson/Moena.mov' }
    ],
    umisea: [
        { type: 'image', url: 'resource/realperson/unisea.png' },
        { type: 'video', url: 'resource/realperson/unisea.mov' }
    ],
    tojonatsu: [
        { type: 'image', url: 'resource/realperson/tojonatsu.png' },
        { type: 'video', url: 'resource/realperson/tojonatsu.mp4' }
    ],
    ruruka: [
        { type: 'image', url: 'resource/realperson/ruruka.png' },
        { type: 'video', url: 'resource/realperson/ruruka.mp4' }
    ],
    tubasa: [
        { type: 'image', url: 'resource/realperson/tubasa.png' },
        { type: 'video', url: 'resource/realperson/tubasa.mp4' }
    ],
    koroko: [
        { type: 'image', url: 'resource/realperson/koroko.png' },
        { type: 'video', url: 'resource/realperson/koroko.mp4' }
    ]
};

window.VOICE_RESPONSES = VOICE_RESPONSES;
window.SCENARIO_VOICE_PLAYBOOK = SCENARIO_VOICE_PLAYBOOK;
window.PERSONALITY_OPTIONS = PERSONALITY_OPTIONS;
window.VOICE_OPTIONS = VOICE_OPTIONS;
window.RELATIONSHIP_OPTIONS = RELATIONSHIP_OPTIONS;
window.OCCUPATION_OPTIONS = OCCUPATION_OPTIONS;
window.KINKS_OPTIONS = KINKS_OPTIONS;
window.QUICK_MESSAGE_TEMPLATES = QUICK_MESSAGE_TEMPLATES;
window.CHARACTER_MEDIA = CHARACTER_MEDIA;
