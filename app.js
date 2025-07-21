// 🌐 भाषा टॉगल
let lang = "hi";
function toggleLanguage() {
  lang = lang === "hi" ? "en" : "hi";
  alert(`Language changed to: ${lang === "hi" ? "हिंदी" : "English"}`);
}

// 🌒 थीम टॉगल
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

// 🎯 फोकस मोड
function toggleFocusMode() {
  document.body.classList.toggle("focus-mode");
}

// 📅 दिन व तारीख
setInterval(() => {
  const now = new Date();
  document.getElementById("date").textContent = now.toLocaleDateString(lang, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}, 1000);

// ⏰ डिजिटल घड़ी
setInterval(() => {
  const now = new Date();
  document.getElementById("digital-clock").textContent = now.toLocaleTimeString(lang);
}, 1000);

// ⏱ स्टॉपवॉच
let swTime = 0, swInterval, history = [];
function updateStopwatch() {
  let h = Math.floor(swTime / 3600), m = Math.floor((swTime % 3600) / 60), s = swTime % 60;
  document.getElementById("stopwatch-display").textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
function startStopwatch() {
  if (!swInterval) swInterval = setInterval(() => { swTime++; updateStopwatch(); }, 1000);
}
function stopStopwatch() {
  clearInterval(swInterval); swInterval = null;
  history.push(swTime);
  showStopwatchHistory();
}
function resetStopwatch() {
  stopStopwatch(); swTime = 0; updateStopwatch();
}
function showStopwatchHistory() {
  const histDiv = document.getElementById("stopwatch-history");
  histDiv.innerHTML = "<strong>इतिहास:</strong><br>" + history.map(t => new Date(t * 1000).toISOString().substr(11, 8)).join("<br>");
}

// ⌛ टाइमर
function startTimer() {
  let time = parseInt(document.getElementById("timer-mins").value) * 60;
  let timerDisplay = document.getElementById("timer-display");
  let interval = setInterval(() => {
    if (time <= 0) {
      clearInterval(interval);
      alert("⏰ टाइमर समाप्त!");
    } else {
      let m = Math.floor(time / 60), s = time % 60;
      timerDisplay.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
      time--;
    }
  }, 1000);
}

// 🍅 Pomodoro
let pomoTime = 1500, pomoInterval;
function updatePomodoro() {
  let m = Math.floor(pomoTime / 60), s = pomoTime % 60;
  document.getElementById("pomodoro-display").textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
function startPomodoro() {
  if (!pomoInterval) pomoInterval = setInterval(() => {
    pomoTime--; updatePomodoro();
    if (pomoTime <= 0) {
      clearInterval(pomoInterval);
      alert("⏳ Pomodoro समाप्त!");
      pomoTime = 300; updatePomodoro(); // Break
    }
  }, 1000);
}
function resetPomodoro() {
  clearInterval(pomoInterval); pomoTime = 1500; pomoInterval = null; updatePomodoro();
}
updatePomodoro();

// 🔔 अलार्म
let alarmSetTime;
function setAlarm() {
  alarmSetTime = document.getElementById("alarm-time").value;
  document.getElementById("alarm-status").textContent = `सेट किया गया: ${alarmSetTime}`;
}
setInterval(() => {
  const now = new Date();
  const current = now.getHours().toString().padStart(2,'0') + ":" + now.getMinutes().toString().padStart(2,'0');
  if (alarmSetTime === current) {
    alert("🔔 अलार्म बजा!");
    alarmSetTime = null;
    document.getElementById("alarm-status").textContent = "कोई अलार्म सेट नहीं";
  }
}, 1000);

// 🌍 वर्ल्ड क्लॉक
const cities = [
  { city: "🇮🇳 Delhi", tz: "Asia/Kolkata" },
  { city: "🇺🇸 New York", tz: "America/New_York" },
  { city: "🇬🇧 London", tz: "Europe/London" },
  { city: "🇫🇷 Paris", tz: "Europe/Paris" },
  { city: "🇦🇺 Sydney", tz: "Australia/Sydney" },
  { city: "🇯🇵 Tokyo", tz: "Asia/Tokyo" },
  { city: "🇦🇪 Dubai", tz: "Asia/Dubai" },
  { city: "🇨🇳 Beijing", tz: "Asia/Shanghai" },
  { city: "🇧🇷 São Paulo", tz: "America/Sao_Paulo" }
];
function renderWorldClock(filteredCities = cities) {
  const container = document.getElementById("world-time-list");
  container.innerHTML = "";
  const now = new Date();
  filteredCities.forEach(({ city, tz }) => {
    const time = now.toLocaleTimeString(lang, { timeZone: tz });
    container.innerHTML += `<strong>${city}</strong>: ${time}<br>`;
  });
}
setInterval(() => renderWorldClock(), 1000);

function searchCity() {
  const input = document.getElementById("city-search").value.toLowerCase();
  const filtered = cities.filter(c => c.city.toLowerCase().includes(input));
  renderWorldClock(filtered);
}

// 📤 CSV एक्सपोर्ट
function exportCSV() {
  const rows = history.map((t, i) => `${i + 1},${new Date(t * 1000).toISOString().substr(11, 8)}`);
  const csv = "No.,Time\n" + rows.join("\n");
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "stopwatch_history.csv";
  a.click();
}
