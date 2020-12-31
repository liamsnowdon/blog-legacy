(function () {
  // Set default config for ScrollReveal
  ScrollReveal({
    duration: 1200,
    delay: 100
  });

  ScrollReveal().reveal('.js-pod', { interval: 200 });
  ScrollReveal().reveal('.js-hero-text', { interval: 200, distance: '50px', origin: 'top' });

  var Helpers = {
     /**
      * Throttle a function call so it is only run x amount of times in the space of time
      * @param {*} func 
      * @param {*} limit 
      * @see {@link https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf}
      */
    throttle: function (func, limit) {
        var lastFunc;
        var lastRan;

        return function () {
            var context = this;
            var args = arguments;

            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
                }, limit - (Date.now() - lastRan));
            }
        }
      }
  };
  
  var ScrollToTop = {
    initialise: function () {
      this.scrollToTopButton = document.querySelector('.js-scroll-to-top-button');
      this.scrollToTopButtonSmoothScrollInstance = new SmoothScroll('.js-scroll-to-top-button', {
        updateURL: false
      });

      this.connectEvents();
    },

    connectEvents: function () {
      window.addEventListener('scroll', Helpers.throttle(this.setScrollToTopButtonClass, 100).bind(this));
    },

    /**
     * Toggles the active class on the scroll to top button based on scroll position
     */
    setScrollToTopButtonClass: function () {
      var windowHeight = window.innerHeight;
      var windowScrollY = window.scrollY;

      if (windowScrollY > windowHeight) {
          this.scrollToTopButton.classList.add('c-scroll-to-top--active');
      } else {
          this.scrollToTopButton.classList.remove('c-scroll-to-top--active');
      }
    }
  };

  ScrollToTop.initialise();

})();