const debounce = (fn, time) => {
  let timeoutId;
  const wrapper = (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, time);
  };
  return wrapper;
};

export default class Scroller {
  constructor() {
    this.isNestedNav = document.querySelector(".side-nav--extended");
    let navLink = `chapter-nav__link`;
    if (this.isNestedNav) navLink = `chapter-nav__nested-link`;
    this.classes = {
      navEl: "site-nav",
      navElScrolled: "site-nav--scrolled",
      breadcrumbsContainer: "site-nav__crumbs",
      breadcrumbsSubheader: "site-nav__crumbs-subheader",
      chapterHeader: "chapter-header",
      headersNav: "chapter-nav--start",
      chapterNavLink: navLink,
      chapterNavLinkActive: `${navLink}--active`,
    };
    this.els = {
      navEl: document.querySelector(`.${this.classes.navEl}`),
      breadcrumbsContainer: document.querySelector(`.${this.classes.breadcrumbsContainer}`),
      chapterHeader: document.querySelector(`.${this.classes.chapterHeader}`),
      headersNav: document.querySelector(`.${this.classes.headersNav}`),
    };
    this.sizes = {
      window: { width: null, height: null },
      chapterHeader: null,
    };
    this.crumbs = {
      chapterTitle: {
        active: false,
        text: this.els.chapterHeader.dataset.chapterTitle,
      },
      sectionTitle: {
        active: false,
        text: this.els.chapterHeader.dataset.sectionTitle,
      },
      currentHeader: {
        active: false,
        text: null,
      },
    };
    this.headers = [...document.querySelectorAll("h2")];
    this.sidenavLinks = [
      ...this.els.headersNav.querySelectorAll(`.${this.classes.chapterNavLink}`),
    ];
    this.subheader = null;
    this.addListeners();
    this.onResize();
  }
  onResize() {
    const { sizes, els } = this;
    sizes.window.width = window.innerWidth;
    sizes.window.height = window.innerHeight;
    sizes.chapterHeader = els.chapterHeader.offsetHeight;
  }
  onScroll() {
    const { navEl } = this.els;
    const { navElScrolled } = this.classes;
    const distanceScrolled = window.scrollY + navEl.offsetHeight;
    if (distanceScrolled > this.els.chapterHeader.offsetHeight) {
      navEl.classList.add(navElScrolled);
      this.crumbs.chapterTitle.active = true;
    } else {
      navEl.classList.remove(navElScrolled);
      this.crumbs.chapterTitle.active = false;
    }
    this.setCrumbs();
    this.activateHash();
  }
  setCrumbs() {
    const { crumbs, classes, els, headers } = this;
    const crumbsAreActive = Object.values(crumbs).some((val) => val.active);
    let chapterTitle = crumbs.chapterTitle.text;
    let sectionTitle = crumbs.sectionTitle.text;
    let subheaderActive = window.scrollY + els.navEl.offsetHeight >= headers[0].offsetTop;
    this.subheader = headers.find(
      (header, index) =>
        (window.scrollY + els.navEl.offsetHeight >= header.offsetTop &&
          index + 1 >= headers.length) ||
        (window.scrollY + els.navEl.offsetHeight >= header.offsetTop &&
          window.scrollY + els.navEl.offsetHeight < headers[index + 1].offsetTop)
    );
    const subheaderHash = this.subheader
      ? this.subheader.querySelector(".compose-anchor").href
      : "";
    const subheaderClone = this.subheader ? this.subheader.cloneNode(true) : "";
    subheaderClone
      ? subheaderClone.removeChild(subheaderClone.querySelector(".compose-anchor"))
      : "";
    let subheaderText = this.subheader ? subheaderClone.innerHTML : "";
    let breadcrumb = ``;
    if (crumbsAreActive) {
      const chapterTitleFrag = `<a href="#">${chapterTitle}</a>`;
      const sectionTitleFrag = sectionTitle ? `<a href="#"> ${sectionTitle}</a>` : ``;
      const subheaderFrag = subheaderActive
        ? `<a href="${subheaderHash}">${subheaderText}</a>`
        : ``;
      breadcrumb = `
      ${chapterTitleFrag}${sectionTitle ? ":" : ""}${sectionTitleFrag}${
        subheaderActive ? ": " : ""
      }${subheaderFrag}
      `;
    }
    els.breadcrumbsContainer.innerHTML = breadcrumb;
  }
  onProgress() {
    const percentageScrolled =
      (window.scrollY + window.innerHeight) / document.documentElement.offsetHeight;
    document.documentElement.style.setProperty("--scrollProgress", `${percentageScrolled}`);
  }
  activateHash() {
    let activeSidenavLink;
    if (this.subheader) {
      const activeSubheaderName = this.subheader.querySelector("a").name;

      activeSidenavLink = this.sidenavLinks.find((link) => link.hash == `#${activeSubheaderName}`);
    }
    this.sidenavLinks.forEach((link) => {
      link.classList.remove(this.classes.chapterNavLinkActive);
    });
    if (activeSidenavLink) {
      activeSidenavLink.classList.add(this.classes.chapterNavLinkActive);
    } else {
      this.sidenavLinks[0].classList.add(this.classes.chapterNavLinkActive);
    }
  }
  addListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
    document.addEventListener("scroll", debounce(this.onScroll.bind(this), 10));
    document.addEventListener("scroll", this.onProgress);
  }
}

const scroller = new Scroller();
