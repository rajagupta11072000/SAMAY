// 🌐 Language Support
let currentLang = 'hi';
const langData = {
  hi: {
    digitalClock: 'डिजिटल घड़ी',
    worldClock: 'वर्ल्ड क्लॉक',
    alarm: 'अलार्म',
    stopwatch: 'स्टॉपवॉच',
    timer: 'काउंटडाउन',
    pomodoro: 'पोमोडोरो',
    currentTime: '⏰ वर्तमान समय',
    setAlarm: '🔔 अलार्म सेट करें',
    softBell: 'सॉफ्ट बेल',
    classic: 'क्लासिक',
    morningTone: 'सुबह धुन',
    set: 'सेट करें',
    start: 'शुरू',
    stop: 'रोकें',
    reset: 'रीसेट',
    countdown: '⌛ काउंटडाउन टाइमर',
    theme: 'थीम',
    language: 'भाषा',
  },
  en: {
    digitalClock: 'Digital Clock',
    worldClock: 'World Clock',
    alarm: 'Alarm',
    stopwatch: 'Stopwatch',
    timer: 'Countdown',
    pomodoro: 'Pomodoro',
    currentTime: '⏰ Current Time',
    setAlarm: '🔔 Set Alarm',
    softBell: 'Soft Bell',
    classic: 'Classic',
    morningTone: 'Morning Tone',
    set: 'Set',
    start: 'Start',
    stop: 'Stop',
    reset: 'Reset',
    countdown: '⌛ Countdown Timer',
    theme: 'Theme',
    language: 'Language',
  }
};

function toggleLanguage() {
  currentLang = currentLang === 'hi' ? 'en' : 'hi';
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (langData[currentLang][key]) el.innerText = langData[currentLang][key];
  });
}

// 🌓 Theme
function toggleTheme() {
  document.body.classList.toggle('dark');
}

// 🔄 Tabs
function switchTab(id) {
  document.querySelectorAll('#sidebar li').forEach(el => el.classList.remove('active'));
  document.querySelector(`#sidebar li[onclick*="${id}"]`).classList.add('active');
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(`${id}-tab`).classList.add('active');
}

// ⏰ Digital Clock
setInterval(() => {
  document.getElementById('digital-clock').innerText = new Date().toLocaleTimeString();
}, 1000);

// 🌍 World Clock
const cityList = [
  { name: 'दिल्ली', tz: 'Asia/Kolkata', flag: '🇮🇳' },
  { name: 'न्यूयॉर्क', tz: 'America/New_York', flag: '🇺🇸' },
  { name: 'लंदन', tz: 'Europe/London', flag: '🇬🇧' },
  { name: 'टोक्यो', tz: 'Asia/Tokyo', flag: '🇯🇵' },
  { name: 'सिडनी', tz: 'Australia/Sydney', flag: '🇦🇺' },
  { name: 'दुबई', tz: 'Asia/Dubai', flag: '🇦🇪' },
  { name: 'पेरिस', tz: 'Europe/Paris', flag: '🇫🇷' },
  { name: 'बीजिंग', tz: 'Asia/Shanghai', flag: '🇨🇳' },
  { name: 'सिंगापुर', tz: 'Asia/Singapore', flag: '🇸🇬' },
  { name: 'कैप टाउन', tz: 'Africa/Johannesburg', flag: '🇿🇦' },
  { name: 'मास्को', tz: 'Europe/Moscow', flag: '🇷🇺' },
  { name: 'बैंकॉक', tz: 'Asia/Bangkok', flag: '🇹🇭' },
  { name: 'रोम', tz: 'Europe/Rome', flag: '🇮🇹' },
  { name: 'बर्लिन', tz: 'Europe/Berlin', flag: '🇩🇪' },
  { name: 'काठमांडू', tz: 'Asia/Kathmandu', flag: '🇳🇵' },
  { name: 'इस्लामाबाद', tz: 'Asia/Karachi', flag: '🇵🇰' },
  { name: 'काबुल', tz: 'Asia/Kabul', flag: '🇦🇫' },
  { name: 'ब्रासीलिया', tz: 'America/Sao_Paulo', flag: '🇧🇷' },
  { name: 'कुआलालंपुर', tz: 'Asia/Kuala_Lumpur', flag: '🇲🇾' },
  { name: 'हॉगकॉग', tz: 'Asia/Hong_Kong', flag: '🇭🇰' }
];

