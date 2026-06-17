const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const carousel = document.querySelector(".video-carousel");

if (carousel) {
  const track = carousel.querySelector(".carousel__track");
  const slides = Array.from(carousel.querySelectorAll(".video-slide"));
  const dotsWrap = carousel.querySelector(".carousel__dots");
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  let activeIndex = 0;
  let touchStartX = 0;
  let autoplayId;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show video ${index + 1}`);
    dot.addEventListener("click", () => moveSlide(index));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function setSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = window.setInterval(() => setSlide(activeIndex + 1), 5000);
  }

  function stopAutoplay() {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = undefined;
    }
  }

  function moveSlide(index) {
    setSlide(index);
    startAutoplay();
  }

  prevButton.addEventListener("click", () => moveSlide(activeIndex - 1));
  nextButton.addEventListener("click", () => moveSlide(activeIndex + 1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      moveSlide(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      moveSlide(activeIndex + 1);
    }
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  carousel.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const distance = touchEndX - touchStartX;

      if (Math.abs(distance) > 45) {
        moveSlide(activeIndex + (distance < 0 ? 1 : -1));
      }
    },
    { passive: true }
  );

  setSlide(0);
  startAutoplay();
}
