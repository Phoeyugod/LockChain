const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const ranges = {
  "24h": [26000,27000,26500,28000,30000,34000,31000,33000,36000,39500],
  "7d": [22000,25000,24000,26000,30000,35000,32000],
  "1m": [18000,21000,25000,30000,34000,39500],
  "1y": [8000,12000,18000,24000,30000,39500]
};

function drawChart(data) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = "#00aaff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  data.forEach((value, index) => {
    const x = (canvas.width / (data.length - 1)) * index;
    const y = canvas.height - (value / Math.max(...data)) * canvas.height;
    index === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  });
  ctx.stroke();
}

drawChart(ranges["24h"]);

document.querySelectorAll(".ranges button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
    drawChart(ranges[btn.dataset.range]);
  });
});

const transactions = [
  { type:"Fogadott", time:"21 órája", amount:"+0.0523 AXLX", usd:"+2,065.55", positive:true },
  { type:"Elküldött", time:"1 napja", amount:"-0.0100 AXLX", usd:"-395.00", positive:false },
  { type:"Vásárolt", time:"3 napja", amount:"+0.2500 AXLX", usd:"-9,875.00", positive:true }
];

const list = document.getElementById("transactions");

transactions.forEach(tx => {
  const li = document.createElement("li");
  li.innerHTML = `
    <div>
      <strong>${tx.type}</strong><br>
      <small>${tx.time}</small>
    </div>
    <div class="${tx.positive ? "green" : "red"}">
      ${tx.amount}<br>
      <small>${tx.usd}</small>
    </div>
  `;
  list.appendChild(li);
});
