/******************************************************
 * SAMAY 2.0 — PART 1
 * CORE ENGINE — FULL ASTRONOMY + PANCHANG SYSTEM
 * Default Location: KOLKATA
 ******************************************************/

// -----------------------------
//  BASIC CONSTANTS
// -----------------------------
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

// Kolkata Coordinates
const DEFAULT_LAT = 22.5726;
const DEFAULT_LNG = 88.3639;
const DEFAULT_TZ = 5.5;

// -----------------------------
//  DATE → JULIAN DAY
// -----------------------------
function toJulian(date) {
    return date / 86400000 + 2440587.5;
}

function julianToDate(jd) {
    return new Date((jd - 2440587.5) * 86400000);
}

// -----------------------------
//  SUN POSITION (NOAA MODEL)
// -----------------------------
function sunPosition(jd) {
    const n = jd - 2451545.0;
    const L = (280.460 + 0.9856474 * n) % 360;
    const g = (357.528 + 0.9856003 * n) % 360;

    const lambda = L + 1.915 * Math.sin(g * DEG2RAD) + 0.020 * Math.sin(2 * g * DEG2RAD);
    const epsilon = 23.439 - 0.0000004 * n;

    const RA = Math.atan2(
        Math.cos(epsilon * DEG2RAD) * Math.sin(lambda * DEG2RAD),
        Math.cos(lambda * DEG2RAD)
    ) * RAD2DEG;

    const decl = Math.asin(
        Math.sin(epsilon * DEG2RAD) * Math.sin(lambda * DEG2RAD)
    ) * RAD2DEG;

    return { lambda, RA, decl };
}

// -----------------------------
//  MOON POSITION (High accuracy simplified Meeus)
// -----------------------------
function moonPosition(jd) {
    const D = jd - 2451545.0;

    const L = 218.316 + 13.176396 * D;
    const M = 134.963 + 13.064993 * D;
    const F = 93.272 + 13.229350 * D;

    // longitude
    const lon =
        L +
        6.289 * Math.sin(M * DEG2RAD) +
        1.274 * Math.sin((2 * (L - 280) - M) * DEG2RAD) +
        0.658 * Math.sin(2 * (L - 280) * DEG2RAD);

    return { lon: lon % 360 };
}

// -----------------------------
//  TITHI CALCULATION
// -----------------------------
function getTithi(sunLon, moonLon) {
    let diff = (moonLon - sunLon + 360) % 360;
    let tithi = Math.floor(diff / 12) + 1;

    return tithi;
}

// -----------------------------
//  NAKSHATRA CALCULATION
// -----------------------------
function getNakshatra(moonLon) {
    const N = Math.floor(moonLon / (360 / 27)) + 1;
    return N;
}

// -----------------------------
//  SUNRISE / SUNSET (NOAA)
// -----------------------------
function calcSunriseSunset(date, lat, lng, tz) {
    const jd = toJulian(date);
    const n = Math.floor(jd - 2451545.0 + 0.0008);

    const jStar = n - lng / 360;
    const M = (357.5291 + 0.98560028 * (jStar - 2451545)) % 360;
    const C =
        1.9148 * Math.sin(M * DEG2RAD) +
        0.0200 * Math.sin(2 * M * DEG2RAD) +
        0.0003 * Math.sin(3 * M * DEG2RAD);
    const lambda = (M + 102.9372 + C + 180) % 360;

    const Jtransit =
        2451545 +
        jStar +
        0.0053 * Math.sin(M * DEG2RAD) -
        0.0069 * Math.sin(2 * lambda * DEG2RAD);

    const decl = Math.asin(Math.sin(lambda * DEG2RAD) * Math.sin(23.44 * DEG2RAD));

    const H =
        Math.acos(
            (Math.sin(-0.83 * DEG2RAD) - Math.sin(lat * DEG2RAD) * Math.sin(decl)) /
            (Math.cos(lat * DEG2RAD) * Math.cos(decl))
        ) * RAD2DEG;

    const Jrise = Jtransit - H / 360;
    const Jset = Jtransit + H / 360;

    return {
        sunrise: julianToDate(Jrise + tz / 24),
        sunset: julianToDate(Jset + tz / 24),
    };
}

// -----------------------------
//  RAHUKAAL / YAMAGAND / GULIK
// -----------------------------
function getKaal(sunrise, sunset, weekday) {
    const dayDuration = (sunset - sunrise) / 8;

    const rahuPeriods = [2, 7, 5, 6, 4, 3, 1];
    const yamaPeriods = [5, 3, 7, 2, 6, 4, 1];

    const rahuStart = new Date(sunrise.getTime() + dayDuration * rahuPeriods[weekday - 1]);
    const yamaStart = new Date(sunrise.getTime() + dayDuration * yamaPeriods[weekday - 1]);

    return {
        rahukal: {
            start: rahuStart,
            end: new Date(rahuStart.getTime() + dayDuration),
        },
        yamagand: {
            start: yamaStart,
            end: new Date(yamaStart.getTime() + dayDuration),
        },
    };
}

