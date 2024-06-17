let socket = io.connect(location.hostname);

function generateUUID() {
  let cachedUUID = localStorage.getItem('uuid');
  if (cachedUUID) return cachedUUID;
  let uuid = crypto.randomUUID();
  localStorage.setItem('uuid', uuid);
  return uuid;
}

let device = generateUUID();
socket.emit("join", {device});

function generateCode(text, size) {
  let data = encodeURIComponent(text);
  let src = `http://api.qrserver.com/v1/create-qr-code/?data=${data}&size=${size}x${size}`;
  qrcode.src = src;
}
let page = window.location.href;
if (page.endsWith("html") || page.endsWith("/")) {
  page = page.substring(0, page.lastIndexOf('/'));
}
generateCode(page + "/remote.html?device=" + device, 200);

const soccerBall = document.getElementById('soccer-ball');
const whiteRectangle = document.getElementById('white-rectangle');
let isDragging = false;
let offsetX, offsetY;

center();

whiteRectangle.addEventListener('mousedown', (event) => {
  const rect = soccerBall.getBoundingClientRect();
  offsetX = event.clientX - rect.left;
  offsetY = event.clientY - rect.top;
  isDragging = true;
  soccerBall.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', mousemove);
socket.on('mousemove', mousemove);

function mousemove(event) {
  if (isDragging || event.remote) {
      const rect = whiteRectangle.getBoundingClientRect();
      let scale = event.remote ? 4.0 : 1.0;
      let newX = parseInt(soccerBall.style.left) + event.movementX * scale;
      let newY = parseInt(soccerBall.style.top) + event.movementY * scale;

      // Constrain within the rectangle
      newX = Math.max(150, Math.min(newX, rect.width - soccerBall.clientWidth + 150));
      newY = Math.max(150, Math.min(newY, rect.height - soccerBall.clientHeight + 150));

      soccerBall.style.left = `${newX}px`;
      soccerBall.style.top = `${newY}px`;
  }
}

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    soccerBall.style.cursor = 'grab';
  }
});

socket.on('keydown', keydown);
document.addEventListener("keydown", keydown);

function center() {
  soccerBall.style.left = '950px';
  soccerBall.style.top = '550px';
}

let up = (n) => mousemove({movementX: 0, movementY: -1 * n, remote: true});
let down = (n) => mousemove({movementX: 0, movementY: n, remote: true});
let left = (n) => mousemove({movementX: -1 * n, movementY: 0, remote: true});
let right = (n) => mousemove({movementX: n, movementY: 0, remote: true});

async function keydown(event) {
  console.log("keydown", event);
	switch (event.key) {
    case "Enter": center(); break;
    case "Escape": text.innerHTML = ""; break;
    case "Backspace": text.innerHTML = text.innerHTML.substring(0, text.innerHTML.length - 1); break;
    case "ArrowUp": up(10); break;
    case "ArrowDown": down(10); break;
    case "ArrowLeft": left(10); break;
    case "ArrowRight": right(10); break;
    case "Home": break; // could call lifecycle.exitApplication()
    case "Shift": break;
    case "Meta": break;
    default: text.innerHTML += event.key;
	}
	if (event.preventDefault) event.preventDefault();
}

socket.on('command', (message) => {
  let command = message.command.toLowerCase();
  console.log("command", command);
  
  switch (command) {
    case "up": up(40); break;
    case "down": down(40); break;
    case "left": left(40); break;
    case "right": right(40); break;
    case "center": center(); break;
    case "clear": text.innerHTML = ""; break;
    default: text.innerHTML = message.command;
  }
});

