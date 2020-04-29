const startOffset = window.pageYOffset;
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
const mapPolylines = (
  polyline,
  polylineViewport1,
  polylineViewport2,
  canvas1,
  canvas2,
  outArr = null
) => {
  const results = [];
  polyline.forEach(point => {
    const mappedX = mapRange(
      point[0],
      polylineViewport1[0],
      polylineViewport2[0],
      canvas1[0],
      canvas2[0]
    );
    const mappedY = mapRange(
      point[1],
      polylineViewport1[1],
      polylineViewport2[1],
      canvas1[1],
      canvas2[1]
    );
    results.push([mappedX, mappedY]);
  });
  if (outArr) {
    outArr.push(results);
    return;
  } else {
    return results;
  }
};

// prettier-ignore
const polylines = {
  viewport: [[0,0],[789.1,1135.1]],
  h: [[289.600,498.000],[289.600,349.800],[169.000,349.800],[169.000,498.000],[79.700,498.000],[79.700,125.000],[169.000,125.000],[169.000,278.000],[289.400,278.000],[289.400,125.000],[379.000,125.000],[379.000,498.000]]  ,
  e: [[459.400,758.600],[459.400,370.400],[721.200,370.400],[721.200,445.600],[552.600,445.600],[552.600,527.800],[670.400,527.800],[670.400,588.400],[552.800,588.400],[552.800,680.400],[721.300,680.400],[721.300,758.600]],
  y: [[281.400,874.900],[281.400,1028.500],[188.800,1028.500],[188.800,874.900],[66.200,645.400],[165.200,645.400],[239.400,798.400],[310.100,645.400],[404.300,645.400]]
};
const config = {
  yellow: {
    color: `#E8DD10`,
    width: 4,
    followsMouse: true,
    frequency: 0.5,
    offset: [-10, 10]
  },
  cyan: {
    color: `#229FDD`,
    width: 2,
    followsMouse: false,
    frequency: 1,
    offset: [0, 5]
  },
  magenta: {
    color: `#F70B92`,
    width: 1,
    followsMouse: true,
    frequency: 1,
    offset: [0, 0]
  }
};

const canvas = document.querySelector("canvas");
const wrapper = document.querySelector("div.chapter-illustration-wrapper");
const context = canvas.getContext("2d");
context.globalCompositeOperation = "multiply";
const rect = canvas.getBoundingClientRect();
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
canvas.width = windowWidth / 2;
canvas.height = windowHeight;
context.globalCompositeOperation = "multiply";

wrapper.style["background-image"] = "url(" + url_for("img/illos/chat/background-min.jpg") + ")";
wrapper.style["background-size"] = "cover";

const canvasConstraints = [
  [0, 0],
  [canvas.width, canvas.height]
];

const hPts = mapPolylines(polylines.h, ...polylines.viewport, ...canvasConstraints);
const ePts = mapPolylines(polylines.e, ...polylines.viewport, ...canvasConstraints);
const yPts = mapPolylines(polylines.y, ...polylines.viewport, ...canvasConstraints);
const step = 10;

const ptsInside = [];

for (let y = 0; y < canvas.height; y += step) {
  for (let x = 0; x < canvas.width; x += step) {
    if (inside([x, y], hPts) || inside([x, y], ePts) || inside([x, y], yPts)) {
      ptsInside.push([x, y]);
    }
  }
}

const drawLine = (context, x, y, followsMouse) => {
  context.save();
  context.translate(x, y);
  let delta = [x - mouse.x, y - (mouse.y + window.pageYOffset)];
  if (!followsMouse) {
    delta = [y - (mouse.y + window.pageYOffset), x - mouse.x];
  }

  const rad = Math.atan2(...delta);
  context.rotate(rad);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(20, 0);
  context.stroke();

  context.restore();
};

const mouse = { x: 0, y: 0 };
let lastMouse = { x: null, y: null };
let lastOffset = 0;

let canvases = {};
let contexts = {};

let yellowCanvas = document.createElement('canvas');
let yellowContext = yellowCanvas.getContext('2d');
yellowCanvas.width = canvas.width;
yellowCanvas.height = canvas.height;
yellowContext.strokeStyle = config.yellow.color;
yellowContext.lineWidth = config.yellow.width;

canvases["yellow"] = yellowCanvas;
contexts["yellow"] = yellowContext;

let cyanCanvas = document.createElement('canvas');
let cyanContext = cyanCanvas.getContext('2d');
cyanCanvas.width = canvas.width;
cyanCanvas.height = canvas.height;
cyanContext.strokeStyle = config.cyan.color;
cyanContext.lineWidth = config.cyan.width;

canvases["cyan"] = cyanCanvas;
contexts["cyan"] = cyanContext;

let magentaCanvas = document.createElement('canvas');
let magentaContext = magentaCanvas.getContext('2d');
magentaCanvas.width = canvas.width;
magentaCanvas.height = canvas.height;
magentaContext.strokeStyle = config.magenta.color;
magentaContext.lineWidth = config.magenta.width;

canvases["magenta"] = magentaCanvas;
contexts["magenta"] = magentaContext;

const animate = () => {
  requestAnimationFrame(animate);

  if (window.pageYOffset > startOffset + rect.bottom + 300) {
    return;
  }

  if (mouse.x === lastMouse.x && mouse.y === lastMouse.y && window.pageYOffset === lastOffset) {
      return;
  }

  lastMouse = { ...mouse };
 
  context.clearRect(...canvasConstraints.flat());
  //context.globalCompositeOperation = "multiply";

  Object.keys(config).forEach(set => {
    contexts[set].clearRect(0, 0, canvases[set].width, canvases[set].height);
    ptsInside.forEach((point, pointIndex) => {
      const { frequency, color, width, offset, followsMouse } = config[set];
      if (!(pointIndex % (1 / frequency) === 0)) {
        return;
      }

      const offsetPoint = [point[0] + offset[0], point[1] + offset[1]];
      drawLine(contexts[set], ...offsetPoint, followsMouse);
    });

    context.drawImage(canvases[set], 0, 0, canvases[set].width, canvases[set].height);
  });


  lastOffset = window.pageYOffset;
};
animate();

document.addEventListener("mousemove", e => {
  gsap.to(mouse, 0.3, {
    ease: Power1.easeOut,
    x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
  });
});
