$(document).ready(function () {
  dialogname = 'bsueb';

  logger(dialogname + ': ready(): Start');

  //Window click event
  $(window).on("click", function (e) {
    e.preventDefault();

    var status = localStorage.getItem(dialogname);
    logger(dialogname + ': onclick(): status: ' + status);
    if (status === null) {
      //Dialog noch nicht in localstorage eingetragen: eintragen.
      localStorage.setItem(dialogname, 'focus');
    }
  });

  //Window close Event
  $(window).on("beforeunload", function (e) {
    logger(dialogname + ': beforeunload(): e: ' + e);
    e.preventDefault();

    //Eintrag in localstorage löschen
    localStorage.removeItem(dialogname);

    return "Wollen Sie tatsächlich den Dialog schließen?";
  });

  function initLbs() {
    var cnt = 0;
    var lbname = 'lotyplb';
    logger(dialogname + '; lbname: ' + lbname);
    initLb(lbname);

    $("#" + dialogname + " select").each(function (lb) {
      var lbname = $(this).attr('id');
      logger(dialogname + '; lbname: ' + lbname);
      initLb(lbname);
      cnt++;
    });
  }
  initLbs();

  function initLb(lbname) {
    if ($('#' + lbname).val() === null) {
      //Listbox noch nicht initialisiert: init.
      var url = config[dialogname].data[lbname].url;
      logger(dialogname + ': initLb(): url: ' + url);
      $.getJSON(url, function (data) {
        for (var i = 0; i < data.length; i++) {
          $('#' + lbname).append($('<option></option>').val(data[i].id).html(data[i].name));
        }
      });
    }
  }

  function showtable(tabelle) {
    //tabelle: table1;  URL: Auftueb?table=dlg_avuebname=Eugen
    var url = config[dialogname].data['url' + tabelle] + '&name=' + $('#lenr').val();
    var table1 = config[dialogname].data[tabelle];
    logger(dialogname + ': showtable(): tabelle: ' + tabelle + '; url: ' + url + '; table1: ' + table1);

    if ($.fn.dataTable.isDataTable('#' + table1)) {
      table = $('#' + table1).DataTable();
      table.ajax.url(url).load();
    } else {
      table = $('#' + table1).DataTable({
        ajax: url,
        "scrollX": true,
        fixedColumns: {
          leftColumns: 1
        }
      });
      console.log('showTable(): # 2; table.ajax: ' + table.ajax);
    }
  };

  function minimize() {
    offenedialoge[emtpydiv].height0 = $('#' + dialogname).height(); //$('#bsueb')
    offenedialoge[emtpydiv].height1 = $('#' + dialogname).parent().height();
    offenedialoge[emtpydiv].height2 = $('#' + dialogname).parent().parent().height();
    offenedialoge[emtpydiv].height3 = $('#' + dialogname).parent().parent().parent().height();
    offenedialoge[emtpydiv].width0 = $('#' + dialogname).width();
    offenedialoge[emtpydiv].width1 = $('#' + dialogname).parent().width();
    offenedialoge[emtpydiv].width2 = $('#' + dialogname).parent().parent().width();
    offenedialoge[emtpydiv].width3 = $('#' + dialogname).parent().parent().parent().width();
    offenedialoge[emtpydiv].left = $('#' + dialogname).parent().parent().parent().position().left;
    offenedialoge[emtpydiv].top = $('#' + dialogname).parent().parent().parent().position().top;

    var _height = 45;
    $('#' + dialogname).height(_height);
    logger('#' + dialogname + ': minimize(): #bsueb.id: ' + $('#' + dialogname).attr('id'));
    $('#' + dialogname).parent().height(_height);
    logger('bsueb: minimize(): #bsueb.parent().div.id: ' + $('#'
      + dialogname).parent().find('div').attr('id'));
    $('#' + dialogname).parent().parent().height(_height);
    logger('bsueb: minimize(): #bsueb.parent().parent.div.title: '
      + $('#' + dialogname).parent().parent().find('div').attr('title'));
    $('#' + dialogname).parent().parent().parent().height(_height + 65);
    logger('bsueb: minimize(): parent().parent().parent().div.class: '
      + $('#' + dialogname).parent().parent().parent().find('div').attr('class'));

    var _width = 540;
    $('#' + dialogname).width(_width); //id: bsueb 
    $('#' + dialogname).parent().parent().width(_width);
    $('#' + dialogname).parent().parent().parent().width(_width + 40);
    logger('bsueb: minimize(): dialog().height(): '
      + $('#' + dialogname).parent().parent().parent().height());

    //Dialog unten links positionieren
    $('#' + dialogname).parent().parent().parent().css({'left': 10});
    $('#' + dialogname).parent().parent().parent().css({'top': window.screen.height - 275});
  }

  function maximize() {
    $('#' + dialogname).width(offenedialoge[emtpydiv].width0);
    $('#' + dialogname).parent().width(offenedialoge[emtpydiv].width1);
    $('#' + dialogname).parent().parent().width(offenedialoge[emtpydiv].width2);
    $('#' + dialogname).parent().parent().parent().width(offenedialoge[emtpydiv].width3);

    $('#' + dialogname).height(offenedialoge[emtpydiv].height0);
    $('#' + dialogname).parent().height(offenedialoge[emtpydiv].height1);
    $('#' + dialogname).parent().parent().height(offenedialoge[emtpydiv].height2);
    $('#' + dialogname).parent().parent().parent().height(offenedialoge[emtpydiv].height3);

    //Ursprüngliche Position
    //Dialog unten links positionieren
    $('#' + dialogname).parent().parent().parent().css({'left': offenedialoge[emtpydiv].left});
    $('#' + dialogname).parent().parent().parent().css({'top': offenedialoge[emtpydiv].top});
  }
}); // end ready
