$(document).ready(function () {
  dialogname = 'webrw';
  UTIL.logger(dialogname + ': ready(): Start; startdialog: ' + config.startdialog);

  //localStorage available ??
  if (typeof (Storage) !== "undefined") {
    // Yippee! We can use localStorage awesomeness    
    //UTIL.logger(dialogname + ': localStorage verfügbar !!');
  } else {
    // Too bad, no localStorage for us
    alert('localStorage nicht verfügbar !!');
  }
  //localStorage.clear();

  //Alle Einträge im Status closed löschen
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    //UTIL.logger(dialogname + ': start: key: ' + key + '; value: ' + value);
    if (value === 'closed') {
      localStorage.removeItem(key);
      //UTIL.logger(dialogname + ': start: key: ' + key + '; value: ' + value + ' gelöscht');
    }
  }

  //Start Navigator im localStorage eintragen 
  localStorage.setItem("starttime", Date().toString());
  UTIL.logger(dialogname + ': ready(): starttime: ' + Date().toString() + ' gesetzt');

  //Window close Event
  $(window).on("beforeunload", function (e) {
    e.preventDefault();

    //Startzeit löschen
    localStorage.removeItem("starttime");
    UTIL.logger(dialogname + ':  beforeunload(): starttime in storage gelöscht'
      + '; localStorage.length: ' + localStorage.length);

    //Noch vorhanden Dialogeinträge löschen
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
      //Dialaoge im localStorage löschen (egal welcher status )
      if ((value === 'focus') || (value === 'folge')) {
        localStorage.setItem(key, 'closed');
        UTIL.logger(dialogname + ':  beforeunload(): key: ' + key + '; auf closed gesetzt');
        //localStorage.removeItem(key);
        //UTIL.logger(dialogname + ": beforeunload(): Dialog: " + key + ' gelöscht');
      }
    }

    return "Wollen Sie tatsächlich den Dialog schließen?";
  });

  //Eventlistener: Eintrag in localstorage
  function onStorageEvent(storageEvent) {
    /* StorageEvent {
     key; name of the property set, changed etc.; oldValue; old value of property before change
     newValue; new value of property after change;  url; url of page that made the change
     storageArea; localStorage or sessionStorage,
     }     
     */
    var key = storageEvent.key;
    var newvalue = storageEvent.newValue;
    var oldvalue = storageEvent.oldValue;
    var url = storageEvent.url;
    var eintrag = localStorage.getItem(key);
    UTIL.logger(dialogname + ": onStorageEvent(): eintrag für key: "
      + key + '; oldvalue: ' + oldvalue + '; newvalue: ' + newvalue
      + '; eintrag: ' + eintrag);

    //eintrag für key: bsueb; oldvalue: *; newvalue: closed; eintrag: closed
    // eintrag für key: bsueb; oldvalue: closed; newvalue: null; eintrag: null
    if (newvalue === 'closed')
    {
      //localStorage Eintrag wurde im Dialog auf closed gesetzt
      localStorage.removeItem(key);
      UTIL.logger(dialogname + ": onStorageEvent(): Dialog: " + key + ' gelöscht');
    } else if (newvalue === 'folge')
    {
      //Folgedialog starten
      aktdialog = key;
      UTIL.logger(dialogname + ": onStorageEvent(): folgedialog: " + key);
      var left = 100 + (Math.floor((Math.random() * 100) + 1) * 5);
      var top = 100 + (Math.floor((Math.random() * 100) + 1) * 5);
      //var winProps = 'height=300,width=400,resizable=no,'
      //  + 'status=no,toolbar=no,location=no,menubar=no,' + 'titlebar=no,scrollbars=no,' + 'left=' + left + ',top=' + top;
      var _width = localStorage.getItem(aktdialog + ".width");
      _width = _width - _width / 120;
      var _height = localStorage.getItem(aktdialog + ".height");
      _height = _height - _height / 120;
      UTIL.logger(dialogname + ': onStorageEvent(): aktdialog: ' + aktdialog + ';_width: ' + _width + '; _height: ' + _height);
      if (_width && _height) {
        var winProps = 'height=' + _height + ',width=' + _width + 'left=' + left + ',top=' + top;
      } else {
        var winProps = 'height=500,width=600,left=' + left + ',top=' + top;
      }

      var newWin = window.open("../" + aktdialog + "/" + aktdialog + ".html", "_blank");
      if (!newWin) {
        alert('Start Dialog' + aktdialog + ' nicht möglich; Bitte POp-Up Blocker deaktivieren.');
      } else {
        UTIL.logger(dialogname + ': onStorageEvent(): dialog: ' + newWin.name + ' gestartet');

        localStorage.setItem(aktdialog, 'focus');
        UTIL.logger(dialogname + ': onStorageEvent(): localStorage: aktdialog: '
          + aktdialog + ' auf focus gesetzt');
      }
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

  //Menue
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
        {label: 'AVUEB: Auftragsübersicht'},
        {label: 'BPROT: Bestandsprotokoll'}
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

  //Navigator
  $('#navigator').tree({
    data: data,
    selectable: true,
    autoOpen: true,
    closedIcon: $('<i class="fas fa-folder" style="color: lightblue"></i>'),
    openedIcon: $('<i class="fas fa-folder-open" style="color: lightblue"></i>')
  });

  //'Navigator click event
  $('#navigator').bind('tree.click', function (event) {
    var node = event.node.name; // node === "BSUEB: Bestands-Übersicht" 
    var pos = node.toString().indexOf(":");
    var aktdialog;
    if (pos !== -1) {
      aktdialog = node.toString().toLowerCase().substring(0, pos);
    } else {
      alert('Navigatoreintrag falsch');
      return;
    }

    var eingetragen = localStorage.getItem(aktdialog);
    UTIL.logger(dialogname + ': navigator.click(): dialog: ' + aktdialog
      + ' localStorage eintrag: ' + eingetragen);
    if (!eingetragen) {
      var left = 100 + (Math.floor((Math.random() * 100) + 1) * 5);
      var top = 100 + (Math.floor((Math.random() * 100) + 1) * 5);
      //var winProps = 'height=300,width=400,resizable=no,'
      //  + 'status=no,toolbar=no,location=no,menubar=no,' + 'titlebar=no,scrollbars=no,' + 'left=' + left + ',top=' + top;
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

      var newWin = window.open("../" + aktdialog + "/" + aktdialog + ".html", "_blank");
      UTIL.logger(dialogname + ': navigator.click(): dialog: ' + newWin.name + ' gestartet');

      localStorage.setItem(aktdialog, 'focus');
      UTIL.logger(dialogname + ': navigator.click(): localStorage: aktdialog: '
        + aktdialog + ' auf focus gesetzt');

      $('#navigator').tree('closeNode', event.node);
    }
  });

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

    //Default Startdialog starten
    var defdialog = config.startdialog;
    if (defdialog) {
      var eingetragen = localStorage.getItem(defdialog);
      UTIL.logger(dialogname + ': login(): defaultstart: dialog: ' + defdialog
        + ' localStorage eintrag: ' + eingetragen);
      if (!eingetragen) {
        var left = 100 + (Math.floor((Math.random() * 100) + 1) * 5);
        var top = 100 + (Math.floor((Math.random() * 100) + 1) * 5);
        //var winProps = 'height=300,width=400,resizable=no,'
        //  + 'status=no,toolbar=no,location=no,menubar=no,' + 'titlebar=no,scrollbars=no,' + 'left=' + left + ',top=' + top;
        var _width = localStorage.getItem(defdialog + ".width");
        _width = _width - _width / 120;
        var _height = localStorage.getItem(defdialog + ".height");
        _height = _height - _height / 120;
        UTIL.logger(dialogname + ': login(): defaultstart: ' + defdialog + ';_width: ' + _width + '; _height: ' + _height);
        if (_width && _height) {
          var winProps = 'height=' + _height + ',width=' + _width + 'left=' + left + ',top=' + top;
        } else {
          var winProps = 'height=500,width=600,left=' + left + ',top=' + top;
        }

        localStorage.setItem(defdialog, 'focus');
        UTIL.logger(dialogname + ': login(): defaultstart:  defdialog: '
          + defdialog + ' auf focus gesetzt');

        var newWin = window.open("../" + defdialog + "/" + defdialog + ".html", "_blank");
        UTIL.logger(dialogname + ': login(): defaultstart: ' + newWin.name + ' gestartet');
      }
    }

    /*
     //tree_json: [{"name":"Administration", "is_open":true, "children":[{"name":"ADUEB: Administration-Übersicht"},
     var tree_json = $('#navigator').tree('toJson');
     var tree = JSON.parse(tree_json);
     UTIL.logger(dialogname + '; login(): tree.name: ' + tree[0].name + '; name: '
     + tree[0].children[0].name + '; is_Open: ' + tree[0].is_open);
     
     //{open_nodes: [12, 23, 45], selected_node: [88]}
     var state = $('#navigator').tree('getState');
     //$('#navigator').tree('setState', state);
     UTIL.logger(dialogname + '; login(): state.open_nodes.length: ' + state.open_nodes.length
     + '; state.selected_node.length: ' + state.selected_node.length);F     
     */
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

