$(document).ready(function () {
  dialogname = 'bsueb';
  var _eingetragen = false;
  UTIL.logger(dialogname + ': ready(): Start');

  //Window close Event
  var closed = false;
  $(window).on("beforeunload", function () {
    if (!closed) {
      localStorage.setItem(dialogname, 'closed');
      _eingetragen = false;
      //Size speichern
      localStorage.setItem(dialogname + ".width", $(window).width());
      localStorage.setItem(dialogname + ".height", $(window).height());
      UTIL.logger(dialogname + ': beforeunload(): Dialog: ' + dialogname
        + ': ' + localStorage.getItem(dialogname));
    }
    /* !!!TEST
     for (let i = 0; i < localStorage.length; i++) {
     let key = localStorage.key(i);
     let value = localStorage.getItem(key);
     UTIL.logger(dialogname + ': beforeunload(): localStorage: key: ' + key
     + '; value: ' + value);
     }
     */ //!!!TEST

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

    /* webrw.html closed
     * bsueb: onStorageEvent(): eintrag für key: bsueb; oldvalue: focus; newvalue: null; 
     * eintrag: null
     */
    closed = false;
    if (dialogname === key) {
      if (newvalue === 'closed')
      {
        //localStorage Eintrag wurde im Dialog auf closed gesetzt
        closed = true;
        localStorage.removeItem(key);
        window.close();
        UTIL.logger(dialogname + ": onStorageEvent(): Dialog: " + key + ' gelöscht und closed');
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
        UTIL.logger(dialogname + ': onStorageEvent: dialog: ' + newWin.name + ' gestartet');

        localStorage.setItem(aktdialog, 'focus');
        UTIL.logger(dialogname + ': onStorageEvent: aktdialog: ' + aktdialog + ' auf focus gesetzt');
      }
    }
  }
  window.addEventListener('storage', onStorageEvent, false);

  //Navigator
  navinit();

  //'Navigator click event
  naviclick(dialogname);

  //Start: Navigator und Liste aktiver Dialoge nicht anzeigen
  $("#navigatortbl").hide();
  $("#aktivewindows").hide();

  var table; // AJAX Tabelle
  var key;
  var ctrl;

  UTIL.logger(dialogname + ': ready(): localStorage.length: ' + localStorage.length);
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    UTIL.logger(dialogname + ': ready(): localStorage: key: ' + key + '; value: ' + value);
  }
  var browser = localStorage.getItem("browser");

  //Navigator aktiv ??
  var starttime = localStorage.getItem("starttime");
  if (starttime === null) {
    alert('Navigator nicht aktiv !!  Bitte diesen Browser schließen und  Navigator starten');
    window.close(); //Funzt nur für Edge
  }

  //Hole gespeichetes Customising aus localStorage
  customize = function customize(param) {
    if (param === "param") {
      $('#custom').dialog('open');
    } else if (param === "custfelder") {
      //Eingabefelder
      let jsonstring = localStorage.getItem(dialogname + ".eingabe");
      let eingabefelder = JSON.parse(jsonstring);
      let _display = "";
      if (eingabefelder) {
        for (var i = 0; i < eingabefelder.length; i++) {
          let name = eingabefelder[i].name;
          let visible = eingabefelder[i].visible;
          let eingabe = eingabefelder[i].eingabe;
          if (visible === "false") {
            //Selkrit remove
            _display = "none";
          } else {
            //Selkrit insert
            _display = "";
          }
          $("#" + name + "lbl").css('display', _display);
          $("#" + name).css('display', _display);

          //Setze Eingaben
          if (eingabe) {
            $("#" + name).val(eingabe);
          }
        }
      }

      //Ausgabefelder
      jsonstring = localStorage.getItem(dialogname + ".ausgabe");
      let ausgabefelder = JSON.parse(jsonstring);
      _display = "";
      if (ausgabefelder) {
        for (var i = 0; i < ausgabefelder.length; i++) {
          let name = ausgabefelder[i].name;
          let visible = ausgabefelder[i].visible;
          if (visible === "false") {
            //Selkrit remove
            _display = "none";
          } else {
            //Selkrit insert
            _display = "";
          }

          if (config.default.data["table1"].columns[i].name === name) {
            config.default.data["table1"].columns[i].visible = visible;
            //UTIL.logger(dialogname + ': customize(): ausgabe: feld.name: ' + name  + ': visible: ' + visible);
          }
        }
      }
    }
  };
  customize("custfelder");

  //Key event: F-tasten abfangen
  $(document).bind('keydown', function (e) {
    key = e.which;
    ctrl = e.ctrlKey;
    //console.log('keydown: key: ' + key + "; ctrl: " + ctrl);
    //e.preventDefault();

    if (key === 17) { //Ctrl; 
      console.log('ctrl blocked');
      return false;
    }

    if (key === 17 && ctrl) { //Ctrl;  ctrl+F4
      console.log('ctrl blocked');
      return false;
    }

    if (key === 38 && table) { //Key up
      var selindex = table.rows('.selected').indexes()[0];
      //UTIL.logger(dialogname + ': selindex: ' + selindex);
      var pagelength = config.default.data["table1"].pageLength;
      var newindex = selindex % pagelength - 1;
      //UTIL.logger(dialogname + ': newindex: ' + newindex + '; pagelength: ' + pagelength);
      if (newindex < 0) {
        newindex = pagelength - 1;
      }
      table.row(':eq(' + newindex + ')', {page: 'current'}).select();
      return false;
    }

    if (key === 40) { //Key down
      var selindex = table.rows('.selected').indexes()[0];
      //UTIL.logger(dialogname + ': selindex: ' + selindex);
      var pagelength = config.default.data["table1"].pageLength;
      var newindex = selindex % pagelength + 1;
      //UTIL.logger(dialogname + ': newindex: ' + newindex + '; pagelength: ' + pagelength);
      if (newindex > pagelength - 1) {
        newindex = 0;
      }

      table.row(':eq(' + newindex + ')', {page: 'current'}).select();
      return false;
    }

    if (key === 115 && ctrl) { //ctrl+F4
      console.log('ctrl+F4 blocked');
      return false;
    }

    if (key === 115) { //F4
      console.log('F4 blocked');
      return false;
    }

    if (key === 116 && !ctrl) { //F5
      console.log('F5 blocked');
      return false;
    }

    if (key === 116 && ctrl) { //ctrl+F5
      console.log('F5/Ctrl+F5 blocked');
      return false;
    }

    if (key === 82 && ctrl) { //ctrl+r
      console.log('ctrl+r blocked');
      return false;
    }

    if (key === 9 && e.ctrl) { //ctrl+TAB
      console.log('ctrl+TAB blocked');
      return false;
    }

//    if (key === 123) { //F12
//      console.log('F5/Ctrl+F5 116 blocked');
//      return false;
//    }    
  });

  //Window click event  
  $(window).on("click", function (e) {
    //e.preventDefault();
    //UTIL.logger(dialogname + ': onclick() event.target: ' + e.target.id + '; value: ' + e.target.value);
    if (e.target.id === 'navmini') {
      //Navigator minify
      let val = e.target.value;
      UTIL.logger(dialogname + ': window.click(): Button value: ' + val);
      if (val === '<') {
        $('#navigator').hide();
        $('#navmini').val('>');
      } else if (val === '>') {
        $('#navigator').show();
        $('#navmini').val('<');
      } else {
        alert('Navigatoreintrag falsch');
      }
    }

    var status = localStorage.getItem(dialogname);
    if (status === null) {
      //Dialog noch nicht in localstorage eingetragen: eintragen.
      localStorage.setItem(dialogname, 'focus');
      UTIL.logger(dialogname + ': onclick() Dialog: ' + dialogname
        + ' im localStorage eingetragen');
    }
  });

  //Customisationdialog
  $('#custom').dialog({
    'title': 'Customize',
    'autoOpen': false,
    'width': 600,
    'height': 420,
    'modal': true,
    'closeText': ""
  });

  //Init. Listbox
  function initLb(lbname) {
    if ($('#' + lbname).val() === null) {
      //"listboxen": [{"name": "lotyplb", "typ": "appKonst", "table": "V_AC_FLSLAGERORTTYP"} oder SELECT Stmt.
      var url = "../Listbox?typ=";
      for (let i = 0; i < config.default.data.listboxen.length; i++) {
        if (config.default.data.listboxen[i].name === lbname) {
          //"table": "SELECT wert, anzeige_text FROM v_dlg_bsueb_hostlager WHERE wert is not null order by 2"
          url += config.default.data.listboxen[i].typ + "&table=" + config.default.data.listboxen[i].table;
          if (config.default.data.listboxen[i].constkey) {
            url += "&constkey=" + config.default.data.listboxen[i].constkey;
          }
          UTIL.logger(dialogname + ': initLb(): lbname: ' + lbname + '; url: ' + url);
          $.getJSON(url, function (data) {
            //data: [{"id":"0","name":"0"},{"id":"1","name":"1"}]
            $('#' + lbname).append($('<option></option>').val('0').html('Alle'));
            $.each(data, function (index, value) {
              //UTIL.logger(dialogname + ': initLbs(): id: ' + value.id + '; name: ' + value.name);
              $('#' + lbname).append($('<option></option>').val(value.id).html(value.name));
            });
          });
          $('#' + lbname).show();
        }
      }
    }
  }

  //Listbox changed
  changelb = function changelb(lbname, value) {
    /* {"name": "hostlagerlb", "typ": "depends", 
     * "table": "SELECT wert, anzeige_text FROM v_dlg_bsueb_hostlager where mandantoid = '",
     "constkey": "MAN-efa", "dbcolumn": "HOSTLAGER"},      
     */
    for (let i = 0; i < config.default.data.listboxen.length; i++) {
      if (config.default.data.listboxen[i].name === lbname) {
        dependend = config.default.data.listboxen[i].dependend;
        //UTIL.logger(dialogname + ': changelb(): lbname: ' + lbname + '; value: ' + value);
        //Dependend Listbox
        var url = "../Listbox?typ=";
        for (let j = 0; j < config.default.data.listboxen.length; j++) {
          if (config.default.data.listboxen[j].name === dependend) {
            //UTIL.logger(dialogname + ': changelb(): dependend lbname: ' + dependend);
            //url: Listbox?typ=depends&table=SELECT wert, anzeige_text FROM v_dlg_bsueb_hostlager
            //&constkey=mandantoid&constkeyval=0
            if (value != 0) {
              url += config.default.data.listboxen[j].typ + "&table="
                + config.default.data.listboxen[j].table
                + "&constkey=" + config.default.data.listboxen[j].constkey
                + "&constkeyval=" + value;
            } else {
              url += config.default.data.listboxen[j].typ + "&table=" + config.default.data.listboxen[j].table;
            }
            //UTIL.logger(dialogname + ': changelb(): url: ' + url);
            $.getJSON(url, function (data) {
              //UTIL.logger(dialogname + ': initLbs(): data.name: ' + data[0].name);
              $('#' + dependend).empty().append($('<option></option>').val('0').html('Alle'));
              $.each(data, function (index, value) {
                $('#' + dependend).append($('<option></option>').val(value.id).html(value.name));
              });
            });
            break;
          }
        }
        break;
      }
    }
  };

  //Listboxen init.
  function initLbs() {
    $("#eingabediv1 select").each(function (lb) {
      var lbname = $(this).attr('id');
      //UTIL.logger(dialogname + ': initLbs(): lb: ' + lb + '; lbname: ' + lbname);
      if (lbname !== undefined) {
        initLb(lbname);
      }
    });
  }
  initLbs();

  //Click auf Tabellenrow (aufgerufen: .on('click', 'tr')
  rowclickaction = function rowClickAction(action, doubleclick, rowdata) {
    UTIL.logger(dialogname + ': rowClickAction(): action: ' + action + '/'
      + (doubleclick === true ? 'doubleclick' : 'singleclick')
      + '; LE-Nr.: ' + rowdata[5]);
    //Doppelclick: Detaildialog starten
    if ((action === 'select') && doubleclick) {
      //UTIL.logger(dialogname + ': rowclickaction(): Doubleclick auf Zeile');
    } else if ((action === 'select') && !doubleclick) {
      //UTIL.logger(dialogname + ': rowclickaction(): Singleclick auf Zeile');
      //Toolbarbuttons enablen
      $("#detail").attr("disabled", false);
      $("#detail").css("background-color", "white");
      //Detaildaten aus Tabelle übernehmen
      $('#lenrdet').val(rowdata[5]);
      $('#lhmtypdet').val(rowdata[33]);
      $('#mandantdet').val(rowdata[0]);
      $('#herstellerdet').val(rowdata[1]);
      $('#teilenrdet').val(rowdata[2]);
      $('#hteilenrdet').val(rowdata[3]);
      $('#bezeichnungdet').val(rowdata[4]);
      $('#lotypdet').val(rowdata[29]);
      $('#lagerortdet').val(rowdata[38]);
      $('#zoneaktuelldet').val(rowdata[31]);
      //UTIL.logger(dialogname + ": transportdet: rowdata[34]: " + rowdata[34]);
      //UTIL.logger(dialogname + ": transportdet: rowdata[35]: " + rowdata[35]);
      $('#zoneavisiertdet').val(rowdata[35]);
      //Bestände
      $('#total').val(rowdata[10]);
      $('#verfuegbar').val(rowdata[11]);
      $('#reserviert').val(rowdata[12]);
      $('#gesperrt').val(rowdata[13]);
      $('#nachgefragt').val(rowdata[43]);
      $('#geplant').val(rowdata[44]);
      $('#laeuft').val(rowdata[45]);
      $('#einheit').val(rowdata[46]);
      //Status
      //typ=Konst&table=V_UX_KONSTANTEN&constkey=LE.QsStatus
      $('#dispostatusdet').val(rowdata[16]);
      $('#qsstatusdet').val(rowdata[17]);
      $('#intsperredet').val(rowdata[15]);
      //UTIL.logger(dialogname + ": transportdet: rowdata[14]: " + rowdata[14]);
      //UTIL.logger(dialogname + ": inventurdet: rowdata[8]: " + rowdata[8]);
      //UTIL.logger(dialogname + ": retouredet: rowdata[46]: " + rowdata[46]);
      $('#transportdet').prop('checked', ((rowdata[14] === 1) ? true : false));
      $('#inventurdet').prop('checked', ((rowdata[8] === 1) ? true : false));
      $('#retouredet').prop('checked', ((rowdata[46] === 1) ? true : false));
      //Datum 
      $('#fifodatumdet').val(UTIL.datum2String(rowdata[53])); //"ColumnFormat": "dd.MM.yyyy"
      $('#bildungdatumdet').val(rowdata[54]); //"ColumnFormat": "dd.MM.yyyy HH:MI"
      $('#inventurdatumdet').val(UTIL.datum2String(rowdata[56])); //"ColumnFormat": "dd.MM.yyyy"          
    }
  };

  //Tabelle anzeigen
  showtable = function showtable(tabelle) {
    var lastclicktime = 0;
    var doubleclick = false;
    var delay = 200;
    UTIL.logger(dialogname + ": showtable(tabelle): " + tabelle + '; anzcolumns: '
      + config.default.data[tabelle].anzcolumns);

    //SQL SELECT zusammenbauen
    var sqlstm = "SELECT ";
    for (let i = 0; i < config.default.data[tabelle].anzcolumns; i++) {
      sqlstm += config.default.data[tabelle].columns[i].name + ",";
    }
    sqlstm = sqlstm.substring(0, (sqlstm.length - 1)) + " FROM " + config.default.data[tabelle].view;
    //UTIL.logger(dialogname + ': sqlstm ohne WHERE: ' + sqlstm);
    //WHERE-Klausel zusammenbauen
    klausel = " WHERE ";
    //Klausel für <input> (Eingabefelder)
    $("#eingabediv1 input").each(function (lb) {
      let feldname = $(this).attr('id');
      if (feldname !== undefined) {
        var value = $(this).val();
        if (value !== '0') {
          for (let i = 0; i < config.default.data.inputfelder.length; i++) {
            if (config.default.data.inputfelder[i].name === feldname) {
              var field = config.default.data.inputfelder[i].dbcolumn;
              if ((value === null) || (value === '0') || (value === 0) || (value === '')) {
              } else {
                klausel += field + "='" + value + "' AND ";
                //Eingabe speichern
                config.default.data.inputfelder[i].eingabe = value;
                //UTIL.logger(dialogname + ': showtable(): eingaben: '
                //+ config.default.data.inputfelder[i].eingabe + '; visible: '
                //+ config.default.data.inputfelder[i].visible);
              }
              break;
            }
          }
        }
      }
    });

    //Sel.kriteingaben in localStorage speichern
    localStorage.setItem(dialogname + ".eingabe", JSON.stringify(config.default.data.inputfelder));

    //Klausel für <select> (Listboxen)
    $("#eingabediv1 select").each(function (lb) {
      var lbname = $(this).attr('id');
      if (lbname !== undefined) {
        var value = $(this).val();
        if (value !== '0') {
          for (let i = 0; i < config.default.data.listboxen.length; i++) {
            if (config.default.data.listboxen[i].name === lbname) {
              var field = config.default.data.listboxen[i].dbcolumn;
              if ((value === null) || (value === '0') || (value === 0) || (value === '')) {
              } else {
                if (config.default.data.listboxen[i].displed != "none") {
                  klausel += field + "='" + value + "' AND ";
                }
              }
              break;
            }
          }
        }
      }
    });
    //UTIL.logger(dialogname + ': showtable(): klausel liszboxen: ' + klausel);
    if (klausel !== " WHERE ") {
      sqlstm += klausel;
      sqlstm = sqlstm.substr(0, (sqlstm.length - 5));
    }

    var url = config.default.data[tabelle].servlet + "sqlstm=" + sqlstm;
    var table1 = config.default.data[tabelle].name;

    var url = config.default.data[tabelle].servlet + "sqlstm=" + sqlstm;
    //UTIL.logger(dialogname + ': table1: ' + table1 + '; showtable(): url: ' + url);
    var table1 = config.default.data[tabelle].name;
    if ($.fn.DataTable.isDataTable('#' + table1)) {
      //if ($.fn.dataTable.fnIsDataTable($('#' + table1))) {
      UTIL.logger(dialogname + ': showTable(): load');
      table = $('#' + table1).DataTable();
      table.ajax.url(url).load();
      table.pageLength = 7;
    } else {
      //Tabelle init.
      UTIL.logger(dialogname + ': showTable(): init; tabelle: ' + tabelle);
      //UTIL.logger(dialogname + ': showTable(): init; visible: '
      //+ ((config.default.data[tabelle].columns[0].visible) == "true" ? true : false));
      table = $('#' + table1).DataTable({
        "ajax": url,
        "autoWidth": false,
        "pageLength": 5,
        "keys": true,
        "select": {style: 'single'},
        "columnDefs": [
          {"targets": [0], "visible": (config.default.data[tabelle].columns[0].visible) === "true" ? true : false},
          {"targets": [1], "visible": (config.default.data[tabelle].columns[1].visible) === "true" ? true : false},
          {"targets": [2], "visible": (config.default.data[tabelle].columns[2].visible) === "true" ? true : false},
          {"targets": [3], "visible": (config.default.data[tabelle].columns[3].visible) === "true" ? true : false},
          {"targets": [4], "visible": (config.default.data[tabelle].columns[4].visible) === "true" ? true : false},
          {"targets": [5], "visible": (config.default.data[tabelle].columns[5].visible) === "true" ? true : false},
          {"targets": [6], "visible": (config.default.data[tabelle].columns[6].visible) === "true" ? true : false},
          {"targets": [7], "visible": (config.default.data[tabelle].columns[7].visible) === "true" ? true : false},
          {"targets": [8], "readonly": false,
            "visible": (config.default.data[tabelle].columns[8].visible) === "true" ? true : false,
            render: function (data, type, row) {
              if (data === '0') {
                return '<label class="checkbox-inactive"> <input type="checkbox" disabled="true"></label>';
              } else {
                return '<label class="checkbox-active"> <input type="checkbox" disabled="true" checked></label>';
              }
              return data;
            }
          },
          {"targets": [9], "visible": (config.default.data[tabelle].columns[9].visible) === "true" ? true : false},
          {"targets": [10], "visible": (config.default.data[tabelle].columns[10].visible) === "true" ? true : false},
          {"targets": [11], "visible": (config.default.data[tabelle].columns[11].visible) === "true" ? true : false},
          {"targets": [12], "visible": (config.default.data[tabelle].columns[12].visible) === "true" ? true : false},
          {"targets": [13], "visible": (config.default.data[tabelle].columns[13].visible) === "true" ? true : false},
          {"targets": [14],
            "visible": (config.default.data[tabelle].columns[14].visible) === "true" ? true : false,
            render: function (data, type, row) {
              if (data === '0') {
                return '<label class="checkbox-inactive"> <input type="checkbox" disabled="true"></label>';
              } else {
                return '<label class="checkbox-active"> <input type="checkbox" disabled="true" checked></label>';
              }
              return data;
            }
          },
          {"targets": [15], "visible": (config.default.data[tabelle].columns[15].visible) === "true" ? true : false},
          {"targets": [16], "visible": (config.default.data[tabelle].columns[16].visible) === "true" ? true : false},
          {"targets": [17], "visible": (config.default.data[tabelle].columns[17].visible) === "true" ? true : false},
          {"targets": [18], "visible": (config.default.data[tabelle].columns[18].visible) === "true" ? true : false},
          {"targets": [19], "visible": (config.default.data[tabelle].columns[19].visible) === "true" ? true : false},
          {"targets": [20], "visible": (config.default.data[tabelle].columns[20].visible) === "true" ? true : false},
          {"targets": [21], "visible": (config.default.data[tabelle].columns[21].visible) === "true" ? true : false},
          {"targets": [22],
            "visible": (config.default.data[tabelle].columns[22].visible) === "true" ? true : false,
            render: function (data, type, row) {
              if (data === '0') {
                return '<label class="checkbox-inactive"> <input type="checkbox" disabled="true"></label>';
              } else {
                return '<label class="checkbox-active"> <input type="checkbox" disabled="true" checked></label>';
              }
              return data;
            }
          },
          {"targets": [23],
            "visible": (config.default.data[tabelle].columns[23].visible) === "true" ? true : false,
            render: function (data, type, row) {
              if (data === '0') {
                return '<label class="checkbox-inactive"> <input type="checkbox" disabled="true"></label>';
              } else {
                return '<label class="checkbox-active"> <input type="checkbox" disabled="true" checked></label>';
              }
              return data;
            }
          },
          {"targets": [24], "visible": (config.default.data[tabelle].columns[24].visible) === "true" ? true : false},
          {"targets": [25], "visible": (config.default.data[tabelle].columns[25].visible) === "true" ? true : false},
          {"targets": [26], "visible": (config.default.data[tabelle].columns[26].visible) === "true" ? true : false},
          {"targets": [27], "visible": (config.default.data[tabelle].columns[27].visible) === "true" ? true : false},
          {"targets": [28], "visible": (config.default.data[tabelle].columns[28].visible) === "true" ? true : false},
          {"targets": [29], "visible": (config.default.data[tabelle].columns[29].visible) === "true" ? true : false},
          {"targets": [30], "visible": (config.default.data[tabelle].columns[30].visible) === "true" ? true : false},
          {"targets": [31], "visible": (config.default.data[tabelle].columns[31].visible) === "true" ? true : false},
          {"targets": [32], "visible": (config.default.data[tabelle].columns[32].visible) === "true" ? true : false},
          {"targets": [33], "visible": (config.default.data[tabelle].columns[33].visible) === "true" ? true : false},
          {"targets": [34], "visible": (config.default.data[tabelle].columns[34].visible) === "true" ? true : false},
          {"targets": [35], "visible": (config.default.data[tabelle].columns[35].visible) === "true" ? true : false},
          {"targets": [36], "visible": (config.default.data[tabelle].columns[36].visible) === "true" ? true : false},
          {"targets": [37], "visible": (config.default.data[tabelle].columns[37].visible) === "true" ? true : false},
          {"targets": [38], "visible": (config.default.data[tabelle].columns[38].visible) === "true" ? true : false},
          {"targets": [39], "visible": (config.default.data[tabelle].columns[39].visible) === "true" ? true : false},
          {"targets": [40], "visible": (config.default.data[tabelle].columns[40].visible) === "true" ? true : false},
          {"targets": [41], "visible": (config.default.data[tabelle].columns[41].visible) === "true" ? true : false},
          {"targets": [42], "visible": (config.default.data[tabelle].columns[42].visible) === "true" ? true : false},
          {"targets": [43], "visible": (config.default.data[tabelle].columns[43].visible) === "true" ? true : false},
          {"targets": [44], "visible": (config.default.data[tabelle].columns[44].visible) === "true" ? true : false},
          {"targets": [45], "visible": (config.default.data[tabelle].columns[45].visible) === "true" ? true : false},
          {"targets": [46], "visible": (config.default.data[tabelle].columns[46].visible) === "true" ? true : false},
          {"targets": [47], "visible": (config.default.data[tabelle].columns[47].visible) === "true" ? true : false},
          {"targets": [48], "visible": (config.default.data[tabelle].columns[48].visible) === "true" ? true : false},
          {"targets": [49], "visible": (config.default.data[tabelle].columns[49].visible) === "true" ? true : false},
          {"targets": [50], "visible": (config.default.data[tabelle].columns[50].visible) === "true" ? true : false},
          {"targets": [51], "visible": (config.default.data[tabelle].columns[51].visible) === "true" ? true : false},
          {"targets": [52], "visible": (config.default.data[tabelle].columns[52].visible) === "true" ? true : false},
          {"targets": [53], "visible": (config.default.data[tabelle].columns[53].visible) === "true" ? true : false},
          {"targets": [54], "visible": (config.default.data[tabelle].columns[54].visible) === "true" ? true : false},
          {"targets": [55], "visible": (config.default.data[tabelle].columns[55].visible) === "true" ? true : false},
        ]
          /* "scrollX": true,
           fixedColumns: {
           leftColumns: 1
           }
           */
      });
    }

    //Onclick handler auf Tabelle 
    $('#table_bsueb tbody').on('click', 'tr', function () {
      UTIL.logger(dialogname + ': onclick() auf tablerow: table: ' + '#'
        + config.default.data['table1'].name + '; row index: ' + table.row(this).index());
      clicktime = Date.now();
      if (lastclicktime === 0) {
        lastclicktime = clicktime;
      } else if ((clicktime - lastclicktime) <= delay) {
        //Doubleclick
        doubleclick = true;
      } else {
        //singleclick
        doubleclick = false;
      }
      lastclicktime = clicktime;
      if ($(this).hasClass('selected')) {
        if (!doubleclick) {
          $(this).removeClass('selected');
          action = 'deselect';
        }
      } else {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        action = 'select';
      }

      selectedrow = table.row(this).data()[0];
      UTIL.logger(dialogname + ': onclick() auf tablerow action: ' + action + '; doubleclick:'
        + doubleclick + '; data: ' + table.row(this).data()[0]);
      //var mandant = table.row(this).data()[0];
      var rowdata = table.row(this).data();
      rowclickaction(action, doubleclick, rowdata);
    });
  };

  //Folgedialog starten
  detail = function detail(aktdialog) {
    //Eintrag localStorage
    var eingetragen = localStorage.getItem(aktdialog) ? true : false;
    UTIL.logger(dialogname + ': detail(): dialog: ' + aktdialog + ' eingetragen: ' + eingetragen);
    if (eingetragen) {
      localStorage.removeItem(aktdialog);
    }
    localStorage.setItem(aktdialog, 'folge');
  };

  //tabelle aktualisieren
  aktualisieren = function aktualisieren() {
    showtable('table1');
  };

  //Customising speichern
  speicherncust = function speicherncust(tabelle) {
    let _display = "none";
    //Eingabefelder
    $('.custinput').each(function (index, value) {
      let _id = value.id;
      if (_id.indexOf("cust") >= 0) {
        _id = _id.substring(0, _id.indexOf("cust"));
      }
      //UTIL.logger(dialogname + ': speicherncust(): chekbox id: ' + _id + ': chekbox value: ' + value.checked);
      if (!value.checked) {
        //Selkrit remove
        _display = "none";
        config.default.data["inputfelder"][index].visible = "false";
      } else {
        //Selkrit insert
        _display = "";
        config.default.data["inputfelder"][index].visible = "true";
      }
      $("#" + _id + "lbl").css('display', _display);
      $("#" + _id).css('display', _display);
    });

    //In localStorage speichern
    localStorage.setItem(dialogname + ".eingabe", JSON.stringify(config.default.data.inputfelder));

    _display = "none";
    //Ausgabefelder(Tabelle)
    $('.custausgabe').each(function (index, value) {
      let _id = value.id;
      //UTIL.logger(dialogname + ": speicherncust(): index: " + index + ";  chekbox id: " + _id + ': chekbox value: ' + value.checked);
      if (!value.checked) {
        //Tabellenspalte ausblenden
        _display = "false";
      } else {
        //Selkrit insert
        _display = "true";
      }
      config.default.data[tabelle].columns[index].visible = _display;
    });

    //In localStorage speichern
    localStorage.setItem(dialogname + ".ausgabe", JSON.stringify(config.default.data[tabelle].columns));

    $("#custom").css('display', 'none');
    $('#custom').dialog('close');
  };

  resetcust = function resetcust(block, param) {
    UTIL.logger(dialogname + ': resetcust(): block: ' + block + '; param: ' + param);

    if (block === 'eingabe') {
      //Alle Checkboxen checked
      $('.custinput').each(function (index, value) {
        let _id = value.id;
        if (_id.indexOf("cust") >= 0) {
          if (param === 'reset') {
            $("#" + _id).prop("checked", true);
          } else if (param === 'clear') {
            $("#" + _id).prop("checked", false);
          }
        }
      });
    } else if (block === 'ausgabe') {
      //Alle Checkboxen checked
      $('.custausgabe').each(function (index, value) {
        let _id = value.id;
        //UTIL.logger(dialogname + ': resetausg(): _id: ' + _id);
        //if (_id.indexOf("cust") >= 0) {
        if (param === 'reset') {
          $("#" + _id).prop("checked", true);
        } else if (param === 'clear') {
          $("#" + _id).prop("checked", false);
        }
        //}
      });
    }
  };
}); // end ready
