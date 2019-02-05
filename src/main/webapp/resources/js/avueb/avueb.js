$(document).ready(function () {
  UTIL.logger('avueb: ready(): Start');

  //Window click event
  $(window).on("click", function (e) {
    e.preventDefault();

    var status = localStorage.getItem('avueb');
    logger('avueb: onclick(): status: ' + status);
    if (status === null) {
      //Dialog noch nicht in localstorage eingetragen: eintragen.
      localStorage.setItem('avueb', 'focus');
    }
  });

  //Window close Event
  $(window).on("beforeunload", function (e) {
    logger('avueb: beforeunload(): e: ' + e);
    e.preventDefault();

    //Eintrag in localstorage löschen
    localStorage.removeItem('avueb');

    return "Wollen Sie tatsächlich den Dialog schließen?";
  });

  function initLbs() {
    var cnt = 0;
    logger('avueb: initLbs(): aktdialog: ' + aktdialog
      + "; anzlb: " + config[aktdialog].data.anzlb);
    $("#" + aktdialog + " select").each(function (lb) {
      if (cnt < config[aktdialog].data.anzlb) {
        logger('avueb: initLbs(): lbname: ' + $(this).attr('id') + "; lb: " + lb);
        var lbname = $(this).attr('id');
        logger('avueb: initLbs(): lbname: ' + lbname);
        initLb(lbname);
      }
      cnt++;
    });
  }

  function initLb(lbname) {
    if ($('#' + lbname).val() === null) {
      //Listbox noch nicht initialisiert: init.
      var url = config[aktdialog].data[lbname].url;
      logger('avueb: initLb(): url: ' + url);
      $.getJSON(url, function (data) {
        $('#' + lbname).append($('<option></option>').val('None').html('-- Select --'));
        for (var i = 0; i < data.length; i++) {
          $('#' + lbname).append($('<option></option>').val(data[i].id).html(data[i].name));
        }
      });
    }
  }

  function showTableAVUEB(dialogtable) {
    var url = config[dialogtable].data.urltable + '&name=' + $('#lenr').val();
    var table1 = config[dialogtable].data.table1;
    logger('avueb: showTableAVUEB(): url: ' + url + "; table1: " + table1);

    table = $('#' + table1).DataTable({
      ajax: url,
      "scrollX": true,
      fixedColumns: {
        leftColumns: 1
      }
    });
  }

  function showDialogAVUEB(aktdia) {
    aktdialog = aktdia;
    logger('avueb: showDialogAVUEB(): aktdialog: ' + aktdialog);
    initLbs();
    if (config.showonstart) {
      showTable();
    }
  }

  function minimize() {
    offenedialoge[emtpydiv].height0 = $('#avueb').height();
    offenedialoge[emtpydiv].height1 = $('#avueb').parent().height();
    offenedialoge[emtpydiv].height2 = $('#avueb').parent().parent().height();
    offenedialoge[emtpydiv].height3 = $('#avueb').parent().parent().parent().height();
    offenedialoge[emtpydiv].width0 = $('#avueb').width();
    offenedialoge[emtpydiv].width1 = $('#avueb').parent().width();
    offenedialoge[emtpydiv].width2 = $('#avueb').parent().parent().width();
    offenedialoge[emtpydiv].width3 = $('#avueb').parent().parent().parent().width();
    offenedialoge[emtpydiv].left = $('#avueb').parent().parent().parent().position().left;
    offenedialoge[emtpydiv].top = $('#avueb').parent().parent().parent().position().top;

    var _height = 45;
    $('#avueb').height(_height);
    logger('avueb: minimize(): #avueb.id: ' + $('#avueb').attr('id'));
    $('#avueb').parent().height(_height);
    logger('avueb: minimize(): #avueb.parent().div.id: ' + $('#avueb').parent().find('div').attr('id'));
    $('#avueb').parent().parent().height(_height);
    logger('avueb: minimize(): #avueb.parent().parent.div.title: '
      + $('#avueb').parent().parent().find('div').attr('title'));
    $('#avueb').parent().parent().parent().height(_height + 65);
    logger('avueb: minimize(): parent().parent().parent().div.class: '
      + $('#avueb').parent().parent().parent().find('div').attr('class'));

    var _width = 540;
    $('#avueb').width(_width); //id: avueb 
    $('#avueb').parent().parent().width(_width);
    $('#avueb').parent().parent().parent().width(_width + 40);
    logger('avueb: minimize(): dialog().height(): '
      + $('#avueb').parent().parent().parent().height());

    //Dialog unten links positionieren
    $('#avueb').parent().parent().parent().css({'left': 10});
    $('#avueb').parent().parent().parent().css({'top': window.screen.height - 275});
  }

  function maximize() {
    $('#avueb').width(offenedialoge[emtpydiv].width0);
    $('#avueb').parent().width(offenedialoge[emtpydiv].width1);
    $('#avueb').parent().parent().width(offenedialoge[emtpydiv].width2);
    $('#avueb').parent().parent().parent().width(offenedialoge[emtpydiv].width3);

    $('#avueb').height(offenedialoge[emtpydiv].height0);
    $('#avueb').parent().height(offenedialoge[emtpydiv].height1);
    $('#avueb').parent().parent().height(offenedialoge[emtpydiv].height2);
    $('#avueb').parent().parent().parent().height(offenedialoge[emtpydiv].height3);

    //Ursprüngliche Position
    //Dialog unten links positionieren
    $('#avueb').parent().parent().parent().css({'left': offenedialoge[emtpydiv].left});
    $('#avueb').parent().parent().parent().css({'top': offenedialoge[emtpydiv].top});
  }
});
