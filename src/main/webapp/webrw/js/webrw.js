$(document).ready(function () {
  dialogname = 'webrw';
  UTIL.logger(dialogname + ': ready(): Start');

  if (!window.indexedDB) {
    alert(dialogname + "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    return;
  } else {
    UTIL.logger(dialogname + ": Your browser support a stable version of IndexedDB.");
  }

  //open database
  var db;
  var request = window.indexedDB.open("webrwdb", 2);
  request.onerror = function (event) {
    // Do something with request.errorCode!
    alert("Database errorCode: " + event.target.errorCode + '; request.errorCode:: ' + request.errorCode);
  };
  request.onsuccess = function (event) {
    db = request.result;

    add();
    //read();
    readAll();
    update(1);
    readAll();
    remove();
    
    UTIL.logger(dialogname + ": request.onsuccess(): open successfully: request.result: db: " + db);
  };
  request.onupgradeneeded = function (event) {
    db = event.target.result;
    //a new table called person is added, and the primary key is id.
    var objectStore;
    if (!db.objectStoreNames.contains('person')) {
      objectStore = db.createObjectStore('person', {keyPath: 'id'});
    }
    objectStore.createIndex('name', 'name', {unique: false});
    objectStore.createIndex('email', 'email', {unique: true});
  };

  //Schreiben
  function add() {
    console.log('add(): db: ' + db);
    var request = db.transaction(['person'], 'readwrite')
      .objectStore('person')
      .add({id: 1, name: 'Jam', age: 24, email: 'jam@example.com'});
    request = db.transaction(['person'], 'readwrite')
      .objectStore('person')
      .add({id: 2, name: 'Eugen', age: 74, email: 'druta@tup.com'});

    request.onsuccess = function (event) {
      console.log('add(): The data has been written successfully');
    };

    request.onerror = function (event) {
      console.log('add(): The data has been written failed');
    };
  }

  //Lesen
  function read() {
    var transaction = db.transaction(['person']);
    var objectStore = transaction.objectStore('person');
    var request = objectStore.get(1); // 1 - value of the primary key

    request.onerror = function (event) {
      console.log('read(): Transaction failed');
    };

    request.onsuccess = function (event) {
      if (request.result) {
        console.log('read(): Name: ' + request.result.name);
        console.log('read(): Age: ' + request.result.age);
        console.log('read(): Email: ' + request.result.email);
      } else {
        console.log('read(): No data record');
      }
    };
  }

  //Alles lesen
  function readAll() {
    var objectStore = db.transaction('person').objectStore('person');

    objectStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;

      if (cursor) {
        console.log('readAll(): Id: ' + cursor.key);
        console.log('readAll(): Name: ' + cursor.value.name);
        console.log('readAll(): Age: ' + cursor.value.age);
        console.log('readAll(): Email: ' + cursor.value.email);
        cursor.continue();
      } else {
        console.log('readAll(): No more data');
      }
    };
  }

  //Update
  function update(id) {
    var request = db.transaction(['person'], 'readwrite')
      .objectStore('person')
      .put({id: id, name: 'Jim', age: 35, email: 'Jim@example.com'});

    request.onsuccess = function (event) {
      console.log('update(): The data has been updated successfully');
    };

    request.onerror = function (event) {
      console.log('update(): The data has been updated failed');
    };
  }

  //Delete
  function remove(id) {
    var request = db.transaction(['person'], 'readwrite')
      .objectStore('person')
      .delete(id);

    request.onsuccess = function (event) {
      console.log('The data has been deleted successfully');
    };
  }



  //localStorage.clear();

  //Start Navigator im localStorage eintragen 
  localStorage.setItem("starttime", Date().toString());
  UTIL.logger(dialogname + ': ready(): starttime: ' + Date().toString() + ' gesetzt');

  //* winarray = [];

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

    //eintrag für key: bsueb; oldvalue: focus; newvalue: ; eintrag: focus
    //eintrag für key: bsueb; oldvalue: focus; newvalue: ; eintrag: focus
    if (oldvalue === 'focus' && (newvalue === null || !newvalue)
      && (eintrag === 'focus'))
    {
      //localStorage Eintrag wurde im Dialog gelöscht, 
      //aber ist trotzdem noch vorhanden (!! nur Edge!!):  löschen !!
      localStorage.removeItem(key);
      UTIL.logger(dialogname + ": onStorageEvent(): Dialog: " + key + ' gelöscht');
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

    //Startzeit löschen
    localStorage.removeItem("starttime");
    UTIL.logger(dialogname + ':  beforeunload(): starttime in storage gelöscht'
      + '; localStorage.length: ' + localStorage.length);

    //Noch vorhanden Dialogeinträge löschen
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
      //localStorage: key: bsueb; value: focus
      if (value === 'focus') {
        localStorage.removeItem(key);
        UTIL.logger(dialogname + ':  beforeunload(): localStorage: key: ' + key
          + '; value: ' + value + ' in storage gelöscht');
      }
    }

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
    UTIL.logger(dialogname + ': navigator.click(): node: ' + node); // # 2
    var pos = node.toString().indexOf(":");
    var aktdialog;
    if (pos !== -1) {
      aktdialog = node.toString().toLowerCase().substring(0, pos);
    } else {
      alert('Navigatoreintrag falsch');
      return;
    }

    //Liste aktiver Windows: eintragen wenn noch nicht vorhanden
    //!!!TEST
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
      UTIL.logger(dialogname + ': navigator.click()(): localStorage: key: ' + key
        + '; value: ' + value);
    }
    //!!!TEST    

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

      /* *
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
       */

      var newWin = window.open("../" + aktdialog + "/" + aktdialog + ".html", "_blank");
      UTIL.logger(dialogname + ': navigator.click(): dialog: ' + newWin.name + ' gestartet');

      localStorage.setItem(aktdialog, 'focus');
      UTIL.logger(dialogname + ': navigator.click(): localStorage: aktdialog: '
        + aktdialog + ' auf focus gesetzt');

      //Liste aktiver Dialoge updaten
      //$("#aktwndlst").append("<li class='aktlstli'>" + aktdialog.toUpperCase() + "</li>");
      //UTIL.logger(dialogname + ': navigator.click(): Liste aktiver Dialoge upgedated: aktdialog: ' + aktdialog);
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

