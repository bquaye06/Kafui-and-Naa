// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

const menuToggle = document.getElementById('menuToggle');
const menuOverlay = document.getElementById('siteMenu');
const menuClose = document.getElementById('menuClose');

function openMenu() {
  menuOverlay.classList.add('open');
  menuOverlay.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
}

function closeMenu() {
  menuOverlay.classList.remove('open');
  menuOverlay.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  if (menuOverlay.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

menuClose.addEventListener('click', closeMenu);

document.querySelectorAll('.menu-item').forEach(link => {
  link.addEventListener('click', closeMenu);
});

menuOverlay.addEventListener('click', (event) => {
  if (event.target === menuOverlay) {
    closeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (menuOverlay.classList.contains('open')) {
      closeMenu();
    }
    const rsvpModal = document.getElementById('rsvpModal');
    if (rsvpModal && rsvpModal.classList.contains('open')) {
      rsvpModal.classList.remove('open');
      const heroRsvpPill = document.querySelector('.hero-rsvp-pill');
      const heroSection = document.querySelector('.hero');
      if(heroRsvpPill && heroSection){
        const heroInView = heroSection.getBoundingClientRect().bottom > 0;
        if(heroInView) heroRsvpPill.classList.remove('hidden');
      }
    }
  }
});

// Countdown timer
function updateCountdown() {
  const weddingDate = new Date('2027-01-30T00:00:00').getTime();
  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, '0');

    const countdownDays = document.getElementById('countdown-days');
    const countdownHours = document.getElementById('countdown-hours');
    const countdownMins = document.getElementById('countdown-mins');
    const countdownSecs = document.getElementById('countdown-secs');

    if (countdownDays) countdownDays.textContent = pad(days);
    if (countdownHours) countdownHours.textContent = pad(hours);
    if (countdownMins) countdownMins.textContent = pad(mins);
    if (countdownSecs) countdownSecs.textContent = pad(secs);
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Modal RSVP submit
document.getElementById('modalRsvpForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.getElementById('modalSubmitBtn');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const data = new FormData(this);

  try {
    const response = await fetch('https://formspree.io/f/mjg1wvno', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      this.innerHTML = '<div style="text-align:center;padding:1.5rem 0"><p style="font-family:Cormorant Garamond,serif;font-size:1.6rem;color:var(--cream);margin-bottom:0.5rem">Thank You! &#10003;</p><p style="font-family:Jost,sans-serif;font-weight:300;font-size:0.85rem;color:#aaa">We cannot wait to celebrate with you on 30 January 2027!</p></div>';
    } else {
      btn.textContent = 'Try Again';
      btn.disabled = false;
    }
  } catch (err) {
    btn.textContent = 'Try Again';
    btn.disabled = false;
  }
});

// Enhance select arrow interaction in modal
// Initialize custom dropdowns
function initCustomSelects(){
  document.querySelectorAll('.custom-select-wrap').forEach(wrapper => {
    const native = wrapper.querySelector('.native-select');
    const btn = wrapper.querySelector('.custom-select');
    const label = wrapper.querySelector('.custom-select-label');
    const list = wrapper.querySelector('.custom-options');
    const options = Array.from(list.querySelectorAll('li'));
    let open = false;
    let focusedIndex = -1;

    function openList(){
      open = true;
      list.classList.add('open');
      list.setAttribute('aria-hidden','false');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded','true');
      // focus first selectable
      focusedIndex = options.findIndex(o => !o.hasAttribute('disabled'));
      highlight(focusedIndex);
    }
    function closeList(){
      open = false;
      list.classList.remove('open');
      list.setAttribute('aria-hidden','true');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      removeHighlights();
    }
    function removeHighlights(){ options.forEach(o => o.classList.remove('focus')); }
    function highlight(idx){ removeHighlights(); if(idx>=0 && options[idx]) options[idx].classList.add('focus'); }

    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      if(open) closeList(); else openList();
    });

    options.forEach((opt, idx)=>{
      opt.addEventListener('click', (e)=>{
        e.stopPropagation();
        selectOption(idx);
        closeList();
      });
    });

    function selectOption(idx){
      const opt = options[idx];
      if(!opt) return;
      // set native select value
      native.value = opt.dataset.value;
      // update visible label
      label.textContent = opt.textContent.trim();
      // mark selected aria
      options.forEach(o=>o.setAttribute('aria-selected','false'));
      opt.setAttribute('aria-selected','true');
    }

    // keyboard support
    wrapper.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowDown'){
        e.preventDefault();
        if(!open) openList(); else { focusedIndex = Math.min(focusedIndex+1, options.length-1); highlight(focusedIndex); }
      } else if(e.key === 'ArrowUp'){
        e.preventDefault();
        if(!open) openList(); else { focusedIndex = Math.max(focusedIndex-1, 0); highlight(focusedIndex); }
      } else if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if(!open) openList(); else { selectOption(focusedIndex); closeList(); }
      } else if(e.key === 'Escape'){
        if(open){ e.preventDefault(); closeList(); }
      }
    });

    // click outside to close
    document.addEventListener('click', (ev)=>{ if(!wrapper.contains(ev.target)) closeList(); });

    // initialize label if native has a value
    if(native.value){
      const match = options.find(o=>o.dataset.value===native.value);
      if(match) label.textContent = match.textContent.trim();
    }
  });
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCustomSelects);
else initCustomSelects();

// Hero RSVP button opens the same RSVP modal
const heroRsvpBtn = document.getElementById('heroRsvpBtn');
const rsvpModal = document.getElementById('rsvpModal');
const heroRsvpPill = document.querySelector('.hero-rsvp-pill');

if(heroRsvpBtn && rsvpModal){
  heroRsvpBtn.addEventListener('click', ()=>{
    rsvpModal.classList.add('open');
    if(heroRsvpPill) heroRsvpPill.classList.add('hidden');
  });
}

// Hide pill when modal is open, show when closed
if(rsvpModal && heroRsvpPill){
  const modalClose = rsvpModal.querySelector('.modal-close');
  if(modalClose){
    modalClose.addEventListener('click', ()=>{
      const heroSection = document.querySelector('.hero');
      if(heroSection){
        const heroInView = heroSection.getBoundingClientRect().bottom > 0;
        if(heroInView) heroRsvpPill.classList.remove('hidden');
      }
    });
  }
  
  // Also handle clicking outside modal to close
  rsvpModal.addEventListener('click', (e)=>{
    if(e.target === rsvpModal){
      rsvpModal.classList.remove('open');
      const heroSection = document.querySelector('.hero');
      if(heroSection){
        const heroInView = heroSection.getBoundingClientRect().bottom > 0;
        if(heroInView) heroRsvpPill.classList.remove('hidden');
      }
    }
  });
}

// Scroll-based pill visibility - show only when hero is in view
const heroSection = document.querySelector('.hero');
if(heroRsvpPill && heroSection && rsvpModal){
  const pillObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      // Only show pill if modal is not open and hero is in view
      if(entry.isIntersecting && !rsvpModal.classList.contains('open')){
        heroRsvpPill.classList.remove('hidden');
      } else {
        heroRsvpPill.classList.add('hidden');
      }
    });
  }, { threshold: 0.2 });
  pillObserver.observe(heroSection);
}