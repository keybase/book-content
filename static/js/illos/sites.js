const startOffset = window.pageYOffset;
const degToRad = n => (n * Math.PI) / 180;
const mapRange = (value, inputMin, inputMax, outputMin, outputMax, clamp) => {
  // Reference:
  // https://openframeworks.cc/documentation/math/ofMath/\
  const { EPSILON } = Number;
  if (Math.abs(inputMin - inputMax) < EPSILON) {
    return outputMin;
  } else {
    var outVal = ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;
    if (clamp) {
      if (outputMax < outputMin) {
        if (outVal < outputMax) outVal = outputMax;
        else if (outVal > outputMin) outVal = outputMin;
      } else {
        if (outVal > outputMax) outVal = outputMax;
        else if (outVal < outputMin) outVal = outputMin;
      }
    }
    return outVal;
  }
};
const inside = (point, vs) => {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  const x = point[0];

  const y = point[1];

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0];
    const yi = vs[i][1];
    const xj = vs[j][0];
    const yj = vs[j][1];

    const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

const canvas = document.querySelector("canvas");
const rect = canvas.getBoundingClientRect();
const context = canvas.getContext("2d");
const mouse = { x: 0, y: 0 };
const mouseSlow = { x: 0, y: 0 };
let lastMouse = { x: null, y: null};
let lastMouseSlow = { x: null, y: null};
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 2;

const backgroundImg = new Image();
backgroundImg.src = url_for("img/illos/sites/background.png");

const config = {
  yellow: {
    color: `#E8DD10`
  },
  cyan: {
    color: `#229FDD`
  },
  magenta: {
    color: `#F70B92`
  }
};
const pathData = [
  [236, 1],
  [262, 1],
  [496, 380],
  [366, 380],
  [249, 187],
  [131, 380],
  [2, 380],
  [236, 1],
  [2, 452],
  [131, 452],
  [249, 645],
  [366, 452],
  [496, 452],
  [261, 831],
  [235, 831],
  [2, 452]
];
const mappedPathData = pathData.map(point => {
  return [
    mapRange(point[0], 0, 498, 0, canvas.width),
    mapRange(point[1], 0, 832, 0, canvas.height)
  ];
});

const diameter = canvas.width / 18;
const radius = diameter / 2;

class Circle {
  constructor({
    x,
    y,
    directionInDegrees,
    angleInDegrees,
    radius,
    isInverted = false,
    isStatic = false
  }) {
    Object.assign(this, {
      x,
      y,
      directionInDegrees,
      angleInDegrees,
      radius,
      isInverted,
      isStatic
    });
    this.directionInRadians = degToRad(this.directionInDegrees);
    this.angleInRadians = degToRad(this.angleInDegrees);
    this.isActive = inside([x, y], mappedPathData);
  }
  draw(context) {
    const {
      x,
      y,
      radius,
      isActive,
      directionInRadians,
      angleInRadians,
      isInverted,
      isStatic
    } = this;
    let delta = [x, y];
    let rad = directionInRadians;
    if (isStatic) {
    } else if (isActive) {
      delta = [y - mouse.y, x - mouse.x];
      rad = Math.atan2(...delta);
    } else if (isInverted) {
      delta = [x - mouseSlow.x, y - mouseSlow.y];
      rad = Math.atan2(...delta);
    } else {
      delta = [y - mouseSlow.y, x - mouseSlow.x];
      rad = Math.atan2(...delta);
    }
    context.beginPath();
    context.moveTo(x, y);
    context.arc(x, y, isActive ? radius : radius * 0.85, rad, angleInRadians + rad);
    context.lineTo(x, y);
    context.fill();
  }
}

const circles = {
  yellow: [],
  cyan: [],
  magenta: []
};
for (let y = radius; y < canvas.height; y += diameter) {
  for (let x = radius; x < canvas.width; x += diameter) {
    circles.yellow.push(
      new Circle({
        x,
        y,
        directionInDegrees: -90,
        angleInDegrees: 180,
        radius,
        isStatic: true
      })
    );
    circles.cyan.push(
      new Circle({
        x: x + 5,
        y: y + 5,
        directionInDegrees: 0,
        angleInDegrees: 230,
        radius,
        isInverted: true
      })
    );
    circles.magenta.push(
      new Circle({
        x: x + 10,
        y: y + 5,
        directionInDegrees: 30,
        angleInDegrees: 230,
        radius
      })
    );
  }
}

let yellowCanvas;

let magentaCanvas = document.createElement('canvas');
magentaCanvas.width = canvas.width;
magentaCanvas.height = canvas.height;
let magentaContext = magentaCanvas.getContext("2d");

let cyanCanvas = document.createElement('canvas');
cyanCanvas.width = canvas.width;
cyanCanvas.height = canvas.height;
let cyanContext = cyanCanvas.getContext("2d");


const animate = () => {
  requestAnimationFrame(animate);

  if (window.pageYOffset > startOffset + rect.bottom + 300) {
    return;
  }

  if (
    (mouse.x === lastMouse.x && mouse.y === lastMouse.y) &&
    (mouseSlow.x === lastMouseSlow.x && mouseSlow.y === lastMouseSlow.y)
  ) {
      return;
  }

  lastMouse = { ...mouse };
  lastMouseSlow = { ...mouseSlow };

  context.globalCompositeOperation = "source-over";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "multiply";

  if (!yellowCanvas) {
    yellowCanvas = document.createElement('canvas');
    yellowCanvas.width = canvas.width;
    yellowCanvas.height = canvas.height;
    let yellowContext = yellowCanvas.getContext("2d");
    yellowContext.fillStyle = config.yellow.color;
    circles.yellow.forEach(circle => circle.draw(yellowContext));
  }

  context.drawImage(yellowCanvas, 0, 0, canvas.width, canvas.height);

  cyanContext.clearRect(0, 0, cyanCanvas.width, cyanCanvas.height);
  cyanContext.fillStyle = config.cyan.color;
  circles.cyan.forEach(circle => circle.draw(cyanContext));
  context.drawImage(cyanCanvas, 0, 0, canvas.width, canvas.height);

  magentaContext.clearRect(0, 0, magentaCanvas.width, magentaCanvas.height);
  magentaContext.fillStyle = config.magenta.color;
  circles.magenta.forEach(circle => circle.draw(magentaContext));
  context.drawImage(magentaCanvas, 0, 0, canvas.width, canvas.height);
};
animate();

document.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();

  gsap.to(mouse, 0.5, {
    ease: Power1.easeOut,
    x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
  });
  gsap.to(mouseSlow, 0.5, {
    ease: Power1.easeIn,
    x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
  });
});