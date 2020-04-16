const illos = document.querySelector(".chapter-illustration-wrapper");
const mouse = {
  x: 0,
  y: 0
};
const updateAnimation = () => {
  illos.style.setProperty("--deltaX", mouse.x);
  illos.style.setProperty("--deltaY", mouse.y);
};
const handleMouseMove = e => {
  gsap.to(mouse, 0.5, {
    x: e.clientX / window.innerWidth,
    y: (e.clientY / window.innerHeight) * -1
  });

  gsap.ticker.add(updateAnimation);
};

document.addEventListener("mousemove", handleMouseMove);
