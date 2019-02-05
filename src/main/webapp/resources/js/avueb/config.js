//Initialisierung Dialoge
var aktdialog;
var config = {
  "bsueb": {data: {
      "showonstart": false,
      "anzlb": 2,
      "lotyplb": {"name": "lotyplb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=FLSLAGERORTTYP"},
      "ezolb": {"name": "ezolb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=ZONEAKTUELL"},
      "dispostatuslb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "mandantlb": {"name": "mandantlb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=MANDANT"},
      "lagerortlb": {"name": "lagerortlb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=ND_LAGERORTOID"},
      "ezoavisiertlb": {"name": "ezoavisiertlb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=ZONEAVISIERT"},
      "qsstatuslb": {"name": "qsstatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=QSSTATUS"},
      "hostlagerlb": {"name": "hostlagerlb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=HOSTLAGER&constdbcolumn=AC_HOSTLAGER"},
      "lagerbereichlb": {"name": "lagerbereichlb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=ND_LAGERORTOID"},
      "transportlb": {"name": "transportlb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=TRANSPORT"},
      "herstellerlb": {"name": "herstellerlb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=HERSTELLER"},
      "lhmtyplb": {"name": "lhmtyplb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=LHMTYP"},
      "inventurlb": {"name": "inventurlb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=INVENTUR"},
      "letzteinvvonlb": {"name": "letzteinvvonlb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=INVENTURDATUM&relation='>='"},
      "letzteinvbislb": {"name": "letzteinvbislb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=INVENTURDATUM&relation='<='"},
      "intsperrelb": {"name": "intsperrelb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=INTERNESPERRE"},
      "table1": "table_bsueb", "urltable1": "Auftueb?env=db&table=v_dlg_bsueb"}
  },
  "avueb": {data: {
      "showonstart": false,
      "anzlb": 16,
      "mandantlb-avueb": {"name": "mandantlb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=FLSLAGERORTTYP"},
      "statuslb-avueb": {"name": "ezolb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=ZONEAKTUELL"},
      "kzolb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "poollb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "lieferstatuslb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "auftragsartlb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "fehlerstatuslb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "versandsartlb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "lsoffenlb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "kpriovlb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "kprioblb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "verschrottunglb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "hclb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "uebertragungvlb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "uebertragungblb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "tourlb-avueb": {"name": "dispostatuslb", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=DISPOSTATUS"},
      "table1": "table_avueb", "urltable1": "Auftueb?env=db&table=v_dlg_bsueb&name=Eugen"}
  },
  "waue1": {data: {
      "showonstart": true,
      "anzlb": 0,
      "land3": {"name": "land3", "url": "Listbox?env=db&table=v_dlg_bsueb&dbcolumn=FLSLAGERORTTYP"},
      "table1": "table_auueb", "urltable1": "Auftueb?table=v_dlg_waue1"}
  }
};

dialogid = "";
offenedialoge = [
  {name: "", width0: 1400, width1: 1400, width2: 1400, width3: 1400,
    height0: 500, height1: 500, height2: 500, height3: 500, left: 100, top: 100},
  {name: "", width0: 1400, width1: 1400, width2: 1400, width3: 1400,
    height0: 500, height1: 500, height2: 500, height3: 500, left: 100, top: 100},
  {name: "", width0: 1400, width1: 1400, width2: 1400, width3: 1400,
    height0: 500, height1: 500, height2: 500, height3: 500, left: 100, top: 100},
  {name: "", width0: 1400, width1: 1400, width2: 1400, width3: 1400,
    height0: 500, height1: 500, height2: 500, height3: 500, left: 100, top: 100},
  {name: "", width0: 1400, width1: 1400, width2: 1400, width3: 1400,
    height0: 500, height1: 500, height2: 500, height3: 500, left: 100, top: 100},
  {name: "", width0: 1400, width1: 1400, width2: 1400, width3: 1400,
    height0: 500, height1: 500, height2: 500, height3: 500, left: 100, top: 100}
];
emtpydiv = -1;