// -----------------------------
//  MASTER FUNCTION — DAILY PANCHANG
// -----------------------------
async function getDailyPanchang(date = new Date()) {
    const jd = toJulian(date);

    const sun = sunPosition(jd);
    const moon = moonPosition(jd);

    const sunriseData = calcSunriseSunset(
        date,
        DEFAULT_LAT,
        DEFAULT_LNG,
        DEFAULT_TZ
    );

    const tithi = getTithi(sun.lambda, moon.lon);
    const nakshatra = getNakshatra(moon.lon);

    const weekday = date.getDay() === 0 ? 7 : date.getDay(); // Mon=1…Sun=7
    const kaal = getKaal(sunriseData.sunrise, sunriseData.sunset, weekday);

    return {
        date,
        sun,
        moon,
        tithi,
        nakshatra,
        sunrise: sunriseData.sunrise,
        sunset: sunriseData.sunset,
        rahukal: kaal.rahukal,
        yamagand: kaal.yamagand,
    };
}

// -----------------------------
//  EXPORT (GLOBAL ACCESS)
// -----------------------------
window.SAMAY_CORE = {
    getDailyPanchang,
};
/******************************************************
 * SAMAY 2.0 — PART 2
 * AI TIME ADVISOR ENGINE — SHUBH/ASHUBH + DAILY GUIDANCE
 ******************************************************/

// Utility
function formatTime(date) {
    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

// ---------------------------------------------
//  AI: SHUBH / ASHUBH SCORE GENERATOR
// ---------------------------------------------
function getAuspiciousScore(panchang) {
    let score = 50;

    // Tithi effect
    const goodTithi = [1,2,3,5,7,10,11,12];
    const badTithi = [4,6,8,9,13,14,30];

    if (goodTithi.includes(panchang.tithi)) score += 15;
    if (badTithi.includes(panchang.tithi)) score -= 15;

    // Nakshatra effect
    const goodNak = [1,3,5,6,7,11,13,17,21,22,26];
    const badNak = [4,8,12,24];

    if (goodNak.includes(panchang.nakshatra)) score += 20;
    if (badNak.includes(panchang.nakshatra)) score -= 20;

    // Rahukaal impact
    const now = new Date();
    if (now >= panchang.rahukal.start && now <= panchang.rahukal.end) {
        score -= 25;
    }

    // Yamagand impact
    if (now >= panchang.yamagand.start && now <= panchang.yamagand.end) {
        score -= 15;
    }

    // Normalize
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    return score;
}

// ---------------------------------------------
//  AI: DAILY READING / GUIDANCE
// ---------------------------------------------
function generateDailyReading(score) {
    if (score >= 80) {
        return "Aaj ka din shandaar! Kaam fast hoga, man shant rahega, aur naye decisions ke liye perfect time hai.";
    }
    if (score >= 60) {
        return "Din theek-thaak hai. Kaam smoothly chalega, bas unnecessary risk avoid karo.";
    }
    if (score >= 40) {
        return "Aaj ka din mixed hai. Dhyan se kaam karo, misunderstandings se bacho.";
    }
    if (score >= 20) {
        return "Aaj thoda challenging ho sakta hai. Jaldbaazi se bacho, patience rakho.";
    }
    return "Aaj tough day hai. Shanti, dhairya aur kam expectations rakho. Har kaam soch-samajhकर karo.";
}

// ---------------------------------------------
//  AI: TRADING LUCKY TIME
// ---------------------------------------------
function getTradingLuckyTime(panchang) {
    let start = new Date(panchang.sunrise.getTime() + (Math.random() * 3 + 1) * 60 * 60 * 1000);
    let end = new Date(start.getTime() + 45 * 60 * 1000);

    return {
        start: formatTime(start),
        end: formatTime(end),
    };
}

// ---------------------------------------------
//  AI: MEDITATION & HEALTH TIME
// ---------------------------------------------
function getMeditationTime(panchang) {
    return {
        best: formatTime(new Date(panchang.sunrise.getTime() + 25 * 60 * 1000)),
        secondBest: formatTime(new Date(panchang.sunset.getTime() - 30 * 60 * 1000))
    };
}

// ---------------------------------------------
//  AI: HOURLY FOCUS MAP
// ---------------------------------------------
function generateHourlyMap(panchang) {
    const map = [];
    const sunrise = panchang.sunrise.getTime();
    const sunset = panchang.sunset.getTime();
    const slot = (sunset - sunrise) / 12;

    for (let i = 0; i < 12; i++) {
        const s = new Date(sunrise + i * slot);
        const e = new Date(sunrise + (i + 1) * slot);

        let focus = "Normal";

        if (i === 2 || i === 3) focus = "High Focus";
        if (i === 5 || i === 9) focus = "Low Focus";

        map.push({
            start: formatTime(s),
            end: formatTime(e),
            focus,
        });
    }

    return map;
}

// ---------------------------------------------
//  MASTER AI ADVISOR FUNCTION
// ---------------------------------------------
async function getAIAdvisor(panchang) {
    const score = getAuspiciousScore(panchang);

    return {
        score,
        reading: generateDailyReading(score),
        trading: getTradingLuckyTime(panchang),
        meditation: getMeditationTime(panchang),
        hourlyFocus: generateHourlyMap(panchang),
    };
}

// ---------------------------------------------
//  EXPORT
// ---------------------------------------------
window.SAMAY_AI = {
    getAIAdvisor,
};
