const nav = document.querySelector('header nav');
const navToggle = document.createElement('button');

navToggle.classList.add('nav-toggle');
navToggle.innerHTML = '<span class="bar"></span><span class="bar"></span><span class.bar"></span>';

nav.parentNode.insertBefore(navToggle, nav);

navToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Add media query to handle mobile responsiveness
const mediaQuery = window.matchMedia('(max-width: 768px)'); // Adjust breakpoint as needed
mediaQuery.addListener((event) => {
  if (event.matches) {
    nav.classList.remove('active'); // Close menu initially on mobile
  }
});