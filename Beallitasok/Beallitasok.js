// ===== TÉMA BETÖLTÉS =====
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

(function () {
  // IE11 safe helper
  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return document.querySelectorAll(sel); }

  // ===== Tab váltás =====
  var fulGombok = $all('.ful-gomb');
  var tabok = {
    kinezet: document.getElementById('tab-kinezet'),
    tarca: document.getElementById('tab-tarca'),
    vedelem: document.getElementById('tab-vedelem'),
    rolunk: document.getElementById('tab-rolunk')
  };

  function tabValtas(nev) {
    // gombok
    for (var i = 0; i < fulGombok.length; i++) {
      var aktiv = (fulGombok[i].getAttribute('data-tab') === nev);
      fulGombok[i].className = aktiv ? 'ful-gomb aktiv' : 'ful-gomb';
    }
    // tartalmak
    for (var k in tabok) {
      if (tabok.hasOwnProperty(k)) {
        tabok[k].className = (k === nev) ? 'tab-tartalom aktiv' : 'tab-tartalom';
      }
    }
  }

  for (var i = 0; i < fulGombok.length; i++) {
    fulGombok[i].onclick = (function (btn) {
      return function () {
        tabValtas(btn.getAttribute('data-tab'));
      };
    })(fulGombok[i]);
  }

  // ===== Téma választás (demo) =====
  var temaVilagos = document.getElementById('temaVilagos');
  var temaSotet = document.getElementById('temaSotet');

  function temaAktiv(vilagos) {
    var body = document.body;
  
    // töröljük a régi témát
    body.className = body.className
      .replace(/\btema-vilagos\b/g, '')
      .replace(/\btema-sotet\b/g, '')
      .trim();
  
    if (vilagos) {
      body.className += ' tema-vilagos';
    } else {
      body.className += ' tema-sotet';
    }
  
    temaVilagos.className = vilagos ? 'tema-kartya aktiv' : 'tema-kartya';
    temaSotet.className = vilagos ? 'tema-kartya' : 'tema-kartya aktiv';
  }
  temaVilagos.onclick = function () { temaAktiv(true); };
  temaSotet.onclick = function () { temaAktiv(false); };

  // billentyű (Enter/Space) a kártyákra
  function kartyaKey(e, vilagos) {
    e = e || window.event;
    var code = e.keyCode || e.which;
    if (code === 13 || code === 32) { // Enter vagy Space
      temaAktiv(vilagos);
      if (e.preventDefault) e.preventDefault();
      return false;
    }
  }
  temaVilagos.onkeydown = function (e) { return kartyaKey(e, true); };
  temaSotet.onkeydown = function (e) { return kartyaKey(e, false); };

  // ===== Betűméret =====
  var valaszto = document.getElementById('betuMeretValaszto');
  function meretBeallit(ertek) {
    // egyszerű body class csere
    var body = document.body;
    body.className = body.className
      .replace(/\bmeret-kicsi\b|\bmeret-kozepes\b|\bmeret-nagy\b/g, '')
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '');

    if (ertek === 'kicsi') body.className += (body.className ? ' ' : '') + 'meret-kicsi';
    if (ertek === 'kozepes') body.className += (body.className ? ' ' : '') + 'meret-kozepes';
    if (ertek === 'nagy') body.className += (body.className ? ' ' : '') + 'meret-nagy';
  }

  if (valaszto) {
    valaszto.onchange = function () {
      meretBeallit(valaszto.value);
    };
  }
})();

