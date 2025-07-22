// 📦 STATE & STORAGE
let cfg = JSON.parse(localStorage.getItem('cfg')||'{"theme":"light","mode":"digital","alarms":[],"stats":{}}');
function save(){ localStorage.setItem('cfg', JSON.stringify(cfg)); }

// ⚙ APPLY THEME
if(cfg.theme==='dark') document.body.classList.add('dark');
function toggleTheme(){
  document.body.classList.toggle('dark');
  cfg.theme = document.body.classList.contains('dark')?'dark':'light';
  save();
}

// 🕒 CLOCK CONTROL
function toggleClockMode(){
  cfg.mode = cfg.mode==='digital'?'analog':'digital';
  save();
  setupClock();
}

function setupClock(){
  const el = document.getElementById('clockContainer');
  clearInterval(el._int);
  if(cfg.mode==='digital'){
    el._int = setInterval(() => el.innerText = new Date().toLocaleTimeString(), 500);
  } else {
    el.innerHTML = '<canvas id="analog" width="200" height="200"></canvas>';
    drawAnalog();
    el._int = setInterval(drawAnalog, 1000);
  }
}

function drawAnalog(){
  const c=document.getElementById('analog'), ctx=c.getContext('2d'), r=100;
  ctx.clearRect(0,0,200,200);
  ctx.save(); ctx.translate(r,r);
  ctx.beginPath(); ctx.arc(0,0,r-1,0,2*Math.PI); ctx.stroke();
  const d=new Date(),
        h=(d.getHours()%12 + d.getMinutes()/60)*30,
        m=d.getMinutes()*6,
        s=d.getSeconds()*6;
  [[h,5],[m,3],[s,1]].forEach(([a,w])=>{
    ctx.save();
    ctx.rotate(a*Math.PI/180);
    ctx.beginPath();
    ctx.lineWidth=w;
    ctx.moveTo(0,0);
    ctx.lineTo(0,-r+10);
    ctx.stroke();
    ctx.restore();
  });
  ctx.restore();
}

// 🌍 WORLD CLOCK: 200+ Timezones
const cityList = [
  { zone: 'Asia/Kolkata', flag: '🇮🇳', name: 'Delhi' },
  { zone: 'America/New_York', flag: '🇺🇸', name: 'New York' },
  { zone: 'Europe/London', flag: '🇬🇧', name: 'London' },
  { zone: 'Asia/Tokyo', flag: '🇯🇵', name: 'Tokyo' },
  { zone: 'Europe/Paris', flag: '🇫🇷', name: 'Paris' },
  { zone: 'Europe/Berlin', flag: '🇩🇪', name: 'Berlin' },
  { zone: 'America/Los_Angeles', flag: '🇺🇸', name: 'Los Angeles' },
  { zone: 'Australia/Sydney', flag: '🇦🇺', name: 'Sydney' },
  { zone: 'America/Chicago', flag: '🇺🇸', name: 'Chicago' },
  { zone: 'America/Denver', flag: '🇺🇸', name: 'Denver' },
  { zone: 'America/Phoenix', flag: '🇺🇸', name: 'Phoenix' },
  { zone: 'America/Sao_Paulo', flag: '🇧🇷', name: 'São Paulo' },
  { zone: 'America/Mexico_City', flag: '🇲🇽', name: 'Mexico City' },
  { zone: 'Asia/Shanghai', flag: '🇨🇳', name: 'Shanghai' },
  { zone: 'Asia/Hong_Kong', flag: '🇭🇰', name: 'Hong Kong' },
  { zone: 'Asia/Singapore', flag: '🇸🇬', name: 'Singapore' },
  { zone: 'Asia/Dubai', flag: '🇦🇪', name: 'Dubai' },
  { zone: 'Europe/Moscow', flag: '🇷🇺', name: 'Moscow' },
  { zone: 'Africa/Johannesburg', flag: '🇿🇦', name: 'Cape Town' },
  { zone: 'Africa/Cairo', flag: '🇪🇬', name: 'Cairo' },
  { zone: 'Europe/Rome', flag: '🇮🇹', name: 'Rome' },
  { zone: 'Europe/Madrid', flag: '🇪🇸', name: 'Madrid' },
  { zone: 'Asia/Seoul', flag: '🇰🇷', name: 'Seoul' },
  { zone: 'Asia/Jakarta', flag: '🇮🇩', name: 'Jakarta' },
  { zone: 'Asia/Bangkok', flag: '🇹🇭', name: 'Bangkok' },
  { zone: 'Europe/Istanbul', flag: '🇹🇷', name: 'Istanbul' },
  { zone: 'Asia/Tehran', flag: '🇮🇷', name: 'Tehran' },
  { zone: 'Europe/Amsterdam', flag: '🇳🇱', name: 'Amsterdam' },
  { zone: 'Europe/Zurich', flag: '🇨🇭', name: 'Zurich' },
  { zone: 'Europe/Vienna', flag: '🇦🇹', name: 'Vienna' },
  // … यहाँ लगभग 200+ entries कॉपी करके पेस्ट करें
];

