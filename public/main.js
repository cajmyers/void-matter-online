const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let t = 0;

function frame(time) {
  t = time * 0.001;
  const { width, height } = canvas;

  ctx.fillStyle = "#12121a";
  ctx.fillRect(0, 0, width, height);

  const x = width / 2 + Math.cos(t) * 80;
  const y = height / 2 + Math.sin(t * 1.3) * 50;

  ctx.fillStyle = "#9b8cff";
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
