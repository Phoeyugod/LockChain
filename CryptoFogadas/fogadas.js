(function () {
    var gomb = document.getElementById('masolasGomb');
    var input = document.getElementById('cimInput');
    var vissza = document.getElementById('visszajelzes');

    function uzenet(szoveg, jo) {
      if (!vissza) return;
      vissza.innerHTML = szoveg;
      vissza.className = 'visszajelzes ' + (jo ? 'visszajelzes-jo' : 'visszajelzes-rossz');
      setTimeout(function () {
        vissza.innerHTML = '';
        vissza.className = 'visszajelzes';
      }, 1800);
    }

    function masolas() {
      try {
        input.focus();
        input.select();
        if (input.setSelectionRange) {
          input.setSelectionRange(0, input.value.length);
        }
        return document.execCommand('copy');
      } catch (e) {
        return false;
      }
    }

    if (gomb) {
      gomb.onclick = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        var siker = masolas();
        if (siker) uzenet('Cím kimásolva.', true);
        else uzenet('Nem sikerült. Jelöld ki és Ctrl+C.', false);
      };
    }

    // Extra: kattintás az inputra kijelöli a címet (kényelmi)
    if (input) {
      input.onclick = function () {
        try {
          input.select();
          if (input.setSelectionRange) input.setSelectionRange(0, input.value.length);
        } catch (e) {}
      };
    }
  })();


(function () {
  function $(id){ return document.getElementById(id); }

  var megosztasGomb = $('megosztasGomb');
  var hatter = $('megosztasHatter');
  var bezar = $('megosztasBezar');

  var messengerGomb = $('messengerGomb');
  var instagramGomb = $('instagramGomb');
  var qrMegnyitasGomb = $('qrMegnyitasGomb');
  var cimMasolasGomb2 = $('cimMasolasGomb2');

  var uzenet = $('megosztasUzenet');

  // Ezeket feltételezzük, hogy nálad már megvannak:
  // - a cím: <input id="cimInput" ... readonly>
  // - a QR kép: <img id="qrKep" src="..." ...>
  var cimInput = $('cimInput');
  var qrKep = $('qrKep');

  function setUzenet(t){
    if (!uzenet) return;
    uzenet.innerHTML = t;
    setTimeout(function(){ uzenet.innerHTML = ''; }, 2000);
  }

  function megnyit(){
    if (!hatter) return;
    hatter.className = 'megosztas-hatter megnyitva';
    hatter.setAttribute('aria-hidden', 'false');
  }

  function bezarModal(){
    if (!hatter) return;
    hatter.className = 'megosztas-hatter';
    hatter.setAttribute('aria-hidden', 'true');
  }

  function cimSzoveg(){
    if (!cimInput) return '';
    return (cimInput.value || '').replace(/\s+/g,'');
  }

  function masolasIE11(szoveg){
    var t = document.createElement('textarea');
    t.value = szoveg;
    t.setAttribute('readonly','');
    t.style.position = 'fixed';
    t.style.left = '-9999px';
    t.style.top = '0';
    document.body.appendChild(t);
    t.focus();
    t.select();

    var ok = false;
    try { ok = document.execCommand('copy'); } catch(e){ ok = false; }

    document.body.removeChild(t);
    return ok;
  }

  function qrMegnyitas(){
    if (!qrKep || !qrKep.src) {
      setUzenet('Nincs QR-kép (hiányzik: id="qrKep").');
      return;
    }
    window.open(qrKep.src, '_blank');
  }

  // --- KÖTÉSEK ---
  if (megosztasGomb) {
    megosztasGomb.onclick = function(e){
      if (e && e.preventDefault) e.preventDefault();
      megnyit();
    };
  }

  if (bezar) {
    bezar.onclick = function(){ bezarModal(); };
  }

  if (hatter) {
    hatter.onclick = function(e){
      e = e || window.event;
      if (e.target === hatter) bezarModal();
    };
  }

  if (cimMasolasGomb2) {
    cimMasolasGomb2.onclick = function(){
      var ok = masolasIE11(cimSzoveg());
      setUzenet(ok ? 'Cím kimásolva.' : 'Nem sikerült. Jelöld ki és Ctrl+C.');
    };
  }

  if (qrMegnyitasGomb) {
    qrMegnyitasGomb.onclick = function(){
      qrMegnyitas();
      setUzenet('QR megnyitva új lapon.');
    };
  }

  if (instagramGomb) {
    instagramGomb.onclick = function(){
      var ok = masolasIE11(cimSzoveg());
      window.open('https://www.instagram.com/', '_blank');
      setUzenet(ok ? 'Cím a vágólapon. QR megnyitva. Instagram megnyitva.'
                   : 'QR megnyitva. Instagram megnyitva. A címet másold kézzel.');
    };
  }

  if (messengerGomb) {
    messengerGomb.onclick = function(){
      var ok = masolasIE11(cimSzoveg());
      window.open('https://www.messenger.com/', '_blank');
      setUzenet(ok ? 'Cím a vágólapon. Messenger megnyitva.' : 'Messenger megnyitva. Címet másold kézzel.');
    };
  }
})();




  