const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const contactForm = document.querySelector('#contact_form');
const responseMessage = document.querySelector('#responseMessage');
const scriptURL = 'https://script.google.com/macros/s/AKfycbyD-vZbfqorgiZ5fWD_51IU99ICdhtkVZcg5SttNJikslUOwYg31JieG2ORrFHEYg03/exec';

menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

siteNav.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    siteNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

document.querySelector('#current-year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button');
  submitButton.disabled = true;
  responseMessage.textContent = 'Sending your message...';

  try {
    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
    });
    const result = await response.json();
    if (result.status !== 'success') throw new Error(result.error || 'Unable to send message.');
    responseMessage.textContent = 'Thank you. Your message has been sent.';
    contactForm.reset();
  } catch (error) {
    responseMessage.textContent = 'We could not send that just now. Please email us directly.';
  } finally {
    submitButton.disabled = false;
  }
});
