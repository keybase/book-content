const startOffset = window.pageYOffset;
let lastOffset = null;
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 2;
const rect = canvas.getBoundingClientRect();

const loaded_imgs = [];

const draw = () => {
  requestAnimationFrame(draw);

  /* Images not ready */
  if (loaded_imgs.length < 2) {
    return;
  }

  /* Canvas is out of frame */
  if (window.pageYOffset > startOffset + rect.bottom + 300) {
    return;
  }

  /* No input */
  if (window.pageYOffset === lastOffset) {
    return;
  }

  lastOffset = window.pageYOffset;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    lettersImg,
    0,
    0,
    canvas.width,
    canvas.height
  );


  context.save();
  context.globalAlpha = 0.9;
  context.translate(
    0,
    mouse.y / 5 - canvas.height / 2
  );
  context.drawImage(viewerImg, 0, 0, canvas.width, canvas.height * 2);
  context.restore();
};

const lettersImg = new Image();
lettersImg.src = "/static/img/illos/teams/background.png";
let lettersImgAspectRatio;
lettersImg.onload = function() {
  lettersImgAspectRatio = this.naturalHeight / this.naturalWidth;
  loaded_imgs.push('background');
  if (loaded_imgs.length >= 2) {
    requestAnimationFrame(draw);
  }
};

const viewerImg = new Image();
viewerImg.src = "/static/img/illos/teams/viewer.png";
let mouse = { x: 0, y: 0 };
let viewerImgAspectRatio;
viewerImg.onload = function() {
  viewerImgAspectRatio = this.naturalHeight / this.naturalWidth;
  loaded_imgs.push('viewer');
  if (loaded_imgs.length >= 2) {
    requestAnimationFrame(draw);
  }
};

document.addEventListener("scroll", e => {
  gsap.to(mouse, 0.5, {
    ease: Power1.easeOut,
    x: 0,
    y: window.pageYOffset
  });
});
