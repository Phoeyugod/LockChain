// =====================
// TÉMA KEZELÉS
// =====================
(function () {

  var temaVilagos = document.getElementById("temaVilagos");
  var temaSotet = document.getElementById("temaSotet");

  function applyTheme(vilagos) {
    var body = document.body;

    localStorage.setItem("tema", vilagos ? "vilagos" : "sotet");

    body.className =
      body.className
        .replace(/\btema-vilagos\b/g, '')
        .replace(/\btema-sotet\b/g, '')
        .trim();

    body.className += vilagos ? ' tema-vilagos' : ' tema-sotet';

    if (temaVilagos && temaSotet) {
      temaVilagos.className = vilagos ? 'tema-kartya aktiv' : 'tema-kartya';
      temaSotet.className = vilagos ? 'tema-kartya' : 'tema-kartya aktiv';
    }
  }

  if (temaVilagos) temaVilagos.onclick = function () { applyTheme(true); };
  if (temaSotet) temaSotet.onclick = function () { applyTheme(false); };

  var saved = localStorage.getItem("tema");
  applyTheme(saved !== "sotet");

})();


// =====================
// TAB KEZELÉS
// =====================
(function () {

  var fulGombok = document.querySelectorAll('.ful-gomb');

  var tabok = {
    kinezet: document.getElementById('tab-kinezet'),
    tarca: document.getElementById('tab-tarca'),
    vedelem: document.getElementById('tab-vedelem'),
    rolunk: document.getElementById('tab-rolunk')
  };

  function tabValtas(nev) {
    for (var i = 0; i < fulGombok.length; i++) {
      var aktiv = fulGombok[i].getAttribute('data-tab') === nev;
      fulGombok[i].className = aktiv ? 'ful-gomb aktiv' : 'ful-gomb';
    }

    for (var k in tabok) {
      if (tabok.hasOwnProperty(k)) {
        tabok[k].className = (k === nev) ? 'tab-tartalom aktiv' : 'tab-tartalom';
      }
    }
  }

  for (var i = 0; i < fulGombok.length; i++) {
    fulGombok[i].onclick = function () {
      tabValtas(this.getAttribute('data-tab'));
    };
  }

})();


// =====================
// NYELV RENDSZER
// =====================
(function () {

  var aktualisNyelv = 'hu';

  function setSzovegek(lang) {
    aktualisNyelv = lang;

    var elemek = document.querySelectorAll('[data-hu][data-en]');

    for (var i = 0; i < elemek.length; i++) {
      elemek[i].innerHTML =
        (lang === 'en')
          ? elemek[i].getAttribute('data-en')
          : elemek[i].getAttribute('data-hu');
    }

    var nyelvErtek = document.getElementById('nyelvErtek');
    if (nyelvErtek) {
      nyelvErtek.innerHTML = (lang === 'en') ? 'English' : 'Magyar';
    }
  }

  var nyelvValaszto = document.getElementById('nyelvValaszto');
  var nyelvLista = document.getElementById('nyelvLista');

  if (nyelvValaszto) {
    nyelvValaszto.onclick = function () {
      var nyitva = nyelvLista.className.indexOf('nyitva') !== -1;
      nyelvLista.className = nyitva ? 'nyelv-lista' : 'nyelv-lista nyitva';
    };
  }

  var opciok = document.querySelectorAll('.nyelv-opcio');

  for (var i = 0; i < opciok.length; i++) {
    opciok[i].onclick = function () {
      setSzovegek(this.getAttribute('data-lang'));
      if (nyelvLista) nyelvLista.className = 'nyelv-lista';
    };
  }

  setSzovegek(aktualisNyelv);

})();


// =====================
// VÉDELEM (2FA + EMAIL POPUP)
// =====================
(function () {

  function $(id) { return document.getElementById(id); }

  function get(k, def) {
    try {
      var v = localStorage.getItem(k);
      return v === null ? def : v;
    } catch (e) { return def; }
  }

  function set(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }

  function applyToggle(btn, on) {
    if (!btn) return;
    btn.className = on ? 'kapcsolo be' : 'kapcsolo';
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function initToggle(id, key, defOn) {
    var btn = $(id);
    if (!btn) return;

    var on = get(key, defOn ? '1' : '0') === '1';

    applyToggle(btn, on);

    btn.onclick = function () {
      on = !on;
      applyToggle(btn, on);
      set(key, on ? '1' : '0');
    };
  }

  // 2FA kapcsoló
  initToggle('kapcPinVedelem', 'app_pin_vedelem', false);
  initToggle('kapc2fa', 'app_2fa', false);


  // =====================
  // EMAIL POPUP
  // =====================

  var gomb = $('pinValtoztatasGomb');
  var popup = $('pinPopup');
  var input = $('pinInput');
  var hiba = $('pinHiba');
  var mentes = $('pinMentes');
  var megse = $('pinMegse');

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function openPopup() {
    if (!popup) return;
    popup.className = 'pin-popup nyitva';
    if (input) input.focus();
    if (hiba) hiba.innerHTML = '';
  }

  function closePopup() {
    if (!popup) return;
    popup.className = 'pin-popup';
    if (input) input.value = '';
    if (hiba) hiba.innerHTML = '';
  }

  if (gomb) {
    gomb.onclick = function () {
      openPopup();
    };
  }

  if (megse) {
    megse.onclick = function () {
      closePopup();
    };
  }

  if (input) {
    input.oninput = function () {
      var val = input.value;

      if (val.length === 0) {
        hiba.innerHTML = '';
        return;
      }

      if (!emailRegex.test(val)) {
        hiba.innerHTML = 'Nem érvényes email cím!';
      } else {
        hiba.innerHTML = '';
      }
    };
  }

  if (mentes) {
    mentes.onclick = function () {
      var email = input ? input.value : '';

      if (!emailRegex.test(email)) {
        hiba.innerHTML = 'Érvénytelen email!';
        return;
      }

      set('user_email', email);

      alert('Sikeres email mentés: ' + email);

      closePopup();
    };
  }

})();