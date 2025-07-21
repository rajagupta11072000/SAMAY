// Tab switch
function switchTab(id){
  document.querySelectorAll('#sidebar li').forEach(el=>el.classList.remove('active'));
  document.querySelector(`#sidebar li[onclick*="${id}"]`).classList.add('active');
  document.querySelectorAll('.tab').forEach(el=>el.classList.remove('active'));
  document.getElementById(`${id}-tab`).classList.add('active');
}

// Theme & Focus
function toggleTheme() { document.body.classList.toggle('dark'); }
function toggleFocusMode() { document.body.classList.toggle('focus'); }

// Digital Clock
setInterval(()=> document.getElementById('digital-clock').textContent = new Date().toLocaleTimeString(),1000);

// World Clock
const cities=[{c:'🇮🇳Delhi',tz:'Asia/Kolkata'},{c:'🇺🇸New York',tz:'America/New_York'},{c:'🇯🇵Tokyo',tz:'Asia/Tokyo'},{c:'🇦🇺Sydney',tz:'Australia/Sydney'},{c:'🇬🇧London',tz:'Europe/London'}];
setInterval(()=>{
  let html='';
  cities.forEach(city=> {
    const t=new Date().toLocaleTimeString('en-US',{timeZone:city.tz,hour12:false});
    html+=`<div class="city-card"><div>${city.c}</div><div>${t}</div></div>`;
  });
  document.getElementById('world-grid').innerHTML=html;
},1000);

// Alarm
let alarm = null;
function setAlarm(){
  alarm=document.getElementById('alarm-time').value;
  document.getElementById('alarm-status').innerText = `Set: ${alarm}`;
}
setInterval(()=>{
  const now = new Date().toLocaleTimeString('en-US',{hour12:false, hour:'2-digit', minute:'2-digit'});
  if(alarm===now){
    document.getElementById('alarm-sound').play();
    alarm=null;
    document.getElementById('alarm-status').innerText = '---';
  }
},1000);

// Stopwatch
let sw=0,si=null,hist=[];
function updateSw(){document.getElementById('stop-display').innerText=new Date(sw*1000).toISOString().substr(11,8);}
function startStopwatch(){if(!si) si=setInterval(()=>{sw++;updateSw()},1000);}
function stopStopwatch(){clearInterval(si);si=null;if(sw) hist.push(sw);updateSw();showHist();}
function resetStopwatch(){clearInterval(si);si=null;sw=0;hist=[];updateSw();showHist();}
function showHist(){document.getElementById('history').innerHTML=hist.map((s,i)=>`#${i+1}: ${new Date(s*1000).toISOString().substr(11,8)}`).join('<br>');}
function exportCSV(){
  const rows=hist.map((s,i)=>`${i+1},${new Date(s*1000).toISOString().substr(11,8)}`);
  const blob=new Blob([`No,Time\n${rows.join('\n')}`],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sw.csv';a.click();
}
setInterval(updateSw,1000);

// Timer
let tInt=null,tLeft=0;
function startTimer(){
  clearInterval(tInt);
  tLeft=parseInt(document.getElementById('timer-input').value)*60;
  tInt=setInterval(()=>{
    if(tLeft<=0){clearInterval(tInt);alert('Timer done');}
    else {
      document.getElementById('timer-display').innerText=new Date(tLeft*1000).toISOString().substr(14,5);
      tLeft--;
    }
  },1000);
}

// Pomodoro
let pLeft=1500,pi=null;
function updateP(){ document.getElementById('pomo-display').innerText=new Date(pLeft*1000).toISOString().substr(14,5);}
function startPomodoro(){
  clearInterval(pi); pi=setInterval(()=>{
    if(pLeft<=0){clearInterval(pi);alert('Pomodoro done');pLeft=1500;updateP();}
    else pLeft--,updateP();
  },1000);
}
function resetPomodoro(){ clearInterval(pi); pi=null; pLeft=1500; updateP(); }
updateP();
