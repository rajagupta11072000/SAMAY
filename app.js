// TAB CONTROL
function switchTab(id) {
  document.querySelectorAll('#sidebar li').forEach(el => el.classList.remove('active'));
  document.querySelector(`#sidebar li[onclick*="${id}"]`).classList.add('active');
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(`${id}-tab`).classList.add('active');
}

// THEME & LANGUAGE
let lang = 'hi';
function toggleTheme() {
  document.body.classList.toggle('dark');
}
function toggleLanguage() {
  lang = lang === 'hi' ? 'en' : 'hi';
  location.reload();
}

// DIGITAL CLOCK
setInterval(() => {
  document.getElementById('digital-clock').innerText =
    new Date().toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-US');
}, 1000);

// WORLD CLOCK
const cityList = [
  { name: { hi: 'दिल्ली', en: 'Delhi' }, tz: 'Asia/Kolkata', flag: '🇮🇳' },
  { name: { hi: 'न्यूयॉर्क', en: 'New York' }, tz: 'America/New_York', flag: '🇺🇸' },
  { name: { hi: 'लंदन', en: 'London' }, tz: 'Europe/London', flag: '🇬🇧' },
  { name: { hi: 'टोक्यो', en: 'Tokyo' }, tz: 'Asia/Tokyo', flag: '🇯🇵' },
  { name: { hi: 'पेरिस', en: 'Paris' }, tz: 'Europe/Paris', flag: '🇫🇷' }
];
function renderWorld() {
  const grid = document.getElementById('world-grid');
  grid.innerHTML = '';
  cityList.forEach(c => {
    const t = new Date().toLocaleTimeString('en-US', { timeZone: c.tz, hour12: false });
    const nm = lang === 'hi' ? c.name.hi : c.name.en;
    grid.innerHTML += `
      <div class="city-card">
        <div>${c.flag} ${nm}</div>
        <div>${t}</div>
      </div>`;
  });
}
setInterval(renderWorld, 1000);

// FILTER
function filterCities() {
  const v = document.getElementById('search-city').value.toLowerCase();
  document.querySelectorAll('.city-card').forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(v) ? 'block' : 'none';
  });
}

// ALARM
let alarmTime = null;
function setAlarm() {
  const time = document.getElementById('alarm-time').value;
  const tone = document.getElementById('alarm-tone').value;
  if (time) {
    alarmTime = time;
    document.getElementById('alarm-audio').src = tone;
    document.getElementById('alarm-status').innerText = `${lang==='hi'?'सेट':'Set'}: ${alarmTime}`;
  }
}
setInterval(() => {
  const now = new Date().toTimeString().slice(0, 5);
  if (alarmTime === now) {
    document.getElementById('alarm-audio').play();
    document.getElementById('alarm-status').innerText = '🔔 ' + (lang==='hi'?'अलार्म':'Alarm') + '!';
    alarmTime = null;
  }
}, 1000);

// STOPWATCH
let sw = 0, swInt = null;
function updateStop() {
  document.getElementById('stop-display').innerText =
    new Date(sw*1000).toISOString().substr(11,8);
}
function startStopwatch() { if (!swInt) swInt = setInterval(() => { sw++; updateStop(); }, 1000); }
function stopStopwatch() { clearInterval(swInt); swInt = null; }
function resetStopwatch() { stopStopwatch(); sw = 0; updateStop(); }

// TIMER
let timerInt = null, tLeft = 0;
function startTimer() {
  const mins = parseInt(document.getElementById('timer-mins').value);
  if (!isNaN(mins)) {
    tLeft = mins*60;
    clearInterval(timerInt);
    timerInt = setInterval(() => {
      if (tLeft<=0) {
        clearInterval(timerInt);
        document.getElementById('timer-display').innerText = lang==='hi'?'समय समाप्त':'Time Up';
      } else {
        document.getElementById('timer-display').innerText =
          new Date(tLeft*1000).toISOString().substr(14,5);
        tLeft--;
      }
    }, 1000);
  }
}

// POMODORO
let pomoLeft = 1500, pomoInt = null;
function updatePomo() {
  document.getElementById('pomo-display').innerText =
    new Date(pomoLeft*1000).toISOString().substr(14,5);
}
function startPomodoro() {
  clearInterval(pomoInt);
  pomoInt = setInterval(() => {
    if (pomoLeft<=0) {
      clearInterval(pomoInt);
      alert('🍅 पोमोडोरो समाप्त');
      pomoLeft = 1500; updatePomo();
    } else { pomoLeft--; updatePomo(); }
  },1000);
}
function resetPomodoro() {
  clearInterval(pomoInt); pomoLeft = 1500; updatePomo();
}
updatePomo();