(function () {
// --- nyelv állapot ---
var aktualisNyelv = 'hu'; // alap: magyar

function setSzovegek(lang) {
  aktualisNyelv = lang;

  // minden olyan elem, amin van data-hu és data-en
  var elemek = document.querySelectorAll('[data-hu][data-en]');
  for (var i = 0; i < elemek.length; i++) {
    var hu = elemek[i].getAttribute('data-hu');
    var en = elemek[i].getAttribute('data-en');
    elemek[i].innerHTML = (lang === 'en') ? en : hu;
  }

  // nyelv érték felirat
  var nyelvErtek = document.getElementById('nyelvErtek');
  if (nyelvErtek) nyelvErtek.innerHTML = (lang === 'en') ? 'English' : 'Magyar';
}

// --- Tárca sorok kattintás (placeholder) ---
var sor1 = document.getElementById('sorKezdomondat');
var sor2 = document.getElementById('sorBiztMentes');

if (sor1) {
  sor1.onclick = function () {
    alert(aktualisNyelv === 'en' ? 'Recovery phrase screen' : 'Seed phrase szavak megjelenítése');
  };
}
if (sor2) {
  sor2.onclick = function () {
    alert(aktualisNyelv === 'en' ? 'Export backup' : 'Biztonsági mentés exportálás');
  };
}

// --- Nyelv dropdown ---
var nyelvValaszto = document.getElementById('nyelvValaszto');
var nyelvLista = document.getElementById('nyelvLista');

if (nyelvValaszto && nyelvLista) {
  nyelvValaszto.onclick = function () {
    var nyitva = (nyelvLista.className.indexOf('nyitva') !== -1);
    nyelvLista.className = nyitva ? 'nyelv-lista' : 'nyelv-lista nyitva';
  };
}

// opciók kezelése
var opciok = document.querySelectorAll('.nyelv-opcio');
for (var i = 0; i < opciok.length; i++) {
  opciok[i].onclick = function () {
    var lang = this.getAttribute('data-lang');
    setSzovegek(lang);

    // zárjuk be
    if (nyelvLista) nyelvLista.className = 'nyelv-lista';
  };
}

// induláskor: magyar feliratok beállítása (biztosra)
setSzovegek(aktualisNyelv);
})();
(function () {
function $(id){ return document.getElementById(id); }

function get(k, def){
  try {
    var v = localStorage.getItem(k);
    return (v === null) ? def : v;
  } catch(e){ return def; }
}
function set(k, v){
  try { localStorage.setItem(k, v); } catch(e){}
}

function applyToggle(btn, on){
  if (!btn) return;
  btn.className = on ? (btn.className.replace(/\bbe\b/g,'') + ' be') : btn.className.replace(/\bbe\b/g,'');
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
}

function initToggle(id, key, defOn){
  var btn = $(id);
  if (!btn) return;

  var stored = get(key, defOn ? '1' : '0');
  var on = (stored === '1');

  applyToggle(btn, on);

  btn.onclick = function () {
    var nowOn = (btn.getAttribute('aria-pressed') !== 'true');
    applyToggle(btn, nowOn);
    set(key, nowOn ? '1' : '0');
  };
}

// Kapcsolók (kulcsok)
initToggle('kapcPinVedelem', 'app_pin_vedelem', false);
initToggle('kapc2fa',        'app_2fa',         false);
initToggle('kapcMindigPin',  'app_mindig_pin',  false);
initToggle('kapcEgyenlegRejt','app_egyenleg_rejt', false);
initToggle('kapcCsaliPin',   'app_csali_pin',   false);

// PIN változtatás helyett Email kezelő (IE11 kompatibilis)
(function () {
  function $(id) { return document.getElementById(id); }

  // Változók definiálása
  var pinToggleGomb = $('pinValtoztatasGomb');
  var pinPopup      = $('pinPopup');
  var pinInput      = $('pinInput');
  var pinHiba       = $('pinHiba');
  var pinMentes     = $('pinMentes');
  var pinMegse      = $('pinMegse');

  // Email ellenőrző minta
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Hibaüzenet beállítása
  function setHiba(szoveg) {
    if (pinHiba) pinHiba.innerHTML = szoveg || '';
  }

  // Popup nyitása/zárása
  function popupNyit(zar) {
    if (!pinPopup) return;
    
    if (zar) {
      // Zárás
      pinPopup.className = 'pin-popup';
      setHiba('');
      if (pinInput) pinInput.value = '';
    } else {
      // Nyitás / Toggle
      var nyitva = (pinPopup.className.indexOf('nyitva') !== -1);
      if (nyitva) {
        pinPopup.className = 'pin-popup';
      } else {
        pinPopup.className = 'pin-popup nyitva';
        setHiba('');
        if (pinInput) {
          pinInput.value = '';
          pinInput.focus();
        }
      }
    }
  }

  // Szóközök eltávolítása (marad a kért név)
  function tisztitPin(szoveg) {
    return (szoveg || '').replace(/\s/g, '');
  }

  // --- Eseménykezelők ---

  // Nyitó gomb
  if (pinToggleGomb) {
    pinToggleGomb.onclick = function () {
      popupNyit(false);
    };
  }

  // Mégse gomb
  if (pinMegse) {
    pinMegse.onclick = function () {
      popupNyit(true);
    };
  }

  if (pinInput) {
    // Gépelés figyelése
    pinInput.oninput = function () {
      var uj = tisztitPin(pinInput.value);
      if (pinInput.value !== uj) pinInput.value = uj;

      if (uj.length === 0) {
        setHiba('');
      } else if (!emailRegex.test(uj)) {
        setHiba('Nem érvényes email cím!');
      } else {
        setHiba('');
      }
    };

    // Enter billentyű kezelése
    pinInput.onkeypress = function (e) {
      e = e || window.event;
      var code = e.which || e.keyCode;
      if (code === 13) {
        if (e.preventDefault) e.preventDefault();
        if (pinMentes) pinMentes.click();
        return false;
      }
      return true;
    };
  }

  // Mentés gomb
  if (pinMentes) {
    pinMentes.onclick = function () {
      var email = tisztitPin(pinInput ? pinInput.value : '');

      if (!emailRegex.test(email)) {
        setHiba('Kérjük, adjon meg egy érvényes email címet!');
        if (pinInput) pinInput.focus();
        return;
      }

      // Mentés localStorage-ba
      try { 
        localStorage.setItem('app_pin_kod', email); 
      } catch (err) { }

      setHiba('Email elmentve.');
      
      // Bezárás késleltetve
      setTimeout(function () { 
        popupNyit(true); 
      }, 900);
    };
  }
})();
})();
window.setSzovegek = function(lang){
var elems = document.querySelectorAll('[data-hu][data-en]');
for (var i=0; i<elems.length; i++){
  elems[i].innerHTML =
    (lang === 'en')
    ? elems[i].getAttribute('data-en')
    : elems[i].getAttribute('data-hu');
}

window.setSzovegek = function(lang){
  var elems = document.querySelectorAll('[data-hu][data-en]');

  for (var i = 0; i < elems.length; i++){
    var ujSzoveg =
      (lang === 'en')
      ? elems[i].getAttribute('data-en')
      : elems[i].getAttribute('data-hu');

    if (elems[i].tagName.toLowerCase() === 'option') {
      elems[i].text = ujSzoveg;
    } else {
      elems[i].innerHTML = ujSzoveg;
    }
  }
};

window.setSzovegek = function(lang){
  var elems = document.querySelectorAll('[data-hu][data-en]');

  for (var i = 0; i < elems.length; i++){
    var ujSzoveg =
      (lang === 'en')
      ? elems[i].getAttribute('data-en')
      : elems[i].getAttribute('data-hu');

    if (elems[i].tagName.toLowerCase() === 'option') {
      elems[i].text = ujSzoveg;
    } else {
      elems[i].innerHTML = ujSzoveg;
    }
  }
};
};
var temaVilagos = document.getElementById("temaVilagos");
var temaSotet = document.getElementById("temaSotet");

var temaVilagos = document.getElementById("temaVilagos");
var temaSotet = document.getElementById("temaSotet");

temaVilagos.onclick = function () {
  document.body.classList.add("tema-vilagos");
  document.body.classList.remove("tema-sotet");

  localStorage.setItem("tema", "vilagos");
};

temaSotet.onclick = function () {
  document.body.classList.remove("tema-vilagos");
  document.body.classList.add("tema-sotet");

  localStorage.setItem("tema", "sotet");
};