const observers = [];

const applyTheme = (theme) => {
  if (!theme) return;
  document.documentElement.setAttribute('data-theme', theme);
};

const storedTheme = localStorage.getItem('corporeal-theme');
if (storedTheme) {
  applyTheme(storedTheme);
} else if (window.matchMedia) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const metricItems = document.querySelectorAll('.metric');
const metricObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      if (!target.hasAttribute('data-count')) {
        observer.unobserve(target);
        return;
      }
      const value = Number(target.dataset.count || 0);
      const output = target.querySelector('.metric-value');
      let current = 0;
      const step = Math.max(1, Math.floor(value / 30));
      const tick = () => {
        current += step;
        if (current >= value) {
          output.textContent = value.toString();
          observer.unobserve(target);
          return;
        }
        output.textContent = current.toString();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.6 }
);

metricItems.forEach((item) => metricObserver.observe(item));

observers.push(revealObserver, metricObserver);

const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
  const label = themeToggle.querySelector('.theme-label');
  const updateLabel = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    label.textContent = isDark ? 'Light' : 'Dark';
  };

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('corporeal-theme', nextTheme);
    updateLabel();
  });

  updateLabel();
}

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}
