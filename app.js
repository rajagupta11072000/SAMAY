// Theme & Focus
function toggleTheme() {
  document.body.classList.toggle('dark');
}
function toggleFocusMode() {
  document.body.classList.toggle('focus');
  document.querySelector('main').classList.toggle('hidden');
}

// Digital Clock
setInterval(() => {
  document.getElementById('digital-clock').textContent = 
    new Date().toLocaleTimeString();
}, 1000);

// World Clock
const cities = [
  {c:'🇮🇳 Delhi', tz:'Asia/Kolkata'},
  {c:'🇺🇸 New York', tz:'America/New_York'},
  {c:'🇬🇧 London', tz:'Europe/London'},
  {c:'🇫🇷 Paris', tz:'Europe/Paris'},
  {c:'🇩🇪 Berlin', tz:'Europe/Berlin'},
  {c:'🇦🇺 Sydney', tz:'Australia/Sydney'},
  {c:'🇯🇵 Tokyo', tz:'Asia/Tokyo'},
  {c:'🇨🇳 Beijing', tz:'Asia/Shanghai'},
  {c:'🇧🇷 São Paulo', tz:'America/Sao_Paulo'},
  {c:'🇿🇦 Cape Town', tz:'Africa/Johannesburg'}
];
function updateWorld() {
  const grid = document.getElementById('world-time-grid');
  const now = new Date();
  grid.innerHTML = cities.map(city => {
    const t = now.toLocaleTimeString('en-US', {timeZone: city.tz, hour12:false});
    return `<div class="city-card"><div>${city.c}</div><div>${t}</div></div>`;
  }).join('');
}
setInterval(updateWorld, 1000);

// Alarm
let alarmTime = null;
function setAlarm(){
  alarmTime = document.getElementById('alarm-time').value;
  document.getElementById('alarm-status').textContent = `Set for ${alarmTime}`;
}
setInterval(() => {
  const now = new Date().toLocaleTimeString('en-US', {hour12:false, hour:'2-digit', minute:'2-digit'});
  if (alarmTime === now) {
    document.getElementById('alarm-sound').play();
    alarmTime = null;
    document.getElementById('alarm-status').textContent = '---';
  }
}, 1000);

// Stopwatch
let sw = 0, si, hist=[];
function updateSw(){ document.getElementById('stopwatch-display').textContent = new Date(sw*1000).toISOString().substr(11,8); }
function startStopwatch(){ if(!si) si=setInterval(()=>{sw++;updateSw()},1000); }
function stopStopwatch(){ clearInterval(si); si=null; hist.push(sw); showHist(); }
function resetStopwatch(){ clearInterval(si); si=null; sw=0; hist=[]; updateSw(); showHist(); }
function showHist(){
  document.getElementById('stopwatch-history').innerHTML = hist.map((s,i)=>`#${i+1}: ${new Date(s*1000).toISOString().substr(11,8)}`).join('<br>');
}
function exportCSV(){
  const rows = hist.map((s,i)=>`${i+1},${new Date(s*1000).toISOString().substr(11,8)}`);
  const blob = new Blob([`No,Time\n${rows.join('\n')}`], {type:'text/csv'});
  const a= document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sw_history.csv'; a.click();
}

// Timer
let ti, tLeft=0;
function startTimer(){
  clearInterval(ti);
  tLeft = parseInt(document.getElementById('timer-mins').value)*60;
  ti = setInterval(()=>{
    if(tLeft<=0){ clearInterval(ti); alert('⏰ टाइमर समाप्त'); }
    else {
      document.getElementById('timer-display').textContent = new Date(tLeft*1000).toISOString().substr(14,5);
      tLeft--;
    }
  }, 1000);
}

// Pomodoro
let pLeft=1500, pi;
function updatePom(){ document.getElementById('pomodoro-display').textContent = new Date(pLeft*1000).toISOString().substr(14,5); }
function startPomodoro(){
  clearInterval(pi);
  pi=setInterval(()=>{
    if(pLeft<=0){ clearInterval(pi); alert('Pomodoro समाप्त'); pLeft=1500; updatePom();}
    else { pLeft--; updatePom(); }
  }, 1000);
}
function resetPomodoro(){ clearInterval(pi); pLeft=1500; updatePom(); }
updatePom();