function renderWorld(){
  const q = document.getElementById('search-city').value.toLowerCase();
  const grid = document.getElementById('world-grid');
  grid.innerHTML = '';
  cityList
    .filter(c => c.name.toLowerCase().includes(q))
    .forEach(c => {
      const t = new Date().toLocaleTimeString('en-US',{ timeZone: c.zone, hour12: false });
      grid.innerHTML += `
        <div class="city-card">
          ${c.flag} ${c.name}<br>
          ${t}
        </div>`;
    });
}

// 🔔 ALARMS
function addAlarm(){
  const t = prompt('समय (HH:MM)?'), l = prompt('नाम?');
  if(t){
    cfg.alarms.push({ time: t, label: l });
    save(); renderControls();
  }
}

function renderControls(){
  const c = document.getElementById('controls');
  c.innerHTML = `
    <button onclick="addAlarm()">Add Alarm</button>
    <ul>${cfg.alarms.map((a,i)=>
      `<li>${a.time} ${a.label} <button onclick="delAlarm(${i})">x</button></li>`
    ).join('')}</ul>
    <button onclick="startPomodoro()">Start Pomodoro</button>`;
}

function delAlarm(i){
  cfg.alarms.splice(i,1);
  save();
  renderControls();
}

function checkAlarms(){
  const now = new Date().toTimeString().slice(0,5);
  cfg.alarms.forEach(a=>{
    if(a.time === now){
      showNotify('Alarm: ' + a.label);
      logStat('Alarm');
      a.done = true;
      save();
    }
  });
}

// 🧭 POMODORO
function startPomodoro(){
  document.getElementById('bgMusic').play();
  setTimeout(()=>{
    showNotify('Pomodoro Complete');
    logStat('Pomodoro');
    document.getElementById('bgMusic').pause();
  }, 25*60*1000);
}

// 📊 STATS & CHART
function logStat(type){
  const t = new Date().toLocaleTimeString();
  cfg.stats[t] = type;
  save();
  renderStatsChart();
}

function renderStatsChart(){
  const ctx = document.getElementById('statsChart').getContext('2d');
  const labels = Object.keys(cfg.stats);
  const data = labels.map(_=>1);
  new Chart(ctx, {
    type:'bar',
    data:{ labels, datasets:[{ label:'Events', data }] },
    options:{
      plugins:{ legend:{ display:false }},
      scales:{
        x:{ title:{ display:true, text:'Time' }},
        y:{ title:{ display:true, text:'Count' }}
      }
    }
  });
}

// 🌐 VOICE COMMAND
function startVoice(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){ alert('Voice commands not supported'); return; }
  const rec = new SR();
  rec.lang = 'hi-IN';
  rec.onresult = e => processVoice(e.results[0][0].transcript);
  rec.start();
}

function processVoice(txt){
  if(/अलार्म/i.test(txt) && /सेट/i.test(txt)) addAlarm();
  else if(/पॉमोडोरो/i.test(txt)) startPomodoro();
  else showNotify('Command नहीं समझा: '+txt);
}

// 🔔 NOTIFICATIONS
function showNotify(txt){
  if(Notification.permission !== 'granted') Notification.requestPermission();
  new Notification(txt);
}

// ⏰ INIT
setupClock();
renderWorld();
renderControls();
renderStatsChart();
setInterval(renderWorld, 1000);
setInterval(checkAlarms, 1000);
