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

const terminal = document.querySelector("[data-terminal]");

if (terminal) {
  const output = terminal.querySelector("[data-terminal-output]");
  const form = terminal.querySelector("[data-terminal-form]");
  const input = terminal.querySelector("[data-terminal-input]");
  const commandHistory = [];
  let historyIndex = 0;

  const commands = {
    "man sv": `
      <div class="terminal-block">
        <strong>Manual: sv</strong>
        <ul class="terminal-list">
          <li><strong>sv -s</strong> - display Sarthak's technical skill set</li>
          <li><strong>sv -j</strong> - display Sarthak's developer journey</li>
          <li><strong>sv -engval</strong> - display Sarthak's engineering values</li>
          <li><strong>sv -g</strong> - display Sarthak's GitHub profile</li>
          <li><strong>sv -l</strong> - display Sarthak's LinkedIn profile</li>
          <li><strong>sv -y</strong> - display Sarthak's YouTube channel</li>
          <li><strong>clear</strong> - clear the terminal output</li>
        </ul>
      </div>
    `,
    "sv -s": `
      <div class="terminal-block">
        <strong>Skill set</strong>
        <p>Languages & frameworks: Python, Go, Shell, Django, Flask, FastAPI, JavaScript.</p>
        <p>Cloud & containers: AWS, GCP, Docker, Kubernetes.</p>
        <p>Data & messaging: PostgreSQL, MySQL, MongoDB, Redis, Celery.</p>
        <p>Workflow & DevOps: Jenkins, Apache Airflow, Git, GitHub, GitLab, Linux.</p>
        <p>Observability: Prometheus, Grafana, Loki, Splunk, Datadog, Elasticsearch.</p>
        <p>AI & ML tooling: LLMs, Hugging Face, Ollama, LM Studio, scikit-learn, PyTorch, n8n.</p>
      </div>
    `,
    "sv -j": `
      <div class="terminal-block">
        <strong>Developer journey</strong>
        <p>01 / Enterprise Engineering - Built large-scale backend features and data-heavy services in complex environments.</p>
        <p>02 / Microservices & Cloud - Moved deeper into Docker, Kubernetes, CI/CD, and cloud infrastructure centered on uptime.</p>
        <p>03 / Backend & DevOps Leadership - Led architecture choices, mentorship, delivery practices, and observability standards.</p>
        <p>04 / AI-Driven Automation - Building LLM-powered tooling and workflow automation that accelerates engineering and operations.</p>
      </div>
    `,
    "sv -engval": `
      <div class="terminal-block">
        <strong>Engineering values</strong>
        <p>Reliability under pressure: systems should stay fast, resilient, and observable when production reality gets loud.</p>
        <p>Automation with purpose: pipelines and orchestration should reduce repetitive work without creating fragile complexity.</p>
        <p>Pragmatic team practices: clear standards, stronger reviews, and mentorship should compound across the team.</p>
      </div>
    `,
    "sv -g": `
      <div class="terminal-block">
        <strong>GitHub</strong>
        <p><a href="https://github.com/Sarthak-Vashisth" target="_blank" rel="noopener noreferrer">github.com/Sarthak-Vashisth</a></p>
      </div>
    `,
    "sv -l": `
      <div class="terminal-block">
        <strong>LinkedIn</strong>
        <p><a href="https://linkedin.com/in/vsarthak92" target="_blank" rel="noopener noreferrer">linkedin.com/in/vsarthak92</a></p>
      </div>
    `,
    "sv -y": `
      <div class="terminal-block">
        <strong>YouTube</strong>
        <p><a href="https://www.youtube.com/@Sarthak.Vashisth" target="_blank" rel="noopener noreferrer">youtube.com/@Sarthak.Vashisth</a></p>
      </div>
    `,
  };

  function appendLine(text, className = "terminal-line") {
    const line = document.createElement("p");
    line.className = className;
    line.textContent = text;
    output.appendChild(line);
  }

  function appendBlock(markup) {
    const block = document.createElement("div");
    block.innerHTML = markup.trim();
    output.appendChild(block.firstElementChild);
  }

  function scrollOutput() {
    output.scrollTop = output.scrollHeight;
  }

  function runCommand(rawCommand) {
    const command = rawCommand.trim().toLowerCase();

    if (!command) {
      return;
    }

    appendLine(`sarthak@portfolio:~$ ${rawCommand.trim()}`, "terminal-line terminal-line--command");

    if (command === "clear") {
      output.innerHTML = "";
      scrollOutput();
      return;
    }

    if (commands[command]) {
      appendBlock(commands[command]);
    } else {
      appendLine(`Command not found: ${rawCommand.trim()}. Type "man sv" to see available options.`, "terminal-line terminal-line--error");
    }

    scrollOutput();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = input.value.trim();

    if (command) {
      commandHistory.push(command);
      historyIndex = commandHistory.length;
    }

    runCommand(command);
    input.value = "";
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
      return;
    }

    if (!commandHistory.length) {
      return;
    }

    event.preventDefault();

    if (event.key === "ArrowUp") {
      historyIndex = Math.max(0, historyIndex - 1);
    } else {
      historyIndex = Math.min(commandHistory.length, historyIndex + 1);
    }

    input.value = commandHistory[historyIndex] || "";
    input.setSelectionRange(input.value.length, input.value.length);
  });

  terminal.addEventListener("click", () => input.focus());
}

const carousel = document.querySelector(".video-carousel");

if (carousel) {
  const track = carousel.querySelector(".carousel__track");
  const slides = Array.from(carousel.querySelectorAll(".video-slide"));
  const dotsWrap = carousel.querySelector(".carousel__dots");
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const videoIframes = Array.from(carousel.querySelectorAll("iframe"));
  let activeIndex = 0;
  let touchStartX = 0;
  let autoplayId;
  let isPointerInside = false;
  let hasFocusInside = false;
  let isVideoPlaying = false;
  let youtubePlayers = [];

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
    if (isPointerInside || hasFocusInside || isVideoPlaying) {
      return;
    }

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
    pauseAllVideos();
    setSlide(index);
    startAutoplay();
  }

  function pauseAllVideos() {
    youtubePlayers.forEach((player) => {
      if (typeof player.pauseVideo === "function") {
        player.pauseVideo();
      }
    });
  }

  function initYouTubePlayers() {
    if (!window.YT || !window.YT.Player || youtubePlayers.length) {
      return;
    }

    youtubePlayers = videoIframes.map(
      (iframe) =>
        new window.YT.Player(iframe, {
          events: {
            onStateChange(event) {
              if (event.data === window.YT.PlayerState.PLAYING) {
                isVideoPlaying = true;
                stopAutoplay();
                return;
              }

              if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                isVideoPlaying = youtubePlayers.some(
                  (player) =>
                    typeof player.getPlayerState === "function" &&
                    player.getPlayerState() === window.YT.PlayerState.PLAYING
                );
                startAutoplay();
              }
            },
          },
        })
    );
  }

  function loadYouTubeApi() {
    videoIframes.forEach((iframe) => {
      const iframeUrl = new URL(iframe.src);
      iframeUrl.searchParams.set("enablejsapi", "1");

      if (window.location.origin !== "null") {
        iframeUrl.searchParams.set("origin", window.location.origin);
      }

      iframe.src = iframeUrl.toString();
    });

    if (window.YT && window.YT.Player) {
      initYouTubePlayers();
      return;
    }

    const previousReadyHandler = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReadyHandler === "function") {
        previousReadyHandler();
      }

      initYouTubePlayers();
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
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

  carousel.addEventListener("mouseenter", () => {
    isPointerInside = true;
    stopAutoplay();
  });

  carousel.addEventListener("mouseleave", () => {
    isPointerInside = false;
    startAutoplay();
  });

  carousel.addEventListener("focusin", () => {
    hasFocusInside = true;
    stopAutoplay();
  });

  carousel.addEventListener("focusout", () => {
    hasFocusInside = false;
    startAutoplay();
  });

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
  loadYouTubeApi();
  startAutoplay();
}
