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