function renderWorldClock() {
  const grid = document.getElementById('world-grid');
  grid.innerHTML = '';
  cityList.forEach(city => {
    const time = new Date().toLocaleTimeString('en-US', { timeZone: city.tz, hour12: false });
    const card = `<div class="city-card"><div>${city.flag} ${city.name}</div><div>${time}</div></div>`;
    grid.innerHTML += card;
  });
}
setInterval(renderWorldClock, 1000);

function filterCities() {
  const input = document.getElementById('search-city').value.toLowerCase();
  const filtered = cityList.filter(city => city.name.toLowerCase().includes(input));
  const grid = document.getElementById('world-grid');
  grid.innerHTML = '';
  filtered.forEach(city => {
    const time = new Date().toLocaleTimeString('en-US', { timeZone: city.tz, hour12: false });
    const card = `<div class="city-card"><div>${city.flag} ${city.name}</div><div>${time}</div></div>`;
    grid.innerHTML += card;
  });
}

// 🔔 Alarm
let alarmTime = null;
function setAlarm() {
  const time = document.getElementById('alarm-time').value;
  const tone = document.getElementById('alarm-tone').value;
  if (time) {
    alarmTime = time;
    const audio = document.getElementById('alarm-audio');
    audio.src = tone;
    document.getElementById('alarm-status').innerText = `${time} सेट किया गया`;
  }
}
setInterval(() => {
  const now = new Date().toTimeString().slice(0, 5);
  if (alarmTime === now) {
    document.getElementById('alarm-audio').play();
    document.getElementById('alarm-status').innerText = '🔔 अलार्म बज रहा है!';
    alarmTime = null;
  }
}, 1000);

// ⏱ Stopwatch
let sw = 0, swInterval = null;
function updateStopwatch() {
  document.getElementById('stop-display').innerText = new Date(sw * 1000).toISOString().substr(11, 8);
}
function startStopwatch() {
  if (!swInterval) swInterval = setInterval(() => { sw++; updateStopwatch(); }, 1000);
}
function stopStopwatch() {
  clearInterval(swInterval);
  swInterval = null;
}
function resetStopwatch() {
  stopStopwatch();
  sw = 0;
  updateStopwatch();
}

// ⌛ Timer
let timerInt = null, tLeft = 0;
function startTimer() {
  const mins = parseInt(document.getElementById('timer-mins').value);
  if (!isNaN(mins)) {
    tLeft = mins * 60;
    clearInterval(timerInt);
    timerInt = setInterval(() => {
      if (tLeft <= 0) {
        clearInterval(timerInt);
        document.getElementById('timer-display').innerText = currentLang === 'hi' ? 'समय समाप्त' : 'Time\'s up';
      } else {
        document.getElementById('timer-display').innerText = new Date(tLeft * 1000).toISOString().substr(14, 5);
        tLeft--;
      }
    }, 1000);
  }
}

// 🍅 Pomodoro
let pomoLeft = 1500, pomoInt = null;
function updatePomodoro() {
  document.getElementById('pomo-display').innerText = new Date(pomoLeft * 1000).toISOString().substr(14, 5);
}
function startPomodoro() {
  clearInterval(pomoInt);
  pomoInt = setInterval(() => {
    if (pomoLeft <= 0) {
      clearInterval(pomoInt);
      alert(currentLang === 'hi' ? '🍅 पोमोडोरो समाप्त!' : '🍅 Pomodoro done!');
      pomoLeft = 1500;
      updatePomodoro();
    } else {
      pomoLeft--;
      updatePomodoro();
    }
  }, 1000);
}
function resetPomodoro() {
  clearInterval(pomoInt);
  pomoLeft = 1500;
  updatePomodoro();
}
updatePomodoro();
