// 女优分身数据定义
const IDOLS = {
    moena: {
        id: 'moena',
        name: '河北彩花',
        englishName: 'Moena',
        nickname: 'さいか',
        alias: '河北 彩花',
        nationality: '日本',
        birthDate: '1999年4月24日',
        age: 26,
        birthPlace: '日本千叶县匝瑳市',
        activeYears: ['2018年', '2021年-'],
        exclusiveContract: 'S1',
        description: '日本知名女优，以清纯甜美的形象和出色的演技受到广泛喜爱。',
        videoPath: 'resource/idol/moena/video.mov',
        imagePath: 'resource/idol/moena/image.png',
        height: 169, // cm
        weight: 48, // kg
        bmi: 16.8,
        bmiStatus: '偏瘦',
        bust: 87,
        waist: 57,
        hip: 86,
        cup: 'E',
        features: '长腿、苗条、童颜巨乳',
        socialMedia: {
            twitter: 'https://x.com/Saika_Kawakita',
            instagram: 'https://www.instagram.com/saika_kawakita__official/',
            youtube: 'https://www.youtube.com/@saika.trips.official'
        }
    },
    umisea: {
        id: 'umisea',
        name: '八掛海',
        englishName: 'UmiSea',
        nickname: 'うみ',
        alias: '八掛うみ',
        nationality: '日本',
        birthDate: '2000年9月2日',
        age: 25,
        birthPlace: '東京都',
        activeYears: ['2020年-'],
        exclusiveContract: 'PRESTIGE',
        description: '日本知名AV女優，以透明感和美少女形象受到廣泛喜愛。',
        videoPath: 'resource/idol/umisea/video.mov',
        imagePath: 'resource/idol/umisea/image.png',
        height: 160, // cm
        weight: 44, // kg
        bmi: 17.2,
        bmiStatus: '偏瘦',
        bust: 80,
        waist: 57,
        hip: 85,
        cup: 'C',
        features: '透明感、美少女',
        socialMedia: {
            twitter: 'https://x.com/umi_sea_0v0',
            instagram: 'https://www.instagram.com/yatsugake_umi/',
            youtube: 'https://www.youtube.com/channel/UCG36goJeSPp2ge2UIB-W7-w'
        }
    },
    tojonatsu: {
        id: 'tojonatsu',
        name: '東條なつ',
        englishName: 'tojonatsu',
        nickname: 'なつ',
        alias: '東條なつ',
        nationality: '日本',
        birthDate: '待补充',
        age: 25,
        birthPlace: '待补充',
        activeYears: ['待补充'],
        exclusiveContract: '待补充',
        description: '日本知名女优，活跃于社交媒体平台。',
        videoPath: 'resource/idol/tojonatsu/video.mp4',
        imagePath: 'resource/idol/tojonatsu/image.png',
        height: 160, // cm (待确认)
        weight: 45, // kg (待确认)
        bmi: 17.6,
        bmiStatus: '偏瘦',
        bust: 85,
        waist: 58,
        hip: 86,
        cup: 'D',
        features: '待补充',
        socialMedia: {
            twitter: 'https://mobile.twitter.com/_tojo_natsu',
            instagram: 'https://instagram.com/tojonatsu/',
            youtube: 'https://youtu.be/Lrzig-jqyko?si=5b-1rC45iBMRooFk'
        }
    },
    ruruka: {
        id: 'ruruka',
        name: 'るるたん',
        englishName: 'ruruka',
        nickname: 'るる',
        alias: 'るるたん',
        nationality: '日本',
        birthDate: '待补充',
        age: 24,
        birthPlace: '待补充',
        activeYears: ['待补充'],
        exclusiveContract: '待补充',
        description: '日本知名女优，以可爱形象受到喜爱。',
        videoPath: 'resource/idol/ruruka/video.mp4',
        imagePath: 'resource/idol/ruruka/image.png',
        height: 158, // cm (待确认)
        weight: 43, // kg (待确认)
        bmi: 17.2,
        bmiStatus: '偏瘦',
        bust: 82,
        waist: 56,
        hip: 84,
        cup: 'C',
        features: '待补充',
        socialMedia: {
            twitter: 'https://twitter.com/rurukaruru0820',
            instagram: 'https://instagram.com/ruruka_8202/',
            youtube: 'https://youtube.com/@ruruka820?si=GibQ2DGIHlWKIUHB'
        }
    },
    tubasa: {
        id: 'tubasa',
        name: 'つばさ舞',
        englishName: 'tubasa',
        nickname: 'つばさ',
        alias: 'つばさ舞',
        nationality: '日本',
        birthDate: '待补充',
        age: 23,
        birthPlace: '待补充',
        activeYears: ['待补充'],
        exclusiveContract: '待补充',
        description: '日本知名女优，充满活力和魅力。',
        videoPath: 'resource/idol/tubasa/video.mp4',
        imagePath: 'resource/idol/tubasa/image.png',
        height: 162, // cm (待确认)
        weight: 46, // kg (待确认)
        bmi: 17.5,
        bmiStatus: '偏瘦',
        bust: 84,
        waist: 57,
        hip: 85,
        cup: 'C',
        features: '待补充',
        socialMedia: {
            twitter: 'https://twitter.com/tubasa_mai_',
            instagram: 'https://instagram.com/tubasa___mai/',
            youtube: 'https://youtube.com/@tubasa-mai?si=t-Onwn3srHf-Dv1Q'
        }
    },
    koroko: {
        id: 'koroko',
        name: '浅野こころ',
        englishName: 'koroko',
        nickname: 'こころ',
        alias: '浅野こころ',
        nationality: '日本',
        birthDate: '待补充',
        age: 22,
        birthPlace: '待补充',
        activeYears: ['待补充'],
        exclusiveContract: '待补充',
        description: '日本知名女优，活跃于多个社交平台。',
        videoPath: 'resource/idol/koroko/video.mp4',
        imagePath: 'resource/idol/koroko/image.png',
        height: 161, // cm (待确认)
        weight: 45, // kg (待确认)
        bmi: 17.4,
        bmiStatus: '偏瘦',
        bust: 83,
        waist: 57,
        hip: 85,
        cup: 'C',
        features: '待补充',
        socialMedia: {
            twitter: 'https://twitter.com/korokorococoroo',
            instagram: 'https://instagram.com/kkorokorococoroo/',
            youtube: 'https://youtube.com/@corocorococoroo?si=xOVViqzvJk2reX66',
            tiktok: 'https://tiktok.com/@korokorococoroo?_t=ZS-8uIbbaDrnOM&_r=1'
        }
    }
};

// 导出供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IDOLS;
}

