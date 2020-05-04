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

class SideNav {
  constructor() {
    this.className = 'chapter-nav__link'
    this.activeClassName = `${this.className}--active`
    this.navItems = [...document.querySelectorAll('.chapter-nav__list-item--current a')];
    const anchors = this.navItems.filter(item => !!item.hash).map(item => item.hash);
    if (anchors.length) {
      this.sections = [...document.querySelectorAll(anchors.map(a => `.compose-anchor[href="${a}"]`).join(','))];
      this.addListeners();
    }
  }
  updateActiveNavItem() {
    let currentActive
    const footer = document.querySelector('.footer')
    // select last item if footer is in view
    if (footer.getBoundingClientRect().top <= window.innerHeight) {
      currentActive = this.sections[this.sections.length - 1]
    // otherwise find the most recently scrolled past section
    } else {
      const offset = 50
      this.sections.forEach(section => {if (section.getBoundingClientRect().top <= offset) currentActive = section})      
    }
    // clear active
    document.querySelector(`.${this.className}.${this.activeClassName}`)?.classList.remove(this.activeClassName)
    // set active
    if (currentActive) {
      document.querySelector(`.${this.className}[href="${currentActive.hash}"]`).classList.add(this.activeClassName)
    // or set the chapter to active
    } else {
      document.querySelector('.chapter-nav__list-item--current > a')?.classList.add(this.activeClassName)
    }
  }
  addListeners() {
    document.addEventListener("scroll", debounce(this.updateActiveNavItem.bind(this), 10));
  }
}
const sidenav = new SideNav();
