var Homepage = (function () {
  var SWIPER_SELECTOR = '.js-homepage-swiper';

  return {
    initialise: function () {
      this.swiperEl = document.querySelector(SWIPER_SELECTOR);

      this.swiperInstance = new Swiper(SWIPER_SELECTOR, {
        loop: true,
        allowTouchMove: false,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        }
      });
    }
  };
})();

Homepage.initialise();
