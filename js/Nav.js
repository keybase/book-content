class SideNav {
  constructor() {
    this.nav = document.querySelector(".side-nav");
    this.chapterNavStart = this.nav.querySelector(".chapter-nav--start");
    this.chapterNavEnd = this.nav.querySelector(".chapter-nav--end");

    this.addListeners();
  }
  handleLoaded() {
    this.nav.style.setProperty("--sizing--chapter-nav-end", `${this.chapterNavEnd.offsetHeight}px`);
    this.nav.style.setProperty(
      "--sizing--chapter-nav-start",
      `${this.chapterNavStart.offsetHeight}px`
    );
  }
  addListeners() {
    if (this.chapterNavEnd) {
      document.addEventListener("DOMContentLoaded", this.handleLoaded.bind(this));
      window.addEventListener("resize", this.handleLoaded.bind(this));
    }
  }
}
const sidenav = new SideNav();
