$(document).ready(function () {
  $('#scramble').on('click', function (e) {
    $('.scramble').encode();
  });

  $('#unscramble').on('click', function (e) {
    $('.scramble').encode({action: 'unscramble'});
  });
});
