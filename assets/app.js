particlesJS("particles-js", {"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":6,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"repulse"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});var count_particles, stats, update; stats = new Stats; stats.setMode(0); stats.domElement.style.position = 'absolute'; stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); count_particles = document.querySelector('.js-count-particles'); update = function() { stats.begin(); stats.end(); if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { count_particles.innerText = window.pJSDom[0].pJS.particles.array.length; } requestAnimationFrame(update); }; requestAnimationFrame(update);;  try{
    if(remember) return auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    return auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
  }catch(e){ return Promise.resolve(); }
}

document.addEventListener('click', function(e){
  // Login
  if(e.target && e.target.id === 'loginBtn'){
    const email = document.getElementById('email')?.value?.trim();
    const pw = document.getElementById('password')?.value?.trim();
    const remember = document.getElementById('rememberMe')?.checked;
    if(!email || !pw){ showToast('Enter email and password', false); return; }
    setPersistence(remember).then(()=> {
      const auth = getAuth();
      auth.signInWithEmailAndPassword(email,pw)
        .then(()=> { showToast('✅ Login successful'); setTimeout(()=> window.location.href = 'home.html', 600); })
        .catch(err => showToast('❌ '+(err.message||'Login failed'), false));
    });
  }

  // Signup
  if(e.target && e.target.id === 'signupBtn'){
    const email = document.getElementById('email')?.value?.trim();
    const pw = document.getElementById('password')?.value?.trim();
    if(!email || !pw){ showToast('Enter email and password', false); return; }
    const auth = getAuth();
    auth.createUserWithEmailAndPassword(email,pw)
      .then(()=> showToast('🎉 Sign up successful — please login'))
      .catch(err=> showToast('❌ '+(err.message||'Signup failed'), false));
  }

  // Reset
  if(e.target && e.target.id === 'resetBtn'){
    const email = document.getElementById('email')?.value?.trim();
    if(!email){ showToast('Enter email to reset', false); return; }
    const auth = getAuth();
    auth.sendPasswordResetEmail(email).then(()=> showToast('✉️ Reset email sent')).catch(err=> showToast('❌ '+(err.message||'Reset failed'), false));
  }
});

document.addEventListener('DOMContentLoaded', function(){
  // attach logout handlers
  function attachLogout(id){
    const el = document.getElementById(id); if(!el) return;
    el.addEventListener('click', ()=>{
      const auth = getAuth();
      auth.signOut().then(()=>{
        showToast('👋 Logged out successfully');
        document.body.style.transition='opacity .45s ease'; document.body.style.opacity='0.4';
        setTimeout(()=> window.location.href = 'index.html', 600);
      }).catch(err=> showToast('❌ Logout failed', false));
    });
  }
  attachLogout('logoutBtn'); attachLogout('logoutBtn2');

  // modal backdrop close on outside click
  const backdrop = document.getElementById('modal-backdrop');
  if(backdrop) backdrop.addEventListener('click', function(ev){
    if(ev.target === backdrop){
      document.querySelectorAll('.modal').forEach(m=> m.style.display='none'); backdrop.classList.remove('show');
    }
  });

  // auth state change: update welcome
  initFirebaseCompat();
  const auth = firebase.auth();
  auth.onAuthStateChanged(function(user){
    const welcomeTitle = document.getElementById('welcome-title');
    if(user && welcomeTitle){
      const name = (user.displayName && user.displayName.trim()) ? user.displayName : (user.email ? user.email.split('@')[0] : 'Utkarsh');
      welcomeTitle.textContent = `Welcome, ${name} 👋`;
      showToast('✅ Logged in as ' + (user.email || name));
    } else if(welcomeTitle){
      welcomeTitle.textContent = 'Welcome, Utkarsh 👋';
    }
  });
});

// Modal functions & access control
function openModalIfAuth(modalId){
  initFirebaseCompat();
  const auth = firebase.auth();
  const user = auth.currentUser;
  if(!user){ showToast('⚠️ Please log in or sign up to access this section.', false); return; }
  openModal(modalId);
}
function openModal(modalId){
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById(modalId);
  if(backdrop && modal){
    backdrop.classList.add('show'); modal.style.display='block'; backdrop.setAttribute('aria-hidden','false');
  }
}
function closeModal(modalId){
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById(modalId);
  if(backdrop && modal){ modal.style.display='none'; const anyVisible = Array.from(document.querySelectorAll('.modal')).some(m=>m.style.display==='block'); if(!anyVisible) backdrop.classList.remove('show'); backdrop.setAttribute('aria-hidden','true'); }
}

document.addEventListener('click', function(e){
  if(e.target && e.target.classList.contains('close-x')){
    const t = e.target.getAttribute('data-target'); if(t) closeModal(t);
  }
  if(e.target && e.target.id === 'sidebar-resume'){ openModalIfAuth('modal-resume'); }
  if(e.target && e.target.id === 'sidebar-resume-2'){ openModalIfAuth('modal-resume'); }
  if(e.target && e.target.id === 'sidebar-projects'){ openModalIfAuth('modal-projects'); }
  if(e.target && e.target.id === 'sidebar-projects-2'){ openModalIfAuth('modal-projects'); }
});

// helpers from home buttons
function openResumeIfAuth(){ openModalIfAuth('modal-resume'); }
function openProjectsIfAuth(){ openModalIfAuth('modal-projects'); }

// download resume
document.addEventListener('click', function(e){
  if(e.target && e.target.id === 'download-resume'){
    const a = document.createElement('a'); a.href='assets/Utkarsh_Modern_Resume.pdf'; a.download='Utkarsh_Modern_Resume.pdf'; document.body.appendChild(a); a.click(); a.remove();
  }
});
