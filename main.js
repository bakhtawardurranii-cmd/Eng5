// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Web3Forms submission handler — used by the Contact form and the
// Free IELTS Mock Test booking form. Submits via fetch so the page
// never reloads during the request; on success it redirects to the
// branded thank-you page (path set per-form via data-thankyou-url).
function initWeb3Form(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Honeypot check — if the hidden botcheck field got filled, silently drop it
    const honeypot = form.querySelector('input[name="botcheck"]');
    if (honeypot && honeypot.checked) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
    }

    // Clear any previous error
    const existingError = form.querySelector('.form-error');
    if (existingError) existingError.remove();

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        const thankYouUrl = form.dataset.thankyouUrl || 'thank-you.html';
        window.location.href = thankYouUrl;
        return;
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      if (submitBtn) {
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
      }
      const errorBox = document.createElement('p');
      errorBox.className = 'form-error full';
      errorBox.textContent =
        'Something went wrong sending this — please try again, or reach us directly on WhatsApp at +92 370 2491776.';
      form.appendChild(errorBox);
    }
  });
}

initWeb3Form('contactForm');
initWeb3Form('mockTestForm');
