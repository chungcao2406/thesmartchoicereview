(function () {
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.addEventListener('click', function (e) {
    var copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      var code = copyBtn.getAttribute('data-copy');
      var restoreText = copyBtn.textContent;
      var restore = function () {
        copyBtn.textContent = restoreText;
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(code)
          .then(function () {
            copyBtn.textContent = 'Copied!';
            setTimeout(restore, 1800);
          })
          .catch(function () {
            /* clipboard write failed, silently ignore */
          });
      }
    }

    var trackLink = e.target.closest('[data-track-coupon]');
    if (trackLink) {
      var id = trackLink.getAttribute('data-track-coupon');
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/coupons/' + id + '/track');
      } else {
        fetch('/coupons/' + id + '/track', { method: 'POST', keepalive: true }).catch(function () {});
      }
    }
  });
})();
