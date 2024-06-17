let socket = io.connect(location.hostname);
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let device = urlParams.has('device') ? urlParams.get('device') : "";

function sendMessage(name, message) {
  message.device = device;
  console.log(name, message);
  socket.emit(name, message);
}

/** Mouse **/

let movementX = 0;
let movementY = 0;
let debounceTimeout;
let isMouseDown = false;

function mousedown(event) {
  isMouseDown = true;
  sendMessage("mousedown", {clientX: event.clientX, clientY: event.clientY});
}

function mousemove(event) {
  if ((isMouseDown || event.touches) && (event.movementX !== 0 || event.movementY !== 0)) {
    movementX += event.movementX;
    movementY += event.movementY;

    if (!debounceTimeout) {
      debounceTimeout = setTimeout(() => {
        sendMessage("mousemove", {movementX, movementY, remote: true});
        movementX = 0;
        movementY = 0;
        debounceTimeout = null;
      }, 20);
    }
  }
}

function mouseup(event) {
  if (isMouseDown) {
    isMouseDown = false;
    sendMessage("mouseup", {clientX: event.clientX, clientY: event.clientY});
  }
}

rectangle.addEventListener('mousedown', mousedown);
rectangle.addEventListener('mousemove', mousemove);
rectangle.addEventListener('mouseup', mouseup);
document.addEventListener('mouseup', mouseup);

/** Touch **/

let previousTouch = null;

function touchstart(event) {
  previousTouch = null;
  const touch = event.touches[0];
  sendMessage("mousedown", {clientX: touch.pageX, clientY: touch.pageY});
}

function touchmove(event) {
  const touch = event.touches[0];
  if (previousTouch) {
    event.movementX = touch.pageX - previousTouch.pageX;
    event.movementY = touch.pageY - previousTouch.pageY;
    mousemove(event);
  };
  previousTouch = touch;
}

function touchend(event) {
  const touch = event.touches[0];
  sendMessage("mouseup", {clientX: touch.pageX, clientY: touch.pageY});
}

rectangle.addEventListener("touchstart", touchstart, false);
rectangle.addEventListener("touchmove", touchmove, false);
rectangle.addEventListener("touchend", touchend, false);

/** Keyboard **/

let sendKey = (key) => sendMessage("keydown", {key});
let left = () => sendKey("ArrowLeft");
let right = () => sendKey("ArrowRight");
let up = () => sendKey("ArrowUp");
let down = () => sendKey("ArrowDown");
let enter = () => sendKey("Enter");
let escape = () => sendKey("Escape");
let home = () => sendKey("Home"); // should call lifecycle.exitApplication()
let content = () => sendKey("Content"); // not used

textfield.addEventListener('keydown', (event) => sendKey(event.key));

/** Voice **/

let recognition = new webkitSpeechRecognition();
let recognizing = false;

recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = true;
recognition.onstart = () => recognizing = true;
recognition.onend = () => recognizing = false;
recognition.onresult = (event) => {
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    let command = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      sendMessage("command", {command});

      if (recognizing) {
        recognition.stop();
      }
    }
  }
};

function command(event) {
  if (recognizing) {
    recognition.stop();
  } else {
    recognition.start();
  }
}
