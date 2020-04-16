const startOffset = window.pageYOffset;
let lastOffset = null;

class App {
  constructor() {
    // canvas setup
    this.canvas = document.querySelector("canvas");
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.context = this.canvas.getContext("2d");
    this.rect = this.canvas.getBoundingClientRect();

    // images setup
    this.images = {
      top: new Image(),
      bottom: new Image(),
    };
    this.imageCounter = 0;
    this.imageTotal = Object.values(this.images).length;
    this.images.top.onload = this.imageLoad.bind(this);
    this.images.bottom.onload = this.imageLoad.bind(this);
    this.images.top.src = url_for("img/illos/files/top.png");
    this.images.bottom.src = url_for("img/illos/files/bottom.png");

    this.imageOffset = 0;
  }

  init() {
    const { context } = this;
    context.globalAlpha = 0.9;
    context.globalCompositeOperation = "multiply";
    this.addListeners();

    this.animate();
  }
  imageLoad() {
    this.imageCounter += 1;
    if (this.imageCounter < this.imageTotal) return;
    this.init();
  }
  animate() {
    const { context } = this;
    requestAnimationFrame(this.animate.bind(this));

    /* Skip if scrolled below the canvas */
    if (window.pageYOffset > startOffset + this.rect.bottom + 300) {
      return;
    }

    /* Skip if no input */
    if (lastOffset === window.pageYOffset) {
      return;
    }

    lastOffset = window.pageYOffset;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.drawImage(
      this.images.top,
      0,
      this.imageOffset,
      this.canvas.width,
      this.canvas.height / 2
    );
    context.drawImage(
      this.images.bottom,
      0,
      this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height / 2
    );
  }
  handleScrollMove(e) {
    this.imageOffset = window.pageYOffset;

    if (this.imageOffset >= this.canvas.height / 2) {
        this.imageOffset = this.canvas.height / 2;
    }
  }

  addListeners() {
    document.addEventListener("scroll", this.handleScrollMove.bind(this));
  }
}

let app = new App();
