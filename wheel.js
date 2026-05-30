// Wheel of Names — totally fair and unbiased

const entries = [
  { name: "Christina", weight: 1 },
  { name: "Christina", weight: 1 },
  { name: "Christina", weight: 1 },
  { name: "Eli",       weight: 97 }, // 🙂
];

// Visual slices — equal size so it LOOKS fair
const slices = [
  { label: "Christina", color: "#ff7b72" },
  { label: "Christina", color: "#ffa657" },
  { label: "Christina", color: "#f778ba" },
  { label: "Eli",       color: "#3fb950" },
];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const cx = canvas.width / 2;
const cy = canvas.height / 2;
const radius = cx - 6;

let currentAngle = 0;
let spinning = false;

function drawWheel(angle) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const sliceAngle = (Math.PI * 2) / slices.length;

  slices.forEach((s, i) => {
    const start = angle + i * sliceAngle;
    const end = start + sliceAngle;

    // Slice fill
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
    ctx.strokeStyle = "#0d1117";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px 'Space Mono', monospace";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.fillText(s.label, radius - 14, 5);
    ctx.restore();
  });

  // Center hub
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fillStyle = "#0d1117";
  ctx.fill();
  ctx.strokeStyle = "#30363d";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 4);
}

function pickWinner() {
  const total = entries.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of entries) {
    if ((r -= e.weight) < 0) return e.name;
  }
  return entries[entries.length - 1].name;
}

function spinWheel() {
  if (spinning) return;
  spinning = true;
  const btn = document.getElementById("spinBtn");
  const resultEl = document.getElementById("result");
  btn.disabled = true;
  resultEl.textContent = "";
  resultEl.className = "result";

  const winner = pickWinner();
  const sliceAngle = (Math.PI * 2) / slices.length;
  const winnerIndex = slices.findIndex(s => s.label === winner);

  const spins = 6 + Math.random() * 3;
  const winnerCenter = winnerIndex * sliceAngle + sliceAngle / 2;
  const jitter = (Math.random() - 0.5) * (sliceAngle * 0.5);
  // pointer is at 0 (right), so we need winnerCenter to land at 0
  const totalRotation = (Math.PI * 2 * spins) + (Math.PI * 2 - (currentAngle % (Math.PI * 2))) - winnerCenter + jitter;

  const duration = 3800;
  const startAngle = currentAngle;
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    currentAngle = startAngle + totalRotation * easeOut(t);
    drawWheel(currentAngle);
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      spinning = false;
      btn.disabled = false;
      if (winner === "Eli") {
        resultEl.textContent = "🎉 Eli wins again!";
        resultEl.classList.add("eli");
      } else {
        resultEl.textContent = `${winner}... so close!`;
        resultEl.classList.add("christina");
      }
    }
  }
  requestAnimationFrame(frame);
}

// Initial draw
drawWheel(currentAngle);
