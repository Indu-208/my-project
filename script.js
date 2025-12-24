
// LOGIN
function login() {
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;

  if (u === "user" && p === "1234") {
    window.location.href = "scan.html";
  } else {
    alert("Invalid login");
  }
}

// QR SCANNER
if (document.getElementById("reader")) {
  const html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
        console.log("scanned:",decodedText);
    if (decodedText.startsWith("DRIVER_VERIFIED")) {
        window.location.href = "details.html";
      } else {
        alert("Invalid QR Code");
      }

      html5QrCode.stop();
    },
    (error) => {
      // ignore scan errors
    }
  );
  function skipScan() {
  localStorage.setItem("verificationStatus", "NOT_VERIFIED");
  window.location.href = "details.html";
}
function goToAlert() {
  window.location.href = "alert.html";
}
}

// DETAILS → ALERT PAGE
function goToAlert() {
  window.location.href = "alert.html";
}

// VOICE ALERT
function voiceAlert() {
  let msg = new SpeechSynthesisUtterance(
    "Emergency alert. Driver verification failed. Please take action."
  );
  msg.lang = "en-IN";
  msg.rate = 1;
  msg.volume = 1;
  speechSynthesis.speak(msg);
}

// SEND ALERT (SIMULATED)
function sendAlert() {
  document.getElementById("alertMsg").innerText =
    "Alert sent to registered emergency contacts!";
}
// CHECK BROWSER SUPPORT
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

// START LISTENING
function startVoiceDetection() {
  if (!window.SpeechRecognition) {
    alert("Speech Recognition not supported in this browser");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onstart = () => {
    document.getElementById("alertMsg").innerText =
      "🎤 Listening for 'emergency'...";
  };

  recognition.onresult = (event) => {
    const transcript =
      event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim();

    console.log("Heard:", transcript);

    if (transcript.includes("emergency")) {
      recognition.stop();
      triggerEmergency();
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech error:", event.error);
  };

  recognition.start();
}
function getLocation(callback) {
  if (!navigator.geolocation) {
    alert("GPS not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const mapURL = `https://www.google.com/maps?q=${lat},${lon}`;

      document.getElementById("coords").innerText =
        `Latitude: ${lat}, Longitude: ${lon}`;

      const link = document.getElementById("mapLink");
      link.href = mapURL;
      link.innerText = "📍 Open in Google Maps";

      callback(mapURL);
    },
    () => alert("Location access denied")
  );
}

// -------- EMERGENCY ACTION --------
function triggerEmergency() {
  getLocation((mapURL) => {
    document.getElementById("alertMsg").innerText =
      "🚨 Emergency detected! Alert sent.";

    // Voice confirmation
    const msg = new SpeechSynthesisUtterance(
      "Emergency detected. Location sent to emergency contacts."
    );
    speechSynthesis.speak(msg);

    console.log("Alert sent with location:", mapURL);
  });
}

// -------- MANUAL SEND ALERT --------
function sendAlert() {
  getLocation((mapURL) => {
    document.getElementById("alertMsg").innerText =
      "📩 Alert sent with live location!";

    console.log("Manual alert sent:", mapURL);
  });
}

// TRIGGER EMERGENCY ACTION
function triggerEmergency() {
  document.getElementById("alertMsg").innerText =
    "🚨 Emergency detected! Alert sent.";

  // VOICE CONFIRMATION
  const msg = new SpeechSynthesisUtterance(
    "Emergency detected. Alert sent to emergency contacts."
  );
  msg.lang = "en-IN";
  speechSynthesis.speak(msg);
}