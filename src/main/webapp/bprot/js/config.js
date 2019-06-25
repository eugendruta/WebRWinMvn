//Initialisierung Dialoge
var aktdialog;
var table1;
var url;
var config = {
  "default":
    {"showonstart": false,
      "data": {
        "inputfelder": [
          {"name": "lenr", "visible": "true", "dbcolumn": "le", "eingabe": ""},
          {"name": "lotyplb", "visible": "true", "eingabe": ""},
          {"name": "ezolb", "visible": "true", "eingabe": ""},
          {"name": "dispostatuslb", "visible": "true", "eingabe": ""},
          {"name": "kiste", "visible": "true", "eingabe": ""},
          {"name": "mandantlb", "visible": "true", "eingabe": ""},
          {"name": "lagerortlb", "visible": "true", "eingabe": ""},
          {"name": "ezoavisiertlb", "visible": "true", "eingabe": ""},
          {"name": "qsstatuslb", "visible": "true", "eingabe": ""},
          {"name": "container", "visible": "true", "eingabe": ""},
          {"name": "hostlagerlb", "visible": "true", "eingabe": ""},
          {"name": "lagerbereichlb", "visible": "true", "eingabe": ""},
          {"name": "vonz", "visible": "true", "eingabe": ""},
          {"name": "vonx", "visible": "true", "eingabe": ""},
          {"name": "vony", "visible": "true", "eingabe": ""},
          {"name": "bisz", "visible": "true", "eingabe": ""},
          {"name": "bisx", "visible": "true", "eingabe": ""},
          {"name": "bisy", "visible": "true", "eingabe": ""},
          {"name": "transportlb", "visible": "true", "eingabe": ""},
          {"name": "herstellerlb", "visible": "true", "eingabe": ""},
          {"name": "lhmtyplb", "visible": "true", "eingabe": ""},
          {"name": "inventurlb", "visible": "true", "eingabe": ""},
          {"name": "teilenummer", "visible": "true", "eingabe": ""},
          {"name": "letzteinvvonlb", "visible": "true", "eingabe": ""},
          {"name": "letzteinvbislb", "visible": "true", "eingabe": ""},
          {"name": "intsperrelb", "visible": "true", "eingabe": ""}
        ],
        "listboxen": [
          {"name": "lotyplb", "typ": "appKonst", "table": "V_AC_FLSLAGERORTTYP",
            "dbcolumn": "FLSLAGERORTTYP"},
          {"name": "ezolb", "typ": "appKonst", "table": "V_DLG_BSUEB_ZONEAKTUELL",
            "dbcolumn": "ZONEAKTUELL"},
          {"name": "dispostatuslb", "typ": "Konst", "table": "V_UX_KONSTANTEN",
            "constkey": "LE.DispoStatus", "dbcolumn": "DISPOSTATUS"},
          {"name": "mandantlb", "typ": "appKonst", "table": "V_AC_MANDANT",
            "dbcolumn": "MANDANT", "dependend": "hostlagerlb"},
          {"name": "lagerortlb", "typ": "sqlstm",
            "table": "SELECT OID as id, NAME FROM V_DLG_BSUEB_LAGERORT WHERE name is not null order by 2",
            "dbcolumn": "nd_lagerortoid"},
          {"name": "hostlagerlb", "typ": "depends",
            "table": "SELECT wert, anzeige_text, mandantoid FROM V_DLG_BSUEB_HOSTLAGER",
            "constkey": "mandantoid", "dbcolumn": "HOSTLAGER"},
          {"name": "lagerbereichlb", "typ": "appKonst", "table": "V_AC_PVLAGERZONE",
            "dbcolumn": "ND_LAGERBEREICHOID"},
          {"name": "transportlb", "typ": "Konst", "table": "V_UX_KONSTANTEN",
            "constkey": "GuiBoolean", "dbcolumn": "TRANSPORT"},
          {"name": "herstellerlb", "typ": "appKonst", "table": "V_AC_HERSTELLER",
            "dbcolumn": "HERSTELLER"},
          {"name": "lhmtyplb", "typ": "appKonst", "table": "V_AC_LHMTYP", "dbcolumn": "LHMTYP"},
          {"name": "inventurlb", "typ": "Konst", "table": "V_UX_KONSTANTEN",
            "constkey": "GuiBoolean", "dbcolumn": "INVENTUR"},
          {"name": "ezoavisiertlb", "typ": "appKonst", "table": "V_AC_EINLAGERZONE",
            "dbcolumn": "ZONEAVISIERT"},
          {"name": "qsstatuslb", "typ": "Konst", "table": "V_UX_KONSTANTEN",
            "constkey": "LE.QsStatus", "dbcolumn": "QSSTATUS"},
          {"name": "intsperrelb", "typ": "Konst", "table": "V_UX_KONSTANTEN",
            "constkey": "LE.Sperre", "dbcolumn": "INTERNESPERRE"}
        ],
        "table1": {
          "name": "table_bprot",
          "view": "v_dlg_bsueb",
          "servlet": "../Auftueb?",
          "anzcolumns": "57",
          "pageLength": 5,
          "columns": [
            {"name": "AC_MANDANT", "typdata": "AppConst", "visible": "true", summe: ""},
            {"name": "AC_HERSTELLER", "typdata": "AppConst", "visible": "true", summe: ""},
            {"name": "TEILENUMMER", "typdata": "String", "visible": "true", summe: ""},
            {"name": "HERSTELLERTEILENUMMER", "typdata": "String", "visible": "true", summe: ""},
            {"name": "TEILBEZ", "typdata": "String", "visible": "true", summe: ""},
            {"name": "LE", "typdata": "String", "visible": "true", summe: ""},
            {"name": "LAGERORTBEZ", "typdata": "String", "visible": "true", summe: ""},
            {"name": "AC_ZONEAKTUELL", "typdata": "AppConst", "visible": "true", summe: ""},
            {"name": "INVENTUR", "typdata": "String", "visible": "true", summe: ""},
            {"name": "AC_INVENTURGRUND", "typdata": "AppConst", "visible": "true", summe: ""},
            {"name": "BESTANDTOTAL", "typdata": "Numeric", "visible": "true", summe: "J"},
            {"name": "BESTANDFREI", "typdata": "Numeric", "visible": "true", summe: "J"},
            {"name": "BESTANDRESERVIERT", "typdata": "Numeric", "visible": "true", summe: ""},
            {"name": "BESTANDGESPERRT", "typdata": "Numeric", "visible": "true", summe: ""},
            {"name": "TRANSPORT", "typdata": "Boolean", "visible": "true", summe: ""},
            {"name": "INTERNESPERRE", "typdata": "Numeric", "visible": "true", summe: ""},
            {"name": "CK_DISPOSTATUS", "typdata": "ConstKey", "visible": "true", summe: ""},
            {"name": "CK_QSSTATUS", "typdata": "ConstKey", "visible": "true", summe: ""},
            {"name": "AC_HOSTLAGER", "typdata": "AppConst", "visible": "true", summe: ""},
            {"name": "AVISNR", "typdata": "String", "visible": "true", summe: ""},
            {"name": "KISTENNR", "typdata": "String", "visible": "true", summe: ""},
            {"name": "CONTAINERNR", "typdata": "String", "visible": "true", summe: ""},
            {"name": "KISTENDISPO", "typdata": "Boolean", "visible": "true", summe: ""},
            {"name": "INVENTURAVISIERUNG", "typdata": "Boolean", "visible": "true", summe: ""},
            {"name": "VERPACKUNGSMENGE", "typdata": "Numeric", "visible": "true"}, //, summe: ""24
            {"name": "ND_LEOID", "typdata": "String", "visible": "false", summe: ""},
            {"name": "MANDANT", "typdata": "String", "visible": "false", summe: ""},
            {"name": "HERSTELLER", "typdata": "String", "visible": "false", summe: ""},
            {"name": "FLSLAGERORTTYP", "typdata": "String", "visible": "false", summe: ""},
            {"name": "AC_FLSLAGERORTTYP", "typdata": "AppConst", "visible": "false", summe: ""},
            {"name": "ZONEAKTUELL", "typdata": "String", "visible": "false"}, //, summe: ""30
            {"name": "AC_ZONEAKTUELL", "typdata": "AppConst", "visible": "false", summe: ""},
            {"name": "LHMTYP", "typdata": "String", "visible": "false", summe: ""},
            {"name": "AC_LHMTYP", "typdata": "AppConst", "visible": "false", summe: ""},
            {"name": "ZONEAVISIERT", "typdata": "String", "visible": "false", summe: ""},
            {"name": "AC_ZONEAVISIERT", "typdata": "AppConst", "visible": "false", summe: ""},
            {"name": "ND_LAGERBEREICHOID", "typdata": "String", "visible": "false", summe: ""},
            {"name": "ND_LAGERORTOID", "typdata": "String", "visible": "false", summe: ""},
            {"name": "LAGERORTBEZ", "typdata": "String", "visible": "false", summe: ""},
            {"name": "LB", "typdata": "String", "visible": "false", summe: ""},
            {"name": "ZEILE", "typdata": "String", "visible": "false"}, //, summe: ""40
            {"name": "X", "typdata": "String", "visible": "false", summe: ""},
            {"name": "Y", "typdata": "String", "visible": "false", summe: ""},
            {"name": "BESTANDNACHGEFRAGT", "typdata": "Numeric", "visible": "false", summe: ""},
            {"name": "BESTANDGEPLANT", "typdata": "Numeric", "visible": "false", summe: ""},
            {"name": "BESTANDLAUEFT", "typdata": "Numeric", "visible": "false", summe: ""},
            {"name": "EINHEIT", "typdata": "String", "visible": "false", summe: ""},
            {"name": "ISRETOURE", "typdata": "Boolean", "visible": "false", summe: ""},
            {"name": "INVENTURGRUND", "typdata": "String", "visible": "false", summe: ""},
            {"name": "CK_INTERNESPERRE", "typdata": "ConstKey", "visible": "false", summe: ""},
            {"name": "DISPOSTATUS", "typdata": "String", "visible": "false"}, //, summe: ""50
            {"name": "QSSTATUS", "typdata": "Numeric", "visible": "false", summe: ""},
            {"name": "HOSTLAGER", "typdata": "String", "visible": "false", summe: ""},
            {"name": "WEDATUM", "typdata": "Date", "visible": "false", "ColumnFormat": "dd.MM.yyyy", summe: ""},
            {"name": "ERZEUGTDATUM", "typdata": "Date", "visible": "false", "ColumnFormat": "dd.MM.yyyy HH:MI", summe: ""},
            {"name": "EINLAGERDATUM", "typdata": "String", "visible": "false", summe: ""},
            {"name": "INVENTURDATUM", "typdata": "Date", "visible": "false", "ColumnFormat": "dd.MM.yyyy, summe ="}
          ]
        }
      }
    },
  "obj":
    {height: 600, sortIndx: 0,
      "colModel": [
        {"title": "Teil", "width": 100, dataType: "string", //# 0
          "colModel": [
            {"title": "MD", minWidth: 60},
            {"title": "HC"},
            {"title": "Teilenr.", minWidth: 60},
            {"title": "H-Teilenr.", minWidth: 70},
            {"title": "Bezeichnung", minWidth: 90}
          ]
        },
        {"title": "LE", "width": 100, dataType: "string", //# 1
          "colModel": [
            {"title": "Nr.", minWidth: 60},
            {"title": "Lagerort"},
            {"title": "EZO"}
          ]
        },
        {"title": "Inventur", dataIndx: "inv", //# 2
          "colModel": [
            {"title": "INV", dataIndx: "inv", maxWidth: 30, minWidth: 30, align: "center",
              resizable: false,
              menuIcon: false,
              type: 'checkBoxSelection',
              editor: false, dataType: 'bool', editable: false,
              cb: {
                all: false, //checkbox selection in the header affect current page only.
                header: false //show checkbox in header. 
              },
              sortType: function (rowData1, rowData2, dataIndx) {
                var val1 = rowData1[dataIndx],
                  val2 = rowData2[dataIndx],
                  c1 = $.trim(val1).length,
                  c2 = $.trim(val2).length;
                console.log('INV:sortType(): c1: ' + c1 + '; c2: ' + c2);
                if (c1 > c2) {
                  return 1;
                } else if (c1 < c2) {
                  return -1;
                } else {
                  return 0;
                }
              },
              render: function (ui) {
                var rowData = ui.rowData;
                if (rowData[8] !== '0') {
                  return "<input type='checkbox' checked disabled/>";
                } else {
                  return "<input type='checkbox' disabled/>";
                }
              }
            },
            {"title": "Grund"}
          ]
        },
        {"title": "Bestände", "width": 100, dataType: "string", //# 3
          "colModel": [
            {"title": "total"},
            {"title": "verfüg."},
            {"title": "reser."},
            {"title": "gesperrt"}
          ]
        },

        {"title": "TR", dataIndx: "tr", cls: 'green', //# 4          
          "colModel": [
            {"title": "", dataIndx: "tr", minWidth: 30, align: "center",
              resizable: false,
              menuIcon: false,
              type: 'checkBoxSelection',
              editor: false, dataType: 'bool', editable: false,
              cb: {
                all: false, //checkbox selection in the header affect current page only.
                header: false //show checkbox in header. 
              },
              sortType: function (rowData1, rowData2, dataIndx) {
                var val1 = rowData1[dataIndx],
                  val2 = rowData2[dataIndx],
                  c1 = $.trim(val1).length,
                  c2 = $.trim(val2).length;
                console.log('TR: sortType(): c1: ' + c1 + '; c2: ' + c2);
                if (c1 > c2) {
                  return 1;
                } else if (c1 < c2) {
                  return -1;
                } else {
                  return 0;
                }
              },
              render: function (ui) {
                var rowData = ui.rowData;
                if (rowData[14] !== '0') {
                  return "<input type='checkbox' checked disabled/>";
                } else {
                  return "<input type='checkbox' disabled>";
                }
              }
            }
          ]
        },

        {"title": "SP", dataType: "string", "cls": 'red', //# 5
          "colModel": [
            {"title": "", "minWidth": 30, "cls": 'beige'}
          ]
        },

        {"title": "DS", dataType: "string", //# 6
          "colModel": [
            {"title": "", "minWidth": 60}
          ]
        },

        {"title": "QS-Status", dataType: "string", //# 7
          "colModel": [
            {"title": "", "minWidth": 75}
          ]
        },

        {"title": "Hostlager", dataType: "string", //# 8
          "colModel": [
            {"title": "", "minWidth": 100}
          ]
        },

        {"title": "Avis", "width": 150, dataType: "string", //# 9
          "colModel": [
            {"title": "Nr."},
            {"title": "Kiste"},
            {"title": "Container", "minWidth": 65}
          ]
        },

        {"title": "Kistendispo", dataIndx: "kd", //# 10
          "colModel": [
            {"title": "", dataIndx: "kd", minWidth: 80, align: "center",
              resizable: false,
              menuIcon: false,
              type: 'checkBoxSelection',
              editor: false, dataType: 'bool', editable: false,
              cb: {
                all: false, //checkbox selection in the header affect current page only.
                header: false //show checkbox in header. 
              },
              sortType: function (rowData1, rowData2, dataIndx) {
                var val1 = rowData1[dataIndx],
                  val2 = rowData2[dataIndx],
                  c1 = $.trim(val1).length,
                  c2 = $.trim(val2).length;
                console.log('Kistendispo: sortType(): c1: ' + c1 + '; c2: ' + c2);
                if (c1 > c2) {
                  return 1;
                } else if (c1 < c2) {
                  return -1;
                } else {
                  return 0;
                }
              },
              render: function (ui) {
                var rowData = ui.rowData;
                if (rowData[22] !== '0') {
                  return "<input type='checkbox' checked disabled/>";
                } else {
                  return "<input type='checkbox' disabled>";
                }
              }
            }
          ]
        },

        {"title": "Inventur", dataIndx: "ina", //# 11
          "colModel": [
            {"title": "INA", dataIndx: "ina", minWidth: 60, align: "center",
              resizable: false,
              menuIcon: false,
              type: 'checkBoxSelection',
              editor: false, dataType: 'bool', editable: false,
              cb: {
                all: false, //checkbox selection in the header affect current page only.
                header: false //show checkbox in header. 
              },
              sortType: function (rowData1, rowData2, dataIndx) {
                var val1 = rowData1[dataIndx],
                  val2 = rowData2[dataIndx],
                  c1 = $.trim(val1).length,
                  c2 = $.trim(val2).length;
                console.log('INA: sortType(): c1: ' + c1 + '; c2: ' + c2);
                if (c1 > c2) {
                  return 1;
                } else if (c1 < c2) {
                  return -1;
                } else {
                  return 0;
                }
              },
              render: function (ui) {
                var rowData = ui.rowData;
                if (rowData[23] !== '0') {
                  return "<input type='checkbox' checked disabled/>";
                } else {
                  return "<input type='checkbox' disabled>";
                }
              }
            }
          ]
        },
        {"title": "Verp.menge", dataType: "string",
          "colModel": [
            {"title": "", "minWidth": 80}
          ]//# 12
        }
      ],
      "scrollModel": {pace: "fast", horizontal: true, autoFit: false, theme: false},
      "dataModel": {"location": "local", "url": url, "sorting": "local"},
      "filterModel": {"on": false, "header": true},
      "selectionModel": {"type": "row", "fireSelectChange": true}
    },
  "variante1":
    {"showonstart": true,
      "data": {
        "inputfelder": [
          {"name": "lenr", "visible": "true"},
          {"name": "lotyplb", "visible": "false"},
          {"name": "ezolb", "visible": "false"},
          {"name": "dispostatuslb", "visible": "false"},
          {"name": "kiste", "visible": "false"},
          {"name": "mandantlb", "visible": "false"},
          {"name": "lagerortlb", "visible": "false"},
          {"name": "ezoavisiertlb", "visible": "false"},
          {"name": "qsstatuslb", "visible": "false"},
          {"name": "container", "visible": "false"},
          {"name": "hostlagerlb", "visible": "false"},
          {"name": "lagerbereichlb", "visible": "false"},
          {"name": "vonz", "visible": "false"},
          {"name": "vonx", "visible": "false"},
          {"name": "vony", "visible": "false"},
          {"name": "bisz", "visible": "false"},
          {"name": "bisx", "visible": "false"},
          {"name": "bisy", "visible": "false"},
          {"name": "transportlb", "visible": "false"},
          {"name": "herstellerlb", "visible": "false"},
          {"name": "lhmtyplb", "visible": "false"},
          {"name": "inventurlb", "visible": "false"},
          {"name": "teilenummer", "visible": "false"},
          {"name": "letzteinvvonlb", "visible": "false"},
          {"name": "letzteinvbislb", "visible": "false"},
          {"name": "intsperrelb", "visible": "false"}
        ]
      }
    }
};