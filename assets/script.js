/* assets/script.js - handles sidebar toggle, auth check (Firebase if configured), demo fallback, spinner, toast */
const useFirebase = typeof window.firebaseConfig !== 'undefined' && window.firebaseConfig.apiKey && window.firebaseConfig.apiKey !== 'YOUR_API_KEY';

// simple toast
function showToast(msg, ok=true){
  const container = document.querySelector('.toast-wrap') || (function(){const d=document.createElement('div');d.className='toast-wrap';document.body.appendChild(d);return d;})();
  const t = document.createElement('div'); t.className='toast'; t.textContent=msg; container.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(),400); }, 3000);
}

// spinner controls
function showLoader(){ const el=document.getElementById('global-loader'); if(el) el.style.display='flex'; }
function hideLoader(){ const el=document.getElementById('global-loader'); if(el) el.style.display='none'; }

// sidebar toggle
document.addEventListener('DOMContentLoaded', ()=>{
  const sidebar = document.querySelector('.sidebar');
  const ham = document.querySelector('.hamburger');
  if(ham) ham.addEventListener('click', ()=> sidebar.classList.toggle('open'));

  // logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) logoutBtn.addEventListener('click', ()=>{
    if(window.firebaseAuth){
      window.firebaseAuth.signOut().then(()=>{ localStorage.removeItem('demo_token'); window.location.href='login.html'; });
    } else {
      localStorage.removeItem('demo_token'); window.location.href='login.html';
    }
  });
});

// auth helpers (demo fallback)
async function demoSignIn(email,password,remember){
  if(email==='test@demo.com' && password==='123456'){
    if(remember) localStorage.setItem('demo_token','1'); else sessionStorage.setItem('demo_token','1');
    return {email:'test@demo.com', uid:'demo'};
  } else throw new Error('Invalid demo credentials');
}

async function checkAuthAndRedirect(){
  showLoader();
  if(useFirebase){
    try{
      // initialize firebase (modular via CDN)
      const app = firebase.initializeApp(window.firebaseConfig);
      const auth = firebase.getAuth(app);
      window.firebaseAuth = auth;
      firebase.onAuthStateChanged(auth, user=>{
        if(!user){
          hideLoader();
          if(!location.pathname.endsWith('login.html') && !location.pathname.endsWith('signup.html')) location.href='login.html';
        } else {
          hideLoader();
        }
      });
    }catch(e){
      console.warn('Firebase init error',e);
      // fallback to demo check
      if(!localStorage.getItem('demo_token') && !sessionStorage.getItem('demo_token')){
        hideLoader(); if(!location.pathname.endsWith('login.html') && !location.pathname.endsWith('signup.html')) location.href='login.html';
      } else hideLoader();
    }
  } else {
    // demo fallback
    if(!localStorage.getItem('demo_token') && !sessionStorage.getItem('demo_token')){
      hideLoader(); if(!location.pathname.endsWith('login.html') && !location.pathname.endsWith('signup.html')) location.href='login.html';
    } else hideLoader();
  }
}

// run on pages to enforce auth
if(!location.pathname.endsWith('login.html') && !location.pathname.endsWith('signup.html')){
  document.addEventListener('DOMContentLoaded', ()=>{ checkAuthAndRedirect(); });
}

// simple helper to open external in new tab safely
function openNew(url){ window.open(url,'_blank','noopener'); }
