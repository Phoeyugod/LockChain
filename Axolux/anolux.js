const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = canvas.offsetWidth * devicePixelRatio;
  canvas.height = canvas.offsetHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
resize();

const datasets = {
  "24h": [26500,27000,26800,28000,29500,32000,34000,33000,36000,39500],
  "7d":  [23000,24500,24000,26000,30000,34000,39500],
  "1m":  [18000,20000,23000,26000,30000,35000,39500],
  "1y":  [9000,12000,18000,24000,30000,39500]
};

function drawChart(data) {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const padding = 10;

  const points = data.map((v,i)=>({
    x: i*(w/(data.length-1)),
    y: h - ((v-min)/(max-min))*(h-padding*2) - padding
  }));

  /* ==== FILL GRADIENT ==== */
  const gradient = ctx.createLinearGradient(0,0,0,h);
  gradient.addColorStop(0,"rgba(53,184,255,0.35)");
  gradient.addColorStop(1,"rgba(53,184,255,0)");

  ctx.beginPath();
  ctx.moveTo(points[0].x, h);
  points.forEach((p,i)=>{
    if(i===0) ctx.lineTo(p.x,p.y);
    else {
      const prev = points[i-1];
      const cx = (prev.x + p.x)/2;
      ctx.quadraticCurveTo(prev.x, prev.y, cx, (prev.y+p.y)/2);
    }
  });
  ctx.lineTo(points.at(-1).x, h);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  /* ==== LINE ==== */
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  points.forEach((p,i)=>{
    if(i>0){
      const prev = points[i-1];
      const cx = (prev.x + p.x)/2;
      ctx.quadraticCurveTo(prev.x, prev.y, cx, (prev.y+p.y)/2);
    }
  });

  ctx.strokeStyle = "#35b8ff";
  ctx.lineWidth = 2;
  ctx.shadowColor = "#35b8ff";
  ctx.shadowBlur = 14;
  ctx.stroke();

  ctx.shadowBlur = 0;
}

/* INITIAL */
drawChart(datasets["24h"]);

/* RANGE SWITCH */
document.querySelectorAll(".ranges span").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelector(".ranges .active").classList.remove("active");
    btn.classList.add("active");
    drawChart(datasets[btn.textContent]);
  });
});
