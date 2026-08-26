(function () {
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form.matches('[data-confirm]')) {
      var msg = form.getAttribute('data-confirm') || 'Are you sure?';
      if (!window.confirm(msg)) {
        e.preventDefault();
      }
    }
  });
})();
