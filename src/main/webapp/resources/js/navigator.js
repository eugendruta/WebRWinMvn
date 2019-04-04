//Navigator
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

navinit = function navinit() {
  $('#navigator').tree({
    data: data,
    selectable: true,
    autoOpen: false,
    closedIcon: $('<i class="fas fa-folder" style="color: lightblue"></i>'),
    openedIcon: $('<i class="fas fa-folder-open" style="color: lightblue"></i>')
  });
};


naviclick = function naviclick(dialogname) {
  $('#navigator').bind('tree.click', function (event) {
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

    var eingetragen = localStorage.getItem(aktdialog);
    UTIL.logger(dialogname + ': navigator.click(): dialog: ' + aktdialog
      + ' localStorage eintrag: ' + eingetragen);
    if (!eingetragen) {
      var left = 100 + (Math.floor((Math.random() * 100) + 1) * 5);
      var top = 100 + (Math.floor((Math.random() * 100) + 1) * 5);
      //var winProps = 'height=300,width=400,resizable=no,'
      //  + 'status=no,toolbar=no,location=no,menubar=no,' + 'titlebar=no,scrollbars=no,' + 'left=' + left + ',top=' + top;
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

      var newWin = window.open("../" + aktdialog + "/" + aktdialog + ".html", "_blank");
      UTIL.logger(dialogname + ': navigator.click(): dialog: ' + newWin.name + ' gestartet');

      localStorage.setItem(aktdialog, 'focus');
      _eingetragen = true;
      UTIL.logger(dialogname + ': navigator.click(): localStorage: aktdialog: '
        + aktdialog + ' auf focus gesetzt');
    }
  });
};
