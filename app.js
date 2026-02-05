// script.js

// 1. Dual Clock Logic
setInterval(() => {
    let date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();

    // Digital
    document.getElementById('txt-time').innerText = date.toLocaleTimeString();
    document.getElementById('txt-date').innerText = date.toDateString();

    // Analog
    document.getElementById('hr').style.transform = `rotate(${hh * 30 + mm / 2}deg)`;
    document.getElementById('mn').style.transform = `rotate(${mm * 6}deg)`;
    document.getElementById('sc').style.transform = `rotate(${ss * 6}deg)`;
}, 1000);

// 2. World Cities (Auto Data)
const cities = [
    { name: "New York", zone: "America/New_York" },
    { name: "London", zone: "Europe/London" },
    { name: "Tokyo", zone: "Asia/Tokyo" },
    { name: "Dubai", zone: "Asia/Dubai" },
    { name: "Sydney", zone: "Australia/Sydney" },
    { name: "Paris", zone: "Europe/Paris" },
    { name: "Singapore", zone: "Asia/Singapore" }
    // Aap yahan aur 40-50 names add kar sakte hain simple list ki tarah
];

function updateWorldTime() {
    const grid = document.getElementById('world-grid');
    grid.innerHTML = "";
    cities.forEach(c => {
        let t = new Date().toLocaleTimeString("en-GB", {timeZone: c.zone});
        grid.innerHTML += `<div class="world-item"><b>${c.name}</b> <span>${t}</span></div>`;
    });
}
setInterval(updateWorldTime, 1000);

// 3. Stopwatch Logic
let swTimer;
let seconds = 0;
function startSW() { 
    clearInterval(swTimer);
    swTimer = setInterval(() => {
        seconds++;
        let h = Math.floor(seconds / 3600);
        let m = Math.floor((seconds % 3600) / 60);
        let s = seconds % 60;
        document.getElementById('sw-display').innerText = `${h}:${m}:${s}`;
    }, 1000);
}
function stopSW() { clearInterval(swTimer); }
function resetSW() { seconds = 0; document.getElementById('sw-display').innerText = "00:00:00"; stopSW(); }

// 4. Hindu Panchang (Static Logic for now)
// Note: Real Panchang needs server-side calculation. 
// Ye UI mein dikhne ke liye placeholder hai.
document.getElementById('tithi').innerText = "Shukla Navami"; 
document.getElementById('nakshatra').innerText = "Rohini";

