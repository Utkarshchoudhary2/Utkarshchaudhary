// final app.js - Firebase compat + UI logic (integrated)
window.__FIREBASE_CONF = {
  apiKey: "AIzaSyB1NtsmihmojQsWzOwqRo-286cv12spgdE",
  authDomain: "utkarshchaudhary-portfolio.firebaseapp.com",
  projectId: "utkarshchaudhary-portfolio",
  storageBucket: "utkarshchaudhary-portfolio.firebasestorage.app",
  messagingSenderId: "487685457505",
  appId: "1:487685457505:web:11c6575582ae018bc1cc20",
  measurementId: "G-7V964SHVM1"
};

function initFirebaseCompat(){
  try{
    if(window.firebase && !window.__FIREBASE_APP_INITIALIZED){
      firebase.initializeApp(window.__FIREBASE_CONF);
      window.__FIREBASE_APP_INITIALIZED = true;
      console.log('Firebase initialized');
    }
  }catch(e){ console.error('init firebase err', e); }
}

function showToast(text, ok=true){
  const wrap = document.getElementById('toast-wrap') || (function(){ const d=document.createElement('div'); d.id='toast-wrap'; document.body.appendChild(d); return d; })();
  const t = document.createElement('div'); t.className='toast'; t.textContent = text;
  if(!ok) t.style.background = 'linear-gradient(90deg,#ff9b9b,#ff8b8b)';
  wrap.appendChild(t); setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=> t.remove(),400); }, 3000);
}

function getAuth(){
  initFirebaseCompat();
  return firebase.auth();
}

function setPersistence(remember){
  const auth = getAuth();
  if(!auth) return Promise.resolve();
  try{
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
