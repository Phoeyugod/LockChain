

const grafikonElem = document.getElementById('arfolyamGrafikon');

/* ADATOK IDŐTÁVONKÉNT */
const arfolyamAdatok = {
  "24h": [39200, 38900, 39150, 39500, 39300, 39800, 40200, 39950, 40500, 41000],
  "7d": [36000, 37000, 36500, 38000, 39500, 38500, 40000, 41000],
  "1m": [28000, 29500, 29000, 31000, 33000, 32500, 35000, 37000, 39500],
  "1y": [12000, 15000, 14000, 18000, 22000, 21000, 26000, 30000, 34000, 32000, 39500]
};

/* AKTUÁLIS ÁR FELIRAT A VONAL VÉGÉN */
const aktualisArPlugin = {
  id: 'aktualisAr',
  afterDraw(chart) {
    const ctx = chart.ctx;
    const dataset = chart.data.datasets[0];
    const lastIndex = dataset.data.length - 1;
    const lastValue = dataset.data[lastIndex];

    const meta = chart.getDatasetMeta(0);
    const point = meta.data[lastIndex];
    if (!point) return;

    ctx.save();
    ctx.fillStyle = '#4cff9b';
    ctx.font = '12px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(
      `$${lastValue.toLocaleString()}`,
      point.x + 8,
      point.y + 4
    );
    ctx.restore();
  }
};

/* CHART INIT */
const chart = new Chart(grafikonElem, {
  type: 'line',
  data: {
    labels: arfolyamAdatok["24h"].map((_, i) => i),
    datasets: [{
      data: arfolyamAdatok["24h"],
      borderColor: '#4cff9b',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(76,255,155,0.12)',
      pointRadius: 0
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#0d1733',
        titleColor: '#aaa',
        bodyColor: '#4cff9b',
        displayColors: false,
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  },
  plugins: [aktualisArPlugin]
});

/* IDŐTÁV VÁLTÁS */
document.querySelectorAll('.ido-intervallum button').forEach(gomb => {
  gomb.addEventListener('click', () => {

    document.querySelectorAll('.ido-intervallum button')
      .forEach(b => b.classList.remove('aktiv'));
    gomb.classList.add('aktiv');

    const idotav = gomb.dataset.idotav;

    chart.data.labels = arfolyamAdatok[idotav].map((_, i) => i);
    chart.data.datasets[0].data = arfolyamAdatok[idotav];
    chart.update();
  });
});
// ===== WALLET BETÖLTÉS =====
let wallet = JSON.parse(localStorage.getItem("wallet"));

if(!wallet){
  wallet = {
    usd: 10000,
    AXLX: 5,
    NRVX: 5
  };
  localStorage.setItem("wallet", JSON.stringify(wallet));
}

// ===== ÁR =====
const price = 3950; // demo ár

// ===== KIÍRÁS FRISSÍTÉS =====
function updateUI(){

  // mindig friss wallet betöltés
  wallet = JSON.parse(localStorage.getItem("wallet"));

  const balance = wallet.NRVX;
  const coinUsdValue = balance * price;

  // COIN MENNYISÉG
  document.querySelector(".egyenleg h2").textContent =
    balance.toFixed(4) + " NRVX";

  // COIN USD ÉRTÉKE
  document.querySelector(".egyenleg span").textContent =
    "$" + coinUsdValue.toFixed(2);

  // VALÓDI USD EGYENLEG (ha van külön elem hozzá)
  const usdElem = document.querySelector(".usd-egyenleg");
  if(usdElem){
    usdElem.textContent =
      "USD egyenleg: $" + wallet.usd.toFixed(2);
  }

  // Ár
  document.querySelector(".ar").innerHTML =
    "$" + price.toLocaleString() +
    ' <span class="novekedes">+5.3%</span>';
}

// első betöltés
updateUI();

// ha másik tabon változik
window.addEventListener("storage", function(e){
  if(e.key === "wallet"){
    wallet = JSON.parse(e.newValue);
    updateUI();
  }
});