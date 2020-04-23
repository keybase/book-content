const startOffset = window.pageYOffset;
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const simplex = new SimplexNoise();
const rect = canvas.getBoundingClientRect();
const width = rect.width;
const height = rect.height;

// Set up canvas
Object.assign(canvas, { width, height });

const dotsX = 63;
const step = width / dotsX;
const dotsY = height / step;

const sentence = "is it you? ";
const sentence2 = "it is you";
// const sentenceArr = sentence2.split('');

const letterGeo = {
  i: [0, 1, 2, 3, 4, 7, 12, 17, 22, 25, 26, 27, 28, 29],
  s: [1, 2, 3, 4, 5, 11, 12, 13, 16, 17, 18, 24, 25, 26, 27, 28],
  t: [0, 1, 2, 3, 4, 7, 12, 17, 22, 27],
  y: [0, 4, 5, 9, 11, 13, 17, 22, 27],
  o: [1, 2, 3, 5, 9, 10, 14, 15, 19, 20, 24, 26, 27, 28],
  u: [0, 4, 5, 9, 10, 14, 15, 19, 20, 24, 26, 27, 28],
  "?": [1, 2, 3, 5, 9, 14, 18, 19, 22, 27],
  " ": []
};
const settings = {
  inactiveR: step * 0.05,
  innerRMin: step * 0.15,
  innerRMax: step * 0.2,
  outerRMin: step * 0.22,
  outerRMax: step * 0.30,
  activeRMin: step * 0.4,
  activeRMax: step * 0.5
};
const palette = {
  green: `#316F45E6`,
  blue: `#229FDDE6`,
  yellow: `#FCCD03E6`,
  magenta: `#F70B92E6`
};
const black = `#4E3F3C`;

const getRandomColor = palette => {
  return Object.values(palette)[Math.floor(Math.random() * Object.values(palette).length)];
};

const mapRange = (value, inputMin, inputMax, outputMin, outputMax, clamp) => {
  if (Math.abs(inputMin - inputMax) < Number.EPSILON) {
    return outputMin;
  } else {
    const outVal =
      ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;
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

const getLetterParticles = (data, [x1, y1, x2, y2]) => {
  const ret = [];
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      if (data[x + dotsX * y]) {
        ret.push(data[x + dotsX * y]);
      }
    }
  }
  return ret;
};

const normalize = x => (x + 1) / 2;

class Dot {
  constructor({ x, y, r, hasColor = false, isAnimated = false, isActive = false }) {
    Object.assign(this, { x, y, r, isAnimated, hasColor, isActive });
    this.color = black;
    if (hasColor) this.color = getRandomColor(palette);
  }
  updateRadius(t) {
    const { hasColor, isActive } = this;
    // this.r = simplex.noise2D(t, 0);
    let coords = [this.x, this.y];
    if (hasColor) coords = [this.y, this.x];
    const radiusRange = (hasColor, isActive) => {
      const radius = [settings.innerRMin, settings.innerRMax];
      if (hasColor) {
        radius[0] = settings.outerRMin;
        radius[1] = settings.outerRMax;
      }
      if (isActive) {
        radius[0] = settings.activeRMin;
        radius[1] = settings.activeRMax;
      }
      return radius;
    };
    const radius = radiusRange(hasColor, isActive);
    this.r = mapRange(simplex.noise3D(.5 * Math.sin(Math.PI * (t - .5)) + .5, ...coords), -1, 1, ...radius);
  }
  draw(context) {
    const { x, y, r, color } = this;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
  }
}
const innerGrid = [];
const outerGrid = [];

for (let y = 0; y < dotsY; y++) {
  for (let x = 0; x < dotsX; x++) {
    let animated = true;
    if (x == 0 || x % 7 == 0 || (x + 1) % 7 == 0) {
      animated = false;
    }
    outerGrid.push(
      new Dot({
        x: x * step,
        y: y * step,
        r: animated ? settings.outerRMin : settings.inactiveR,
        hasColor: true,
        isAnimated: animated
      })
    );
    innerGrid.push(
      new Dot({
        x: x * step,
        y: y * step,
        r: animated ? settings.innerRMin : settings.inactiveR,
        isAnimated: animated
      })
    );
  }
}

let i = 0;
let t = 0;

const letters = [];
const letterHeight = 6;
const spacer = 2;
for (let y = 0; y < 20; y += 1) {
  for (let x = 0; x < 9; x++) {
    letters.push([
      x * 7 + 1,
      y * (letterHeight + spacer) + spacer,
      x * 7 + 6,
      y * (letterHeight + spacer) + (letterHeight + spacer)
    ]);
  }
}

let canvases = {0: {}, 1: {}};

class App {
  constructor() {
    this.sentences = ["is it you? ", "it is you"];
    this.sentenceIn = 0;
    this.addListeners();
    this.animate();
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    if (window.pageYOffset > startOffset + rect.bottom + 300) {
      return;
    }

    let frame = (i) % 60;
    context.clearRect(0, 0, width, height);

    if (!canvases[this.sentenceIn][frame]) {
      canvases[this.sentenceIn][frame] = document.createElement('canvas'); 
      canvases[this.sentenceIn][frame].width = width;
      canvases[this.sentenceIn][frame].height = height;
      let localctx = canvases[this.sentenceIn][frame].getContext('2d')

      localctx.fillStyle = `#FFFFF8`;
      localctx.fillRect(0, 0, width, height);
      const sentenceArr = this.sentences[this.sentenceIn].split("");
      let sentenceSelector = 0;
      letters.forEach((letter, index) => {
        if (sentenceSelector >= sentenceArr.length) sentenceSelector = 0;
        const letterParticles = getLetterParticles(outerGrid, letter);

        const activeLetter = letterGeo[sentenceArr[sentenceSelector]];
        const activeParticles = letterParticles.filter((particle, index) => {
            return activeLetter.includes(index);
        });
        sentenceSelector += 1;
        activeParticles.forEach(particle => {
          particle.isActive = true;
        });
      });
      outerGrid.forEach(dot => {
        if (dot.isAnimated) dot.updateRadius(t);
        dot.draw(localctx);
      });

      innerGrid.forEach(dot => {
        if (dot.isAnimated) dot.updateRadius(t);
        dot.draw(localctx);
      });
    }

    context.drawImage(canvases[this.sentenceIn][frame], 0, 0);

    i++;
    t = i / 30;
  }

  clearGrid(grid) {
    grid.forEach(dot => {
      dot.isActive = false;
    });
  }

  addListeners() {
    document.addEventListener("scroll", e => {
      this.clearGrid(outerGrid);
      this.sentenceIn = window.pageYOffset <= 0 ? 0 : 1;
    });
  }
}

new App();
