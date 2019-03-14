$(document).ready(function () {
  dialogname = 'webrw';
  UTIL.logger(dialogname + ': ready(): Start'); // # 1

  //** FileIO
  /*
   function readSingleFile(evt) {
   //Retrieve the first (and only!) File from the FileList object
   var f = evt.target.files[0];
   
   if (f) {
   var r = new FileReader();
   r.onload = function (e) {
   var contents = e.target.result;
   alert("Got the file.name: " + f.name + "n"
   + "type: " + f.type + "n"
   + "size: " + f.size + " bytesn"
   + "starts with: " + contents.substr(0, contents.indexOf("n"))
   );
   };
   r.readAsText(f);
   } else {
   alert("Failed to load file");
   }
   }
   
   document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
   */
  //**File IO

  //** Callback
  // generic logStuff function that prints to console
  function logStuff(userData) {
    if (typeof userData === "string")
    {
      console.log(userData);
    } else if (typeof userData === "object")
    {
      for (var item in userData) {
        console.log(item + ": " + userData[item]);
      }
    }
  }
  // A function that takes two parameters, the last one a callback function
  function getInput(options, callback) {
    callback(options);
  }
  // When we call the getInput function, we pass logStuff as a parameter.
  // So logStuff will be the function that will called back (or executed) inside the getInput function
  getInput({name: "Rich", speciality: "JavaScript"}, logStuff);
  //  name: Rich
  // speciality: JavaScript
  //** Callback

  //**Browsersupport-Check, indem die Existenz des content Attributs des template Elements geprüft wird.
  //  if ('content' in document.createElement('template')) {
  //    alert('Template supported');
  //  }
  //**Browsersupport-Check, indem die Existenz des content Attributs des template Elements geprüft wird.

  //** WebSockets
  //UTIL.websocket();
  //** WebSockets

  //** Long Polling per JS
  //UTIL.longpolling();
  //**

  //** SSE 
  /*
   var sseid;
   function ssecallback() {
   //Sjax Server call
   $.ajax({url: "../sse",
   success: function (result) {
   UTIL.logger(dialogname + ': ssecallback(): result: ' + result);
   }});
   }
   var evtSource;
   if (typeof (EventSource) !== "undefined") {
   evtSource = new EventSource("../sse");
   evtSource.addEventListener('message', function (e) {
   var data = JSON.parse(e.data);
   console.log("generic message time: " + data.time);
   }, false);
   
   evtSource.addEventListener('userlogon', function (e) {
   var data = JSON.parse(e.data);
   //console.log('userlogon:' + data.username);
   }, false);
   
   evtSource.addEventListener('update', function (e) {
   var data = JSON.parse(e.data);
   //console.log('update: ' + data.username + ' is now ' + data.emotion);
   }, false);
   } else {
   //Edge: kein SSE Support; Polling
   sseid = setInterval(ssecallback, 10000);
   }
   */
  //** SSE

  //WebRTC
  /* 
   if (UTIL.supportWebRTC()) {
   UTIL.getUserIP(function (ip) {
   localStorage.setItem("ipadresse", ip); 
   });
   } else {
   alert("WebRTC nicht supported< bitteClient IP Adresse manuel eingeben.");
   }
   */

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    UTIL.logger(dialogname + ': localStorage: key: ' + key + '; value: ' + value);
  }

  //Start Navigator im localStorage eintragen 
  localStorage.setItem("starttime", Date().toString());
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    //alert('The File APIs are fully supported in this browser.');    
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }

  if (typeof (Worker) !== "undefined") {
    //alert('Yes! Web worker support!');
  } else {
    alert('No! Web worker support!');
  }

//!!!TEST clear localStorage
//localStorage.removeItem("bsueb.eingabe");
//localStorage.removeItem("bsueb.ausgabe");
//!!!!TEST

  winarray = [];
  // Event: Eintrag in localstorage
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
    //Aktiven Dialoge anzeigen: als aktiviert
    if (newvalue === 'focus') {
      $("#aktwndlst").append(
        '<li onclick="lstaktwnd($(this).text());">' + key + ' aktiv</li>');
      // Dialog als aktiviert in localstorage eintragen
      localStorage.removeItem(key);
      localStorage.setItem(key, 'aktiviert');
    } else if (!newvalue || newvalue === null) {
      //Eintrag im Dialog gelöscht; Dialog in liste aktiver Dialoge löschen
      $("#aktwndlst li").each(function (index, value) {
        UTIL.logger(dialogname + ': onStorageEvent(): index:  ' + index
          + '; value.innerText: ' + value.innerText + '; key: ' + key);
        if (key === value.innerText.substring(0, 5)) {
          value.remove();
          UTIL.logger(dialogname + ': onStorageEvent(): index:  ' + index
            + '; value: ' + value.innerText + ' gelöscht');
        }
      });
    }

//!!! TEST
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
      UTIL.logger(dialogname + ': onStorageEvent(): localStorage: key: ' + key + '; value: ' + value);
    }
