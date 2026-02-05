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