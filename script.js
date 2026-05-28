const root = document.documentElement;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const siteConfig = window.APLUS_SITE_CONFIG || {};

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setHeaderState() {
  header?.classList.toggle("scrolled", window.scrollY > 24);
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("aplus-theme", theme);

  const icon = themeToggle?.querySelector("[data-lucide]");
  if (icon) {
    icon.setAttribute("data-lucide", theme === "dark" ? "moon" : "sun-medium");
  }

  refreshIcons();
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  nav?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");

  const icon = menuToggle?.querySelector("[data-lucide]");
  if (icon) {
    icon.setAttribute("data-lucide", "menu");
    refreshIcons();
  }
}

function applySiteConfig() {
  const contacts = siteConfig.contacts || {};

  document.querySelectorAll("[data-config-contact]").forEach((element) => {
    const config = contacts[element.dataset.configContact];
    if (!config) return;

    const label = element.querySelector("[data-config-label]");
    if (label && config.label) {
      label.textContent = config.label;
    }

    if (config.href) {
      element.setAttribute("href", config.href);
    }
  });

  const socials = siteConfig.socials || {};

  document.querySelectorAll("[data-social-link]").forEach((element) => {
    const config = socials[element.dataset.socialLink];
    const href = config?.href?.trim();

    if (config?.label) {
      element.setAttribute("aria-label", href ? config.label : `${config.label} link coming soon`);
    }

    if (href) {
      element.setAttribute("href", href);
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noreferrer");
      element.classList.remove("pending-social");
      element.removeAttribute("aria-disabled");
      element.removeAttribute("tabindex");
      return;
    }

    element.removeAttribute("href");
    element.removeAttribute("target");
    element.removeAttribute("rel");
    element.classList.add("pending-social");
    element.setAttribute("aria-disabled", "true");
    element.setAttribute("tabindex", "-1");
  });
}

function toggleMenu() {
  const isOpen = !nav?.classList.contains("open");
  document.body.classList.toggle("menu-open", isOpen);
  nav?.classList.toggle("open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));

  const icon = menuToggle?.querySelector("[data-lucide]");
  if (icon) {
    icon.setAttribute("data-lucide", isOpen ? "x" : "menu");
    refreshIcons();
  }
}

function filterProjects(selected) {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === selected);
  });

  projectCards.forEach((card) => {
    const shouldShow = selected === "all" || card.dataset.category === selected;
    card.hidden = !shouldShow;
  });
}

function initTheme() {
  const storedTheme = localStorage.getItem("aplus-theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  setTheme(storedTheme || preferredTheme);
}

menuToggle?.setAttribute("aria-expanded", "false");
menuToggle?.addEventListener("click", toggleMenu);

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

themeToggle?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterProjects(button.dataset.filter));
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const project = String(formData.get("project") || "Project").trim();
  const message = String(formData.get("message") || "").trim();
  const recipient = siteConfig.contacts?.email?.label || "wedesignforyou3@gmail.com";
  const subject = `${name || "New enquiry"} - ${project}`;
  const body = [
    `Name: ${name || "Not provided"}`,
    `Email: ${email || "Not provided"}`,
    `Project type: ${project}`,
    "",
    "Message:",
    message || "Not provided",
  ].join("\n");

  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formStatus.textContent = `Opening email to send your ${project.toLowerCase()} enquiry.`;
});

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

applySiteConfig();
initTheme();
setHeaderState();
refreshIcons();
