const revealItems = document.querySelectorAll("[data-reveal]");
const glow = document.querySelector(".cursor-glow");
const palette = document.querySelector(".command-palette");
const paletteSearch = document.querySelector("[data-palette-search]");
const paletteItems = Array.from(document.querySelectorAll("[data-palette-item]"));
const openPaletteButtons = document.querySelectorAll("[data-open-palette]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const projectCarousel = document.querySelector(".project-grid");
const projectScrollButtons = document.querySelectorAll("[data-scroll-projects]");
const storedTheme = localStorage.getItem("profile-theme");

if (storedTheme === "invert") {
  document.body.dataset.theme = "invert";
  themeToggle?.setAttribute("aria-pressed", "true");
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.transform = `translate(${event.clientX - 176}px, ${event.clientY - 176}px)`;
});

function openPalette() {
  if (!palette || palette.open) return;
  palette.showModal();
  paletteSearch.value = "";
  filterPalette("");
  requestAnimationFrame(() => paletteSearch.focus());
}

function closePalette() {
  if (palette?.open) palette.close();
}

function filterPalette(query) {
  const normalized = query.trim().toLowerCase();
  paletteItems.forEach((item) => {
    const text = item.textContent.toLowerCase();
    item.hidden = normalized.length > 0 && !text.includes(normalized);
  });
}

openPaletteButtons.forEach((button) => {
  button.addEventListener("click", openPalette);
});

themeToggle?.addEventListener("click", () => {
  const isInverted = document.body.dataset.theme === "invert";
  document.body.dataset.theme = isInverted ? "" : "invert";
  themeToggle.setAttribute("aria-pressed", String(!isInverted));

  if (isInverted) {
    localStorage.removeItem("profile-theme");
  } else {
    localStorage.setItem("profile-theme", "invert");
  }
});

projectScrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!projectCarousel) return;

    const direction = button.dataset.scrollProjects === "next" ? 1 : -1;
    const firstCard = projectCarousel.querySelector(".project-card");
    const step = firstCard ? firstCard.getBoundingClientRect().width + 16 : 360;
    projectCarousel.scrollBy({ left: direction * step, behavior: "smooth" });
  });
});

paletteSearch?.addEventListener("input", (event) => {
  filterPalette(event.target.value);
});

paletteItems.forEach((item) => {
  item.addEventListener("click", closePalette);
});

document.addEventListener("keydown", (event) => {
  const isModifierPressed = event.metaKey || event.ctrlKey;
  if (isModifierPressed && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openPalette();
  }

  if (event.key === "Escape") {
    closePalette();
  }
});

palette?.addEventListener("click", (event) => {
  const bounds = palette.querySelector(".palette-shell").getBoundingClientRect();
  const isOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (isOutside) closePalette();
});
