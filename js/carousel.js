class Carousel {
  constructor(object) {
    const settings = {
      ...{
        containerId: "#carousel",
        sliderId: ".slide",
        interval: 5000,
        isPlaying: true,
      },
      ...object,
    };

    this.container = document.querySelector(settings.containerId);
    this.slides = this.container.querySelectorAll(settings.sliderId);
    this.interval = settings.interval;
    this.isPlaying = settings.isPlaying;
  }
  _initProps() {
    this.CODE_LEFT_ARROW = "ArrowLeft";
    this.CODE_RIGHT_ARROW = "ArrowRight";
    this.CODE_SPACE_ARROW = "Space";

    this.currentSlide = 0;
    this.SLIDES_LENGTH = this.slides.length;

    this.FA_PAUSE = '<i class="fas fa-pause-circle"></i>';
    this.FA_PLAY = '<i class="fas fa-play-circle"></i>';
    this.FA_PREV = '<i class="fas fa-angle-left"></i>';
    this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
  }

  ititControls() {
    const controls = document.createElement("div");
    const PAUSE = `<span class="control control-pause" id="pause">
      <span id='fa-pause-icon'>${this.FA_PAUSE}</span>
      <span id='fa-play-icon'>${this.FA_PLAY}</span>
    </span>`;
    const PREV = `<span class="control control-prev" id="prev">${this.FA_PREV}</span>`;
    const NEXT = `<span class="control control-next" id="next">${this.FA_NEXT}</span>`;

    controls.setAttribute("class", "controls");

    controls.innerHTML = PAUSE + PREV + NEXT;

    this.container.append(controls);

    this.btnPrev = document.querySelector("#prev");
    this.btnPause = document.querySelector("#pause");
    this.btnNext = document.querySelector("#next");


    this.pauseIcon = this.container.querySelector('#fa-pause-icon')
    this.playIcon = this.container.querySelector('#fa-play-icon')

    this.isPlaying ? this.pauseVisible() : this.playVisible
  }
  pauseVisible(isVisible = true) {
    this.pauseIcon.style.opacity = isVisible ?  1 :  0
    this.playIcon.style.opacity = !isVisible ?  1 :  0
  }
  playVisible() {
    this.pauseVisible(false)
  }

  ititIndicators() {
    const indicators = document.createElement("div");
    indicators.setAttribute("class", "indicators");
    for (let i = 0, n = this.SLIDES_LENGTH; i < n; i++) {
      const indicator = document.createElement("div");
      indicator.setAttribute(
        "class",
        i !== 0 ? "indicator" : "indicator active"
      );
      indicator.dataset.slideTo = `${i}`;
      indicators.append(indicator);
    }
    this.container.append(indicators);

    this.indicatorContainer = this.container.querySelector(".indicators");
    this.indicators = document.querySelectorAll(".indicator");
    this.container.addEventListener("mouseenter", this.pause.bind(this));
    this.container.addEventListener("mouseleave", this.play.bind(this));
  }

  _tick(flag = true) {
    if (!flag) return;
    this.timerId = setInterval(() => this.nextSlide(), this.interval);
  }
  _pressKey(e) {
    if (e.code === this.CODE_LEFT_ARROW) this.prev();
    if (e.code === this.CODE_RIGHT_ARROW) this.next();
    if (e.code === this.CODE_SPACE_ARROW) this.pauseSlideShow();
  }

  initListeners() {
    this.btnPause.addEventListener("click", this.pause.bind(this));
    this.btnPrev.addEventListener("click", this.prev.bind(this));
    this.btnNext.addEventListener("click", this.next.bind(this));
    document.addEventListener("keydown", this._pressKey.bind(this));

    this.indicatorContainer.addEventListener("click", this.indicate.bind(this));
  }

  _gotoNth(n) {
    this.slides[this.currentSlide].classList.toggle("active");
    this.indicators[this.currentSlide].classList.toggle("active");
    this.currentSlide = (n + this.SLIDES_LENGTH) % this.SLIDES_LENGTH;
    this.slides[this.currentSlide].classList.toggle("active");
    this.indicators[this.currentSlide].classList.toggle("active");
  }

  prevSlide() {
    this._gotoNth(this.currentSlide - 1);
  }
  nextSlide() {
    this._gotoNth(this.currentSlide + 1);
  }
  pauseSlideShow() {
    clearInterval(this.timerId);
    this.isPlaying = false;
    this.btnPause.innerHTML = this.FA_PLAY;
  }
  play() {
    this.isPlaying = true;
    this.playVisible()
    this._tick();
  }

  pause() {
    clearInterval(this.timerId)
    this.isPlaying = false
    this.pauseVisible()
  }

  next() {
    this.nextSlide();
    this.pauseSlideShow();
  }

  prev() {
    this.prevSlide();
    this.pauseSlideShow();
  }
  indicate(e) {
    const target = e.target;

    if (target && target.classList.contains("indicator")) {
      this._gotoNth(+target.dataset.slideTo);
      this.pauseSlideShow();
    }
  }

  init() {
    this._initProps();
    this.ititControls();
    this.ititIndicators();
    this.initListeners();
    this._tick(this.isPlaying);
  }
}

export default Carousel;
