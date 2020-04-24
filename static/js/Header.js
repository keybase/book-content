// export default class Header {
//   constructor() {
//     this.classes = {
//       default: `section-header`,
//       collapsed: `section-header--collapsed`,
//       progress: `section-header__progress`
//     };
//     this.el = document.querySelector(`.${this.classes.default}`);
//     this.elHeight = this.el.offsetHeight;
//     this.progressBar = this.el.querySelector(`.${this.classes.progress}`);
//     this.addListeners();
//   }
//   handleScroll() {
//     const { el, elHeight, classes, progressBar } = this;
//     const html = document.documentElement;
//     const { body } = document;
//     const scrolled =
//       ((html.scrollTop || body.scrollTop) /
//         ((html.scrollHeight || body.scrollHeight) - html.clientHeight)) *
//       100;
//     progressBar.style.setProperty("--percentageScrolled", `${scrolled}%`);
//     const padding = 5 * 16; // 5rem
//     if (window.pageYOffset >= elHeight - padding) {
//       el.classList.add(classes.collapsed);
//     } else {
//       el.classList.remove(classes.collapsed);
//     }
//   }
//   addListeners() {
//     window.addEventListener("scroll", this.handleScroll.bind(this));
//   }
// }

// new Header();
