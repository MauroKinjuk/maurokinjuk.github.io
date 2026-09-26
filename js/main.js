// ======= TEMA DARK/LIGHT =======
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ======= MENU HAMBURGUESA =======
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Contacto es la ultima seccion: si es mas alta que el viewport, el ancla
// comun deja el formulario cortado abajo. Alinear el form al borde inferior.
const contactForm = document.getElementById('contact-form');

document.querySelectorAll('a[href="#contacto"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    contactForm.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });
});

// ======= HEADER CON SOMBRA AL SCROLL =======
const header = document.getElementById('header');
const scrollIndicator = document.getElementById('scroll-indicator');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
  scrollIndicator.classList.toggle('hidden', window.scrollY > 80);
});

// ======= SCROLL SPY (seccion activa en el menu y nav lateral) =======
const sections = document.querySelectorAll('main .section[id]');
const navLinks = document.querySelectorAll('.nav__link');
const sideDots = document.querySelectorAll('.side-nav__dot');

const scrollSpy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
    sideDots.forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => scrollSpy.observe(section));

// ======= FORMULARIO DE CONTACTO =======
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

const validators = {
  nombre: value => value.trim().length >= 2 || 'Ingresá tu nombre.',
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) || 'Ingresá un email válido.',
  asunto: value => value.trim().length >= 3 || 'Ingresá un asunto.',
  mensaje: value => value.trim().length >= 10 || 'El mensaje debe tener al menos 10 caracteres.',
};

function validateField(field) {
  const result = validators[field.name](field.value);
  const errorEl = document.getElementById(`error-${field.name}`);
  const valid = result === true;
  field.closest('.form-field').classList.toggle('invalid', !valid);
  errorEl.textContent = valid ? '' : result;
  return valid;
}

form.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => validateField(field));
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const fields = [...form.querySelectorAll('input, textarea')];
  const allValid = fields.map(validateField).every(Boolean);

  if (!allValid) {
    status.textContent = 'Revisá los campos marcados antes de enviar.';
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  status.textContent = 'Enviando...';

  const data = new FormData(form);
  data.set('_subject', `${data.get('asunto')} — ${data.get('nombre')}`);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      status.textContent = 'Mensaje enviado — gracias, te respondo a la brevedad.';
      form.reset();
    } else {
      status.textContent = 'No se pudo enviar. Escribime directo a mauro.kinjuk@gmail.com';
    }
  } catch {
    status.textContent = 'Sin conexión — escribime directo a mauro.kinjuk@gmail.com';
  } finally {
    submitBtn.disabled = false;
  }
});

// ======= AÑO EN FOOTER =======
document.getElementById('year').textContent = new Date().getFullYear();
