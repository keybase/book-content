const startOffset = window.pageYOffset;
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 2;
const rect = canvas.getBoundingClientRect();

let loaded_images = [];

const arrowsImg = new Image();
arrowsImg.src = "/static/img/illos/wallet/background.png";
arrowsImg.onload = function() {
  loaded_images.push("bg");
  if (loaded_images.length >= 2) {
      draw();
  }
};

const viewerImg = new Image();
viewerImg.src = "/static/img/illos/wallet/scanner.png";
let mouse = { 
  x: ( window.pageYOffset / (canvas.height / 2)) * canvas.width * 2.5 - canvas.width / 2,
  y: .5 * canvas.height
};
viewerImg.onload = function() {
  loaded_images.push("viewer");
  if (loaded_images.length >= 2) {
      draw();
  }
};

let lastMouse = {
  x: null,
  y: 0
};

const draw = () => {
  requestAnimationFrame(draw);

  /* Images not ready */
  if (loaded_images.length < 2) {
    return;
  }

  /* Canvas not in viewport */
  if (window.pageYOffset > startOffset + rect.bottom + 300) {
    return;
  }

  /* No input */
  if (mouse.x === lastMouse.x && mouse.y === lastMouse.y) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.drawImage(
    arrowsImg,
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.save();
  context.globalAlpha = 0.9;
  context.translate(
    mouse.x / 20 - canvas.width / 2,
    0
  );
  context.drawImage(viewerImg, 0, 0, canvas.width * 2, canvas.height);
  context.restore();

  lastMouse = { ...mouse };
};

//draw();

document.addEventListener("scroll", e => {
  gsap.to(mouse, 0.1, {
    ease: Power1.easeOut,
    x: window.pageYOffset,
    y: 0
  });
});
