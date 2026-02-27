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
      temaVilagos.className = vilagos ? 'tema-kartya aktiv' : 'tema-kartya';
      temaSotet.className = vilagos ? 'tema-kartya' : 'tema-kartya aktiv';

      // (Opcionális) Itt tudnád ténylegesen átállítani a témát:
      // pl. body class, vagy külön CSS fájl csere.
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

  // PIN változtatás (demo)
(function () {
  function $(id){ return document.getElementById(id); }

  var pinToggleGomb = $('pinValtoztatasGomb');
  var pinPopup = $('pinPopup');
  var pinInput = $('pinInput');
  var pinHiba = $('pinHiba');
  var pinMentes = $('pinMentes');
  var pinMegse = $('pinMegse');

  function setHiba(szoveg){
    if (pinHiba) pinHiba.innerHTML = szoveg || '';
  }

  function popupNyit(zar){
    if (!pinPopup) return;
    if (zar) {
      pinPopup.className = 'pin-popup';
      setHiba('');
      if (pinInput) pinInput.value = '';
      return;
    }
    // toggle
    var nyitva = (pinPopup.className.indexOf('nyitva') !== -1);
    pinPopup.className = nyitva ? 'pin-popup' : 'pin-popup nyitva';
    setHiba('');
    if (!nyitva && pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
  }

  // Csak számot engedünk + max 6 (IE11-safe)
  function tisztitPin(szoveg){
    // nem számok törlése
    var csakSzam = (szoveg || '').replace(/\D/g, '');
    // max 6
    if (csakSzam.length > 6) csakSzam = csakSzam.substring(0, 6);
    return csakSzam;
  }

  if (pinToggleGomb) {
    pinToggleGomb.onclick = function () {
      popupNyit(false);
    };
  }

  if (pinInput) {
    // gépelés / beillesztés kezelése
    pinInput.oninput = function () {
      var uj = tisztitPin(pinInput.value);
      if (pinInput.value !== uj) pinInput.value = uj;

      // élő visszajelzés
      if (uj.length === 0) setHiba('');
      else if (uj.length < 6) setHiba('A PIN kódnak pontosan 6 számjegyűnek kell lennie.');
      else setHiba('');
    };

    // keypress: ha nem szám, tiltjuk (IE11)
    pinInput.onkeypress = function (e) {
      e = e || window.event;
      var code = e.which || e.keyCode;
      if (code === 0) return true; // bizonyos billentyűknél

      // engedjük: backspace(8) nem keypress-ben jön mindig, de ok
      // számok: 48-57
      if (code >= 48 && code <= 57) {
        // ha már 6 szám megvan, ne engedjük tovább
        var v = tisztitPin(pinInput.value);
        if (v.length >= 6) {
          if (e.preventDefault) e.preventDefault();
          return false;
        }
        return true;
      }

      // Enter: mentés
      if (code === 13) {
        if (e.preventDefault) e.preventDefault();
        if (pinMentes) pinMentes.click();
        return false;
      }

      // minden más tiltás
      if (e.preventDefault) e.preventDefault();
      return false;
    };
  }

  if (pinMegse) {
    pinMegse.onclick = function () {
      popupNyit(true);
    };
  }

  if (pinMentes) {
    pinMentes.onclick = function () {
      var pin = tisztitPin(pinInput ? pinInput.value : '');
      if (pin.length !== 6) {
        setHiba('A PIN kódnak pontosan 6 számjegyűnek kell lennie.');
        if (pinInput) pinInput.focus();
        return;
      }

      // Mentés (demo): localStorage
      try { localStorage.setItem('app_pin_kod', pin); } catch (e) {}

      setHiba('PIN elmentve.');
      // rövid idő után zárjuk
      setTimeout(function () { popupNyit(true); }, 900);
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