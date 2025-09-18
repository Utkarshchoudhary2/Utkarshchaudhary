
document.addEventListener('DOMContentLoaded', function(){
  // sidebar toggle
  var sidebar = document.querySelector('.sidebar');
  var hamburger = document.querySelector('.hamburger');
  var themeBtn = document.querySelector('.theme-toggle');
  if(hamburger){ hamburger.addEventListener('click', function(){ sidebar.classList.toggle('open'); }); }
  if(themeBtn){ themeBtn.addEventListener('click', function(){ document.body.classList.toggle('light'); localStorage.setItem('theme', document.body.classList.contains('light')?'light':'dark'); }); }
  // apply saved theme
  if(localStorage.getItem('theme')==='light') document.body.classList.add('light');

  // AOS
  if(window.AOS) AOS.init({duration:900, once:true});

  // particles on home and projects if present
  if(document.getElementById('particles-js-full') && window.particlesJS){
    particlesJS('particles-js-full', {"particles":{"number":{"value":60},"color":{"value":"#00bfff"},"opacity":{"value":0.12},"size":{"value":3},"move":{"speed":0.6}},"interactivity":{"events":{"onhover":{"enable":false}}}});
  }
  if(document.getElementById('particles-js-projects') && window.particlesJS){
    particlesJS('particles-js-projects', {"particles":{"number":{"value":45},"color":{"value":"#00bfff"},"opacity":{"value":0.08},"size":{"value":3},"move":{"speed":0.4}},"interactivity":{"events":{"onhover":{"enable":false}}}});
  }

  // login gating for pages other than login.html
  if(window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('/')){
    // nothing
  } else {
    // require token
    var token = localStorage.getItem('portfolio_token');
    if(!token){
      // redirect to login page
      window.location.href = 'login.html';
    }
  }
});
