function rowClickSelection(tabelle, rowclickaction) {
  var selectedrow;
  var lastclicktime = 0;
  var clicktime;
  var delay = 200;
  var doubleclick = false;
  var action = '';

  //var table = $(tabelle).DataTable(); //$('#table_auueb2')
  var tableid = config[tabelle].name;
  logger(dialogname + ': rowClickSelection(): tableid: ' + tableid + '; tabelle: ' + tabelle);
  
  /*
  if ($.fn.DataTable.isDataTable('#' + tableid)) {
    //if ($.fn.dataTable.fnIsDataTable($('#' + tableid))) {
    logger(dialogname + ': rowClickSelection(): load');
    table = $('#' + tableid).DataTable();
    table.ajax.url(url).load();
    table.pagelength = 7;
  } else {
    logger(dialogname + ': rowClickSelection(): init; tabelle: ' + tabelle);
    logger(dialogname + ': rowClickSelection(): init; visible: '
      + ((config[tabelle].columns[0].visible) == "true" ? true : false));
    table = $('#' + tableid).DataTable({
      ajax: url,
      "autoWidth": true,
      "pageLength": 5,
      "columnDefs": [
        {"targets": [0], "visible": (config[tabelle].columns[0].visible) === "true" ? true : false},
        {"targets": [1], "visible": (config[tabelle].columns[1].visible) === "true" ? true : false},
        {"targets": [2], "visible": (config[tabelle].columns[2].visible) === "true" ? true : false},
        {"targets": [3], "visible": (config[tabelle].columns[3].visible) === "true" ? true : false},
        {"targets": [4], "visible": (config[tabelle].columns[4].visible) === "true" ? true : false},
        {"targets": [5], "visible": (config[tabelle].columns[5].visible) === "true" ? true : false},
        {"targets": [6], "visible": (config[tabelle].columns[6].visible) === "true" ? true : false},
        {"targets": [7], "visible": (config[tabelle].columns[7].visible) === "true" ? true : false},
        {"targets": [8],
          "visible": (config[tabelle].columns[8].visible) === "true" ? true : false,
          render: function (data, type, row) {
            console.log('data: ' + data + '; type: ' + type + '; row: ' + row[8]);
            if (data === '0') {
              return '<label class="checkbox-inactive"> <input type="checkbox"></label>';
            } else {
              return '<label class="checkbox-active"> <input type="checkbox" checked></label>';
            }
            return data;
          }
        },
        {"targets": [9], "visible": (config[tabelle].columns[9].visible) === "true" ? true : false},
        {"targets": [10], "visible": (config[tabelle].columns[10].visible) === "true" ? true : false},
        {"targets": [11], "visible": (config[tabelle].columns[11].visible) === "true" ? true : false},
        {"targets": [12], "visible": (config[tabelle].columns[12].visible) === "true" ? true : false},
        {"targets": [13], "visible": (config[tabelle].columns[13].visible) === "true" ? true : false},
        {"targets": [14],
          "visible": (config[tabelle].columns[14].visible) === "true" ? true : false,
          render: function (data, type, row) {
            if (data === '0') {
              return '<label class="checkbox-inactive"> <input type="checkbox"></label>';
            } else {
              return '<label class="checkbox-active"> <input type="checkbox" checked></label>';
            }
            return data;
          }
        },
        {"targets": [15], "visible": (config[tabelle].columns[15].visible) === "true" ? true : false},
        {"targets": [16], "visible": (config[tabelle].columns[16].visible) === "true" ? true : false},
        {"targets": [17], "visible": (config[tabelle].columns[17].visible) === "true" ? true : false},
        {"targets": [18], "visible": (config[tabelle].columns[18].visible) === "true" ? true : false},
        {"targets": [19], "visible": (config[tabelle].columns[19].visible) === "true" ? true : false},
        {"targets": [20], "visible": (config[tabelle].columns[20].visible) === "true" ? true : false},
        {"targets": [21], "visible": (config[tabelle].columns[21].visible) === "true" ? true : false},
        {"targets": [22],
          "visible": (config[tabelle].columns[22].visible) === "true" ? true : false,
          render: function (data, type, row) {
            if (data === '0') {
              return '<label class="checkbox-inactive"> <input type="checkbox"></label>';
            } else {
              return '<label class="checkbox-active"> <input type="checkbox" checked></label>';
            }
            return data;
          }
        },
        {"targets": [23],
          "visible": (config[tabelle].columns[23].visible) === "true" ? true : false,
          render: function (data, type, row) {
            if (data === '0') {
              return '<label class="checkbox-inactive"> <input type="checkbox"></label>';
            } else {
              return '<label class="checkbox-active"> <input type="checkbox" checked></label>';
            }
            return data;
          }
        },
        {"targets": [24], "visible": (config[tabelle].columns[24].visible) === "true" ? true : false},
        {"targets": [25], "visible": (config[tabelle].columns[25].visible) === "true" ? true : false},
        {"targets": [26], "visible": (config[tabelle].columns[26].visible) === "true" ? true : false},
        {"targets": [27], "visible": (config[tabelle].columns[27].visible) === "true" ? true : false},
        {"targets": [28], "visible": (config[tabelle].columns[28].visible) === "true" ? true : false},
        {"targets": [29], "visible": (config[tabelle].columns[29].visible) === "true" ? true : false},
        {"targets": [30], "visible": (config[tabelle].columns[30].visible) === "true" ? true : false},
        {"targets": [31], "visible": (config[tabelle].columns[31].visible) === "true" ? true : false},
        {"targets": [32], "visible": (config[tabelle].columns[32].visible) === "true" ? true : false},
        {"targets": [33], "visible": (config[tabelle].columns[33].visible) === "true" ? true : false},
        {"targets": [34], "visible": (config[tabelle].columns[34].visible) === "true" ? true : false},
        {"targets": [35], "visible": (config[tabelle].columns[35].visible) === "true" ? true : false},
        {"targets": [36], "visible": (config[tabelle].columns[36].visible) === "true" ? true : false},
        {"targets": [37], "visible": (config[tabelle].columns[37].visible) === "true" ? true : false},
        {"targets": [38], "visible": (config[tabelle].columns[38].visible) === "true" ? true : false},
        {"targets": [39], "visible": (config[tabelle].columns[39].visible) === "true" ? true : false},
        {"targets": [40], "visible": (config[tabelle].columns[40].visible) === "true" ? true : false},
        {"targets": [41], "visible": (config[tabelle].columns[41].visible) === "true" ? true : false},
        {"targets": [42], "visible": (config[tabelle].columns[42].visible) === "true" ? true : false},
        {"targets": [43], "visible": (config[tabelle].columns[43].visible) === "true" ? true : false},
        {"targets": [44], "visible": (config[tabelle].columns[44].visible) === "true" ? true : false},
        {"targets": [45], "visible": (config[tabelle].columns[45].visible) === "true" ? true : false},
        {"targets": [46], "visible": (config[tabelle].columns[46].visible) === "true" ? true : false},
        {"targets": [47], "visible": (config[tabelle].columns[47].visible) === "true" ? true : false},
        {"targets": [48], "visible": (config[tabelle].columns[48].visible) === "true" ? true : false},
        {"targets": [49], "visible": (config[tabelle].columns[49].visible) === "true" ? true : false},
        {"targets": [50], "visible": (config[tabelle].columns[50].visible) === "true" ? true : false},
        {"targets": [51], "visible": (config[tabelle].columns[51].visible) === "true" ? true : false},
        {"targets": [52], "visible": (config[tabelle].columns[52].visible) === "true" ? true : false},
        {"targets": [53], "visible": (config[tabelle].columns[53].visible) === "true" ? true : false},
        {"targets": [54], "visible": (config[tabelle].columns[54].visible) === "true" ? true : false},
        {"targets": [55], "visible": (config[tabelle].columns[55].visible) === "true" ? true : false},
      ]
        //"scrollX": true,
        //fixedColumns: {
        //leftColumns: 1
        //}
    });
  }
  */
 
 /*
  var table = $(tabelle).DataTable(); //$('#table_auueb2')

  $(tabelle + ' tbody').on('click', 'tr', function () {  
  */
  $(tabelle + ' tbody').on('click', 'tr', function () {
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
      tableid.$('tr.selected').removeClass('selected');
      $(this).addClass('selected');
      action = 'select';
    }

    selectedrow = table.row(this).data()[0];
    console.log('rowClickSelection(): action: ' + action + '; doubleclick:' + doubleclick + '; data: ' + table.row(this).data()[0]);

    var mandant = table.row(this).data()[0];
    rowclickaction(action, doubleclick, mandant);
  });
}