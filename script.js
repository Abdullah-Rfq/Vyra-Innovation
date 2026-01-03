document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      if (!data.get('name') || !data.get('email')) {
        status.textContent = 'Please complete the required fields.';
        return;
      }
      // Simulate send (replace with real API or mailto as needed)
      status.textContent = 'Thanks — we received your message and will be in touch.';
      form.reset();
      setTimeout(() => status.textContent = '', 6000);
    });
  }

  // reveal on scroll with staggered delays for course cards
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  revealEls.forEach((el, i) => {
    // stagger delay (small)
    el.style.transitionDelay = (i * 80) + 'ms';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  revealEls.forEach(el => observer.observe(el));

  // prefill signup form if course query param is present
  const params = new URLSearchParams(window.location.search);
  const preCourse = params.get('course');
  if (preCourse) {
    const signupCourse = document.querySelector('[name="course"]');
    if (signupCourse) signupCourse.value = decodeURIComponent(preCourse);
  }

  // show/hide courses and related things depending on whether the user has signed up
  function updateSignedUI(){
    const signed = localStorage.getItem('vyra_signed') === 'true';
    document.querySelectorAll('.hidden-until-signed').forEach(el => {
      el.style.display = signed ? '' : 'none';
    });
    // nav courses link
    document.querySelectorAll('.nav-courses').forEach(el => {
      el.style.display = signed ? '' : 'none';
      el.style.opacity = signed ? '1' : '0';
    });
    // if signed, reveal any reveal blocks inside the hidden sections
    if (signed) {
      document.querySelectorAll('.hidden-until-signed .reveal').forEach(el => el.classList.add('in-view'));
    }
  }

  updateSignedUI();

  // Smooth-scroll to About section when appropriate
  function scrollToAboutSmooth(){
    const about = document.getElementById('about');
    if(!about) return;
    try{ about.scrollIntoView({behavior:'smooth', block:'start'}); }catch(e){ window.scrollTo({top: about.offsetTop, behavior:'smooth'}); }
  }

  // intercept local About links and scroll smoothly
  document.querySelectorAll('a[href="#about"]').forEach(a => {
    a.addEventListener('click', (e) => {
      // if we're already on the index page, prevent default and smooth scroll
      if(window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('Vyra-Innovations') ){
        e.preventDefault();
        scrollToAboutSmooth();
      }
    });
  });

  // if page loaded with hash #about, perform smooth scroll after layout
  if(window.location.hash === '#about'){
    setTimeout(scrollToAboutSmooth, 120);
  }

  // ensure sign-up status is set when the signup form is submitted
  const signupForm = document.querySelector('form[name="signup"]');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      // try to set signed flag so homepage reveals courses after redirect
      try{ localStorage.setItem('vyra_signed','true'); }catch(err){}
    });
  }

  // also set signed if user submits the contact form but includes 'course' text
  const contactForm = document.querySelector('form[name="contact"]');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      try{ localStorage.setItem('vyra_signed','true'); }catch(e){}
    });
  }

});