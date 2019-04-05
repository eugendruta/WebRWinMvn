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
          "name": "table_avueb",
          "view": "v_dlg_bsueb",
          "servlet": "../Auftueb?",
          "anzcolumns": "57",
          "pageLength": 5,
          "columns": [
            {"name": "AC_MANDANT", "typdata": "AppConst", "visible": "true"},
            {"name": "AC_HERSTELLER", "typdata": "AppConst", "visible": "true"},
            {"name": "TEILENUMMER", "typdata": "String", "visible": "true"},
            {"name": "HERSTELLERTEILENUMMER", "typdata": "String", "visible": "true"},
            {"name": "TEILBEZ", "typdata": "String", "visible": "true"},
            {"name": "LE", "typdata": "String", "visible": "true"},
            {"name": "LAGERORTBEZ", "typdata": "String", "visible": "true"},
            {"name": "AC_ZONEAKTUELL", "typdata": "AppConst", "visible": "true"},
            {"name": "INVENTUR", "typdata": "Boolean", "visible": "true"},
            {"name": "AC_INVENTURGRUND", "typdata": "AppConst", "visible": "true"},
            {"name": "BESTANDTOTAL", "typdata": "Numeric", "visible": "true"},
            {"name": "BESTANDFREI", "typdata": "Numeric", "visible": "true"},
            {"name": "BESTANDRESERVIERT", "typdata": "Numeric", "visible": "true"},
            {"name": "BESTANDGESPERRT", "typdata": "Numeric", "visible": "true"},
            {"name": "TRANSPORT", "typdata": "Boolean", "visible": "true"},
            {"name": "INTERNESPERRE", "typdata": "Numeric", "visible": "true"},
            {"name": "CK_DISPOSTATUS", "typdata": "ConstKey", "visible": "true"},
            {"name": "CK_QSSTATUS", "typdata": "ConstKey", "visible": "true"},
            {"name": "AC_HOSTLAGER", "typdata": "AppConst", "visible": "true"},
            {"name": "AVISNR", "typdata": "String", "visible": "true"},
            {"name": "KISTENNR", "typdata": "String", "visible": "true"},
            {"name": "CONTAINERNR", "typdata": "String", "visible": "true"},
            {"name": "KISTENDISPO", "typdata": "Boolean", "visible": "true"},
            {"name": "INVENTURAVISIERUNG", "typdata": "Boolean", "visible": "true"},
            {"name": "VERPACKUNGSMENGE", "typdata": "Numeric", "visible": "true"}, //24
            {"name": "ND_LEOID", "typdata": "String", "visible": "false"},
            {"name": "MANDANT", "typdata": "String", "visible": "false"},
            {"name": "HERSTELLER", "typdata": "String", "visible": "false"},
            {"name": "FLSLAGERORTTYP", "typdata": "String", "visible": "false"},
            {"name": "AC_FLSLAGERORTTYP", "typdata": "AppConst", "visible": "false"},
            {"name": "ZONEAKTUELL", "typdata": "String", "visible": "false"}, //30
            {"name": "AC_ZONEAKTUELL", "typdata": "AppConst", "visible": "false"},
            {"name": "LHMTYP", "typdata": "String", "visible": "false"},
            {"name": "AC_LHMTYP", "typdata": "AppConst", "visible": "false"},
            {"name": "ZONEAVISIERT", "typdata": "String", "visible": "false"},
            {"name": "AC_ZONEAVISIERT", "typdata": "AppConst", "visible": "false"},
            {"name": "ND_LAGERBEREICHOID", "typdata": "String", "visible": "false"},
            {"name": "ND_LAGERORTOID", "typdata": "String", "visible": "false"},
            {"name": "LAGERORTBEZ", "typdata": "String", "visible": "false"},
            {"name": "LB", "typdata": "String", "visible": "false"},
            {"name": "ZEILE", "typdata": "String", "visible": "false"}, //40
            {"name": "X", "typdata": "String", "visible": "false"},
            {"name": "Y", "typdata": "String", "visible": "false"},
            {"name": "BESTANDNACHGEFRAGT", "typdata": "Numeric", "visible": "false"},
            {"name": "BESTANDGEPLANT", "typdata": "Numeric", "visible": "false"},
            {"name": "BESTANDLAUEFT", "typdata": "Numeric", "visible": "false"},
            {"name": "EINHEIT", "typdata": "String", "visible": "false"},
            {"name": "ISRETOURE", "typdata": "Boolean", "visible": "false"},
            {"name": "INVENTURGRUND", "typdata": "String", "visible": "false"},
            {"name": "CK_INTERNESPERRE", "typdata": "ConstKey", "visible": "false"},
            {"name": "DISPOSTATUS", "typdata": "String", "visible": "false"}, //50
            {"name": "QSSTATUS", "typdata": "Numeric", "visible": "false"},
            {"name": "HOSTLAGER", "typdata": "String", "visible": "false"},
            {"name": "WEDATUM", "typdata": "Date", "visible": "false", "ColumnFormat": "dd.MM.yyyy"},
            {"name": "ERZEUGTDATUM", "typdata": "Date", "visible": "false", "ColumnFormat": "dd.MM.yyyy HH:MI"},
            {"name": "EINLAGERDATUM", "typdata": "String", "visible": "false"},
            {"name": "INVENTURDATUM", "typdata": "Date", "visible": "false", "ColumnFormat": "dd.MM.yyyy"}
          ]
        }
      }
    },
  "obj":
    {"width": 700,
      "height": 400,
      "colModel": [
        {"title": "Teil", "width": 100, dataType: "string",
          "colModel": [
            {"title": "MD"},
            {"title": "HC"},
            {"title": "Teilenummer"},
            {"title": "H-Teilenummer"},
            {"title": "Bezeichnung"}
          ]
        },
        {"title": "LE", "width": 100, dataType: "string", hidden: false,
          "colModel": [
            {"title": "Nr."},
            {"title": "Lagerort"},
            {"title": "EZO"}
          ]
        },
        {"title": "Inventur", "width": 100, dataType: "string", hidden: false,
          "colModel": [
            {"title": "INV", dataIndx: "state", maxWidth: 30, minWidth: 30, align: "center",
              resizable: false,
              menuIcon: false,
              type: 'checkBoxSelection', sortable: false,
              editor: false, dataType: 'bool', editable: false, 
              cb: {
                all: false, //checkbox selection in the header affect current page only.
                header: false //show checkbox in header. 
              }
            },
            {"title": "Grund"}
          ]
        }
      ],
      "dataModel": {"location": "remote", "url": url},
      "filterModel": {"on": false, "header": true},
      "selectionModel": {"type": "row", "fireSelectChange": ""}
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