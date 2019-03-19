$(document).ready(function () {
  dialogname = 'webrw';
  UTIL.logger(dialogname + ': ready(): Start'); // # 1

  //localStorage.clear();
  
  //Start Navigator im localStorage eintragen 
  localStorage.setItem("starttime", Date().toString());

  winarray = [];

  //Eventlistener: Eintrag in localstorage
  function onStorageEvent(storageEvent) {
    /* StorageEvent {
     key;          // name of the property set, changed etc.
     oldValue;     // old value of property before change
     newValue;     // new value of property after change
     url;          // url of page that made the change
     storageArea;  // localStorage or sessionStorage,
     }     
     */
    var key = storageEvent.key;
    var newvalue = storageEvent.newValue;
    var url = storageEvent.url;
    UTIL.logger(dialogname + ": onStorageEvent(): eintrag storage key: "
      + key + '; newvalue: ' + newvalue + '; url: ' + url);

    //Liste aktiven Dialoge updaten
    if (!newvalue || newvalue === null) {
      //Eintrag im Dialog gelöscht; Dialog in liste aktiver Dialoge löschen
      $("#aktwndlst li").each(function (index, value) {
        UTIL.logger(dialogname + ': onStorageEvent(): index:  ' + index
          + '; value.innerText: ' + value.innerText + '; key: ' + key);
        if (key === value.innerText.substring(0, 5).toLowerCase()) {
          value.remove();
          UTIL.logger(dialogname + ': onStorageEvent(): index:  ' + index
            + '; value: ' + value.innerText + ' gelöscht');
        }
      });
    }
  }
  window.addEventListener('storage', onStorageEvent, false);

  //CR in Kennwortfeld: login()
  $('#kennwort').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
      UTIL.logger(dialogname + ': kennwort.keypress: keycode: ' + keycode);
      login();
    }
  });

  function devicedaten() {
    var ipadresse = localStorage.getItem('ipadresse');
    var pcname = localStorage.getItem('pcname');
    UTIL.logger(dialogname + ': devicedaten(): ipadresse: ' + ipadresse + '; pcname: ' + pcname);
    if (ipadresse === null) {
      //IP-Adresse und PC-name noch nicht in localstorage eingetragen
      UTIL.showMessage("Bitte IP-Adresse und PC-Name eingeben", "info");
      //Eingabefelder und Button aktivieren
      //Button show; eingabefelder enablen
      $('#ipadresse').prop('disabled', false);
      $('#pcname').prop('disabled', false);
      $('#devspeichernbtn').show();
    } else {
      //Daten vorhanden; anzeigen
      $('#ipadresse').val(ipadresse);
      $('#pcname').val(pcname);
      //Button hide; eingabefelder disable
      $('#ipadresse').prop('disabled', true);
      $('#pcname').prop('disabled', true);
      $('#devspeichernbtn').hide();
    }
  }
  devicedaten();

  function storageAvailable() {
    if (typeof (Storage) !== "undefined") {
      // Code for localStorage
      return true;
    } else {
      return false;
    }
  }

  if (storageAvailable()) {
    // Yippee! We can use localStorage awesomeness    
    UTIL.logger(dialogname + ': localStorage verfügbar !!');
  } else {
    // Too bad, no localStorage for us
    alert('localStorage nicht verfügbar !!');
  }

  //Window close Event
  $(window).on("beforeunload", function (e) {
    e.preventDefault();

    UTIL.logger(dialogname + ': beforeunload(): winarray.lenght: ' + winarray.length);

    //Wenn noch offene Dialoge; alle schließen
    //var newWin = window.open("../bsueb/bsueb.html");
    for (let i = 0; i < winarray.length; i++) {
      //{dialog: newWin, name: aktdialog, state: 'aktiv'};
      //Aktives Window schließen wenn noch nicht TAB geschlossen
      let value = localStorage.getItem(winarray[i].name);
      UTIL.logger(dialogname + ': beforeunload: winarray[i].name: ' + winarray[i].name
        + '; value: ' + value + '; state: ' + winarray[i].state);
      if (value) {
        winarray[i].dialog.close();
      }
    }
    //Einträge löschen 
    if (winarray.length > 0) {
      winarray.splice(0, winarray.length);
    }

    //Startzeit löschen
    localStorage.removeItem("starttime");

    return "Wollen Sie tatsächlich den Dialog schließen?";
  });

  //Function: hole Browsertyp (Edge, Chrome, Firefox,   )
  getbrowser = function getBrowser() {
    var _browser = "unbekannt";
    //UTIL.logger(dialogname + ': userAgent + navigator.userAgent);
    if (navigator.userAgent.search("MSIE") >= 0) {
      _browser = "MSIE";
      UTIL.logger(dialogname + ': userAgent: ' + _browser);
    } else if (navigator.userAgent.search("Chrome") >= 0) {
      //Enthält auch Edge
      if (navigator.userAgent.search("Edge") >= 0) {
        _browser = "Edge";
        UTIL.logger(dialogname + ': userAgent: ' + _browser);
      } else {
        _browser = "Chrome";
        UTIL.logger(dialogname + ': userAgent: ' + _browser);
      }
    } else if (navigator.userAgent.search("Firefox") >= 0) {
      _browser = "Firefox";
      UTIL.logger(dialogname + ': userAgent: ' + _browser);
    } else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
      _browser = "Safari";
      UTIL.logger(dialogname + ': userAgent: ' + _browser);
    } else if (navigator.userAgent.search("Opera") >= 0) {
      _browser = "Opera";
      UTIL.logger(dialogname + ': userAgent: ' + _browser);
    } else if (navigator.userAgent.search("NET") >= 0) {
      _browser = "NET";
      UTIL.logger(dialogname + ': userAgent: ' + _browser);
    } else if (navigator.userAgent.search("Edge") >= 0) {
      _browser = "Edge";
      UTIL.logger(dialogname + ': userAgent: ' + _browser);
    } else {
      _browser = "unbekannt";
      UTIL.logger(dialogname + ': userAgent: ' + _browser);
    }

    return _browser;
  };

  browser = getbrowser();
  localStorage.setItem("browser", browser);

  lstaktwnd = function lstAktWnd(sel) {
    var seldialog = sel.substr(0, 5);
    UTIL.logger(dialogname + ': lstAktWnd(): seldialog: ' + seldialog);
    for (let i = 0; i < winarray.length; i++) {
      //{dialog: newWin, name: aktdialog, state: 'aktiv'};
      UTIL.logger(dialogname + ': lstAktWnd(): window: dialog.name:'
        + winarray[i].dialog.name + '; name: ' + winarray[i].name
        + '; state: ' + winarray[i].state);
      //Aktives/mini Window anzeigen
      if (winarray[i].name === seldialog) {
        winarray[i].dialog.focus();
      }
    }
  };

  showtab = function showtab(tab) {
    UTIL.logger(dialogname + ': showtab(): tab: ' + tab);
  };

  showtables = function showTables(dialogtable) {
    UTIL.logger(dialogname + ': showTables(): dialogtable: ' + dialogtable);
    if (dialogtable === 'bsueb#bsueb') {
      showTableBSUEB('bsueb');
    } else if (dialogtable === 'avueb#avueb') {
      showTableAVUEB('avueb');
    }
  };

  var data = [
    {
      label: 'Administration',
      children: [
        {label: 'ADUEB: Administration-Übersicht'},
        {label: 'AUUEB: Auftragsübersicht'}
      ]
    }, {
      label: 'Stammdaten',
      children: [
        {label: 'WA 1',
          children: [
            {label: 'WAUE1: WA1-Übersicht'},
            {label: 'POUEB: Positions-Übersicht'}
          ]
        },
        {label: 'WA 2'}
      ]
    }, {
      label: 'Lagerverwaltung',
      children: [
        {label: 'WA 1',
          children: [
            {label: 'WAUE1: WA1-Übersicht'},
            {label: 'POUEB: Positions-Übersicht'}
          ]
        },
        {label: 'WA 2'}
      ]
    }, {
      label: 'Geräteverwaltung',
      children: [
        {label: 'WA 1',
          children: [
            {label: 'WAUE1: WA1-Übersicht'},
            {label: 'POUEB: Positions-Übersicht'}
          ]
        },
        {label: 'WA 2'}
      ]
    }, {
      label: 'Bestandsverwaltung',
      children: [
        {label: 'BSUEB: Bestands-Übersicht'},
        {label: 'AVUEB: Auftragsübersicht'}
      ]
    }, {
      label: 'Wareneingang',
      children: [
        {label: 'WA 1',
          children: [
            {label: 'WAUE1: WA1-Übersicht'},
            {label: 'POUEB: Positions-Übersicht'}
          ]
        },
        {label: 'WA 2'}
      ]
    }, {
      label: 'Auftragsabwicklung',
      children: [
        {label: 'WA 1',
          children: [
            {label: 'WAUE1: WA1-Übersicht'},
            {label: 'POUEB: Positions-Übersicht'}
          ]
        },
        {label: 'WA 2'}
      ]
    }, {
      label: 'Transportverwaltung',
      children: [
        {label: 'WA 1',
          children: [
            {label: 'WAUE1: WA1-Übersicht'},
            {label: 'POUEB: Positions-Übersicht'}
          ]
        },
        {label: 'WA 2'}
      ]
    }, {
      label: 'Kommissionierung',
      children: [
        {label: 'WA 1',
          children: [
            {label: 'WAUE1: WA1-Übersicht'},
            {label: 'POUEB: Positions-Übersicht'}
          ]
        },
        {label: 'WA 2'}
      ]
    }, {
      label: 'Warenausgang',
      children: [
        {label: 'WA 1',
          children: [
            {label: 'WAUE1: WA1-Übersicht'},
            {label: 'POUEB: Positions-Übersicht'}
          ]
        },
        {label: 'WA 2'}
      ]
    }, {
      label: 'Leitstand',
      children: [
        {label: 'WA 1',
          children: [
            {label: 'WAUE1: WA1-Übersicht'},
            {label: 'POUEB: Positions-Übersicht'}
          ]
        },
        {label: 'WA 2'}
      ]
    }
  ];

  $('#navigator').tree({
    data: data,
    selectable: true,
    autoOpen: false,
    closedIcon: $('<i class="fas fa-folder" style="color: lightblue"></i>'),
    openedIcon: $('<i class="fas fa-folder-open" style="color: lightblue"></i>')
  });

  //'tree.click' event
  $('#navigator').bind('tree.click', function (event) {
    // The clicked node is 'event.node'
    var node = event.node.name; // node === "BSUEB: Bestands-Übersicht"
    UTIL.logger(dialogname + ': node: ' + node); // # 2
    var pos = node.toString().indexOf(":");
    var aktdialog;
    if (pos !== -1) {
      aktdialog = node.toString().toLowerCase().substring(0, pos);
    } else {
      alert('Navigatoreintrag falsch');
      return;
    }

    //Liste aktiver Windows: eintragen wenn noch nicht vorhanden
    var eingetragen = localStorage.getItem(aktdialog);
    UTIL.logger(dialogname + ': navigator.click(): dialog: ' + aktdialog
      + ' localStorage eintrag: ' + eingetragen);
    if (!eingetragen) {
      //Window Positionierung
      var left = 100 + (Math.floor((Math.random() * 100) + 1) * 5);
      var top = 100 + (Math.floor((Math.random() * 100) + 1) * 5);
      //var winProps = 'height=300,width=400,resizable=no,'
      //  + 'status=no,toolbar=no,location=no,menubar=no,'
      //  + 'titlebar=no,scrollbars=no,' + 'left=' + left + ',top=' + top;
      var _width = localStorage.getItem(aktdialog + ".width");
      _width = _width - _width / 120;
      var _height = localStorage.getItem(aktdialog + ".height");
      _height = _height - _height / 120;
      UTIL.logger(dialogname + ': navigator.click(): aktdialog: ' + aktdialog + ';_width: ' + _width + '; _height: ' + _height);
      if (_width && _height) {
        var winProps = 'height=' + _height + ',width=' + _width + 'left=' + left + ',top=' + top;
      } else {
        var winProps = 'height=500,width=600,left=' + left + ',top=' + top;
      }
      //http://localhost:8080/WebRWin/bsueb/bsueb.html
      var newWin = window.open("../" + aktdialog + "/" + aktdialog + ".html", "_blank");
      UTIL.logger(dialogname + ': navigator.click(): dialog: ' + newWin.name + ' gestartet');
      var winstate = {dialog: newWin, name: aktdialog, state: 'aktiv'};
      winarray.push(winstate);
      //UTIL.logger(dialogname + ': navigator.click(): left: ' + left + '; top: ' + top + '; winarray.length: ' + winarray.length);
      if (browser === 'Edge') {
        newWin.focus();
      } else {
        //Firefox und Chrome: window.focus() funzt nicht
      }
      localStorage.setItem(aktdialog, 'focus');
      UTIL.logger(dialogname + ': navigator.click(): localStorage: aktdialog: '
        + aktdialog + ' auf focus gesetzt');

      //Liste aktiver Diaooge updaten
      $("#aktwndlst").append("<li class='aktlstli'>" + aktdialog.toUpperCase() + "</li>");
      UTIL.logger(dialogname + ': navigator.click(): Liste aktiver Dialoge upgedated: aktdialog: ' + aktdialog);
    }
  });
  function customize(aktdialog, width, height) {
    UTIL.logger(dialogname + ': customize(): width: ' + width + "; height: " + height);
  }

  //Start: Navigator und Liste aktiver Dialoge nicht anzeigen
  $("#navigatortbl").hide();
  $("#aktivewindows").hide();

  //Login
  login = function login() {
    var benutzer = $("#benutzer").val();
    var kennwort = $("#kennwort").val();
    /*
     if (UTIL.isEmpty(kennwort)) {
     UTIL.showMessage('Bitte Kennwort eingeben', 'error');
     return;
     }     
     */
    var url = "http://localhost:8080/WebRWinMvn/login?benutzer=" + benutzer + "&kennwort=" + kennwort;
    UTIL.logger(dialogname + ': login(): benutzer: ' + benutzer
      + "; kennwort:" + kennwort + "; url: " + url);

    /*
     // Using the core $.ajax() method
     $.ajax({
     // The URL for the request
     url: url,
     data: {
     id: 123
     },
     type: "GET",
     dataType: "json"
     }).done(function (json) {
     UTIL.logger(dialogname + ': login(): Ajax Request OK');
     $("<h1>").text(json.title).appendTo("body");
     $("<div class=\"content\">").html(json.html).appendTo("body");
     }).fail(function (xhr, status, errorThrown) {
     alert("Sorry, there was a problem!");
     console.log("Error: " + errorThrown);
     console.log("Status: " + status);
     //console.dir(xhr);
     }).always(function (xhr, status) {
     //Request complete
     });
     */

    $("#navigatortbl").show();
    $("#aktivewindows").show();

    $("#login").hide();
  };

  //Devicedaten speichern
  device = function device() {
    var ipadresse = $("#ipadresse").val();
    var pcname = $("#pcname").val();
    UTIL.logger(dialogname + ': device(): ipadresse: ' + ipadresse + "; pcname:" + pcname);
    localStorage.setItem('ipadresse', ipadresse);
    localStorage.setItem('pcname', pcname);
    //Button hide; eingabefelder disable
    $('#ipadresse').prop('disabled', true);
    $('#pcname').prop('disabled', true);
    $('#devspeichernbtn').hide();
  };
}); // end ready