//!!!TEST    
  }

  window.addEventListener('storage', onStorageEvent, false);
  /*
   $(document).keypress(function (event) {
   var keycode = (event.keyCode ? event.keyCode : event.which);
   UTIL.logger(dialogname + ': document.keypress: keycode: ' + keycode);
   if (keycode === 13) {
   alert('Please press "submit" button instead of the "enter" key');
   }
   });
   */

  //CR in Kennwortfeld
  $('#kennwort').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    /*
     UTIL.logger(dialogname + ': #1 #kennwort.keypress: keycode: ' + keycode);
     if (keycode === 13) {
     UTIL.logger(dialogname + ': #2 #kennwort.keypress: keycode: ' + keycode);
     login();
     }
     */
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
    UTIL.logger(dialogname + ': beforeunload(): winarray.lenght: ' + winarray.length);
    //Wenn noch offene Dialoge; alle schließen
    for (let i = 0; i < winarray.length; i++) {
      //{dialog: newWin, name: aktdialog, state: 'aktiv'};
      UTIL.logger(dialogname + ': beforeunload: window: dialog.name:'
        + winarray[i].dialog.name + '; name: ' + winarray[i].name + '; state: ' + winarray[i].state);
      //Aktives Window schließen
      winarray[i].dialog.close();
    }
    //Einträge löschen 
    winarray.splice(0, winarray.length);
    //localStorage.clear();

    //SSE benden
    if (evtSource) {
      UTIL.logger(dialogname + ': beforeunload(): SSE close');
      evtSource.close();
    } else {
      UTIL.logger(dialogname + ': beforeunload(): setInterval close');
      clearInterval(sseid);
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
  if (browser === 'Edge') {
    window.resizeTo(200, window.screen.availHeight);
    window.moveTo(0, 0);
  } else {
    //Minimale Browserwindow size: Firefox: 316; Chrome: 434; Edge: 448
    /*
     if (window.outerWidth > 450) {
     alert('Bitte Browserfenster(breite) minimieren !!!');
     }
     */
    UTIL.logger(dialogname + ': browser: ' + browser);
    window.moveTo(100, 100); //funzt nur für Edge
    var messagetyp = 'warn'; // error
    var message = 'Bitte Brwoserfenster auf minimale Breite reduzieren.';
    UTIL.showMessage(message, messagetyp);
  }

  $("#tabs").tabs();

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
// bind 'tree.click' event
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
    var eingetragen = localStorage.getItem(aktdialog) ? true : false;
    UTIL.logger(dialogname + ': dialog: ' + aktdialog + ' eingetragen: ' + eingetragen);
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
      UTIL.logger(dialogname + ': aktdialog: ' + aktdialog + ';_width: ' + _width + '; _height: ' + _height);
      if (_width && _height) {
        var winProps = 'height=' + _height + ',width=' + _width + 'left=' + left + ',top=' + top;
      } else {
        var winProps = 'height=500,width=600,left=' + left + ',top=' + top;
      }
      //http://localhost:8080/WebRWin/bsueb/bsueb.html
      var newWin = window.open("../" + aktdialog + "/" + aktdialog + ".html", aktdialog, winProps);
      UTIL.logger(dialogname + ': dialog: ' + newWin.name + ' gestartet');
      var winstate = {dialog: newWin, name: aktdialog, state: 'aktiv'};
      winarray.push(winstate);
      UTIL.logger(dialogname + ': left: ' + left + '; top: ' + top + '; winarray.length: ' + winarray.length);
      if (browser === 'Edge') {
        newWin.focus();
      } else {
//Firefox und Chrome: window.focus() funzt nicht
      }
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
    UTIL.logger(dialogname + ': login(): benutzer: ' + benutzer + "; kennwort:"
      + kennwort + "; kennwort.length: " + kennwort.length);
    /*
     if (UTIL.isEmpty(kennwort)) {
     UTIL.showMessage('Bitte Kennwort eingeben', 'error');
     return;
     }     
     */
    var url = "http://localhost:8080/WebRWin/login?benutzer=" + benutzer + "&kennwort=" + kennwort;
    UTIL.logger(dialogname + ': login(): benutzer: ' + benutzer
      + "; kennwort:" + kennwort + "; url: " + url);
    /*
     // Using the core $.ajax() method
     $.ajax({
     // The URL for the request
     url: url, //"post.php",
     // The data to send (will be converted to a query string)
     data: {
     id: 123
     },
     // Whether this is a POST or GET request
     type: "GET",
     // The type of data we expect back
     dataType: "json"
     }).done(function (json) {
     // Code to run if the request succeeds (is done);
     // The response is passed to the function              
     $("<h1>").text(json.title).appendTo("body");
     $("<div class=\"content\">").html(json.html).appendTo("body");
     }).fail(function (xhr, status, errorThrown) {
     // Code to run if the request fails; the raw request and
     // status codes are passed to the function
     alert("Sorry, there was a problem!");
     console.log("Error: " + errorThrown);
     console.log("Status: " + status);
     //console.dir(xhr);
     }).always(function (xhr, status) {
     // Code to run regardless of success or failure;
     alert("The request is complete!");
     });
     */
//    $.getJSON(url, function (data) {
//      // jsonString = "{\"data\":[\"0\",\"OK\"]}";
////      var retcode = data.data[0];
////      var retmsg = data.data[1];
//
//      var retcode = data.data.retcode;
//      var retmsg = data.data.retmsg;
//      console.log("success: data: " + data.toString() + ";  retcode: " + retcode + "; retmsg: " + retmsg);
//
//      if (retcode === '0') {
//        UTIL.showMessage('retcode: ' + retcode + '; ' + retmsg, 'error');
//      } else {
//        $("#navigatortbl").show();
//        $("#aktivewindows").show();
//        $("#login").hide();
//      }
//    }).fail(function (jqXHR, textStatus, error) {
//      UTIL.showMessage(textStatus + '; ' + error, 'error');
//      console.log("error");
//    });

    //$("#navigatortbl").show();
    //$("#aktivewindows").show();

    //Tabs aneiegen
    $("#tabs").tabs();
    UTIL.logger(dialogname + ': login(): Tabs anzeigen');
    
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
  pwdcr = function pwdcr() {
    console.log('webrw: pwdcr(): CR auf Pwdeingabefeld ');
  };
}); // end ready

