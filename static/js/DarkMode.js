export default class DarkMode {
  constructor() {
    this.classes = {
      toggle: `site-nav__theme-toggle`
    };
    this.toggle = document.querySelector(`.${this.classes.toggle}`);

    this.preference = window.localStorage.getItem("isDarkMode");
    this.preference = JSON.parse(this.preference);
    if (this.preference === null) this.mount();

    this.handleMode();
    this.addListeners();
  }
  mount() {
    this.preference = false;
    window.localStorage.setItem("isDarkMode", this.preference);
  }
  handleMode() {
    window.localStorage.setItem("isDarkMode", this.preference);
    if (this.preference == true) {
      document.documentElement.setAttribute("dark", true);
    } else {
      document.documentElement.removeAttribute("dark");
    }
  }
  handleClick() {
    this.preference = !this.preference;
    this.handleMode();
  }
  addListeners() {
    this.toggle.addEventListener("click", this.handleClick.bind(this));
  }
}

new DarkMode();
