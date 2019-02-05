const LOGGER = true;

var UTIL = {
  /** 
   * @param {Object} msg - Message to log
   */
  logger: function logger(msg) {
    if (LOGGER) {
      console.log(msg);
    }
  },

  datumTime2String: function (datum) {
    var today = new Date();
    var options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    console.log(datum.toLocaleString('de-DE', options)); //07‎.‎01‎.‎2019‎ ‎14‎:‎44
    return datum.toLocaleString('de-DE', options);
  },

  datum2String: function (datum) {
    var _datum = new Date(datum);
    console.log(_datum.toLocaleDateString("de-DE")); // 07.01.2016
    return _datum.toLocaleDateString("de-DE");
  },

  isEmpty: function isEmpty(value) {
    if ((value === "") || (value === null) || (value <= 0) || !value)
      return true;
  },

  supportWebRTC: function supportWebRTC() {
    var isWebRTCSupported = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      window.RTCPeerConnection;

    if (window.navigator.userAgent.indexOf("Edge") > -1) {
      console.log("RTC in Edge nicht supported");
      return false;
    }

    if (isWebRTCSupported) {
      return true;
    } else {
      alert('WebRTC nicht supported');
      console.log("WebRTC nicht supported");
      return false;
    }
  },

  /**
   * Get the user IP throught the webkitRTCPeerConnection
   * @param onNewIP {Function} listener function to expose the IP locally
   * @return undefined
   */
  getUserIP: function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    UTIL.logger(dialogname + ': getUserIP()');

    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
      iceServers: []
    }),
      noop = function () {},
      localIPs = {},
      ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
      key;

    function iterateIP(ip) {
      if (!localIPs[ip])
        onNewIP(ip);
      localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function (sdp) {
      sdp.sdp.split('\n').forEach(function (line) {
        if (line.indexOf('candidate') < 0)
          return;
        line.match(ipRegex).forEach(iterateIP);
      });

      pc.setLocalDescription(sdp, noop, noop);
    }).catch(function (reason) {
      // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function (ice) {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex))
        return;
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
  },

  //Funktion: Meldungen anzeigen
  showMessage: function showMessage(message, messagetyp) {
    $("#messages").dialog({
      title: 'Meldungen',
      autoOpen: false,
      closeText: "hide",
      width: 400,
      height: 200,
      modal: true,
      position: {my: "left top", at: "left top", of: window},
      classes: {
        "ui-dialog": "msg-dialog",
        "ui-dialog-titlebar": "msg-dialog-titlebar",
        "ui-dialog-title": "msg-dialog-title",
        "ui-dialog-titlebar-close": "msg-dialog-titlebar-close",
        "ui-dialog-content": "msg-dialog-content",
        "ui-dialog-buttonpane": "msg-dialog-buttonpane",
        "ui-dialog-buttonset": "msg-dialog-buttonset"
      },
      buttons: [
        {
          text: "Ok",
          //icon: "ui-icon-heart",
          click: function () {
            $(this).dialog("close");
          }
        }
        /*,
         {
         text: "Abbrechen",
         click: function () {
         UTIL.logger(dialogname + ': abbrechen()');
         $(this).dialog("close");
         }
         }*/
      ],
      close: function (event, ui) {
        UTIL.logger(dialogname + ': close(): event.target.id: ' + event.target.id);
      }
    });
    $("#messageid").text(message);
    // Getter
    var themeClass = $("#messages").dialog("option", "classes.ui-dialog");
    UTIL.logger(dialogname + ': themeClass: ' + themeClass);
    //Setter
    $("#messageid").text(message);
    if (messagetyp === 'error') {
      $("#messages").dialog("option", "title", "Fehlermeldung");
      $("#messages").dialog("option", "classes.ui-dialog", "error");
    } else if (messagetyp === 'info') {
      $("#messages").dialog("option", "title", "Meldung");
      $("#messages").dialog("option", "classes.ui-dialog", "info");
    } else {
      $("#messages").dialog("option", "title", "Meldung");
      $("#messages").dialog("option", "classes.ui-dialog", "debug");
    }

    $("#messages").dialog('open');
  }
};