// ===== TÉMA BETÖLTÉS (localStorage alapján) =====
(function () {
  var tema = localStorage.getItem("tema");

  if (tema === "vilagos") {
    document.body.classList.add("tema-vilagos");
    document.body.classList.remove("tema-sotet");
  } else {
    document.body.classList.add("tema-sotet");
    document.body.classList.remove("tema-vilagos");
  }
})();

const grafikonElem = document.getElementById('arfolyamGrafikon');

/* ADATOK IDŐTÁVONKÉNT */
const arfolyamAdatok = {
  "24h": [3920, 3890, 3915, 3950, 3930, 3980, 4020, 3995, 4050, 4100],
  "7d": [3600, 3700, 3650, 3800, 3950, 3850, 4000, 4100],
  "1m": [2800, 2950, 2900, 3100, 3300, 3250, 3500, 3700, 3950],
  "1y": [1200, 1500, 1400, 1800, 2200, 2100, 2600, 3000, 3400, 3200, 3950]
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