\
// Firebase config (integrated)
window.__FIREBASE_CONF = {
  apiKey: "AIzaSyB1NtsmihmojQsWzOwqRo-286cv12spgdE",
  authDomain: "utkarshchaudhary-portfolio.firebaseapp.com",
  projectId: "utkarshchaudhary-portfolio",
  storageBucket: "utkarshchaudhary-portfolio.firebasestorage.app",
  messagingSenderId: "487685457505",
  appId: "1:487685457505:web:11c6575582ae018bc1cc20",
  measurementId: "G-7V964SHVM1"
};
function initFirebaseCompat(){ try{ if(window.firebase && !window.__FIREBASE_APP_INITIALIZED){ firebase.initializeApp(window.__FIREBASE_CONF); window.__FIREBASE_APP_INITIALIZED=true; console.log('Firebase initialized'); } }catch(e){ console.error(e); } }
function showToast(text, ok=true){ const wrap=document.getElementById('toast-wrap')||(function(){ const d=document.createElement('div'); d.id='toast-wrap'; document.body.appendChild(d); return d; })(); const t=document.createElement('div'); t.className='toast'; t.textContent=text; if(!ok) t.style.background='linear-gradient(90deg,#ff9b9b,#ff8b8b)'; wrap.appendChild(t); setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=> t.remove(),400); }, 3000); }
function getAuth(){ initFirebaseCompat(); return firebase.auth(); }
function isValidEmail(e){ return /\S+@\S+\.\S+/.test(e); }

// Tab switching
document.addEventListener('click', function(e){
  if(e.target && e.target.id === 'tab-login'){
    document.getElementById('login-form').style.display='block';
    document.getElementById('signup-form').style.display='none';
    e.target.classList.add('active');
    document.getElementById('tab-signup').classList.remove('active');
  }
  if(e.target && e.target.id === 'tab-signup'){
    document.getElementById('signup-form').style.display='block';
    document.getElementById('login-form').style.display='none';
    e.target.classList.add('active');
    document.getElementById('tab-login').classList.remove('active');
  }
});

// Signup
document.addEventListener('click', function(e){
  if(e.target && e.target.id === 'signupBtn'){
    e.preventDefault();
    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const pw = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if(!fullName){ showToast('Enter full name', false); return; }
    if(!isValidEmail(email)){ showToast('Enter valid email', false); return; }
    if(pw.length < 6){ showToast('Password min 6 chars', false); return; }
    if(pw !== confirm){ showToast('Passwords do not match', false); return; }
    const auth = getAuth();
    auth.createUserWithEmailAndPassword(email, pw).then(res=>{
      const user = res.user;
      if(user){
        user.updateProfile({ displayName: fullName }).catch(()=>{});
        // send verification with continue URL to redirect back (use index.html)
        const actionCodeSettings = { url: window.location.origin + '/index.html?mode=verifyEmail', handleCodeInApp: false };
        user.sendEmailVerification(actionCodeSettings).then(()=>{
          showToast('📩 Verification email sent — check your inbox.');
          auth.signOut();
          setTimeout(()=>{ window.location.href = 'index.html'; }, 800);
        }).catch(err=>{ showToast('Could not send verification: '+(err.message||''), false); });
      }
    }).catch(err=> showToast(err.message||'Signup failed', false));
  }
});

// Login
document.addEventListener('click', function(e){
  if(e.target && e.target.id === 'loginBtn'){
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pw = document.getElementById('login-password').value;
    const remember = document.getElementById('rememberMe').checked;
    if(!isValidEmail(email) || !pw){ showToast('Enter email & password', false); return; }
    const auth = getAuth();
    const persistence = remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
    auth.setPersistence(persistence).then(()=>{
      auth.signInWithEmailAndPassword(email, pw).then(res=>{
        const user = res.user;
        if(user && !user.emailVerified){
          auth.signOut();
          showToast('⚠️ Please verify your email before logging in.', false);
          setTimeout(()=> window.location.href = 'verify.html', 700);
          return;
        }
        showToast('✅ Login successful');
        setTimeout(()=> window.location.href = 'home.html', 600);
      }).catch(err=> showToast(err.message||'Login failed', false));
    });
  }
});

// Reset password (simple)
document.addEventListener('click', function(e){
  if(e.target && e.target.id === 'goto-verify'){
    e.preventDefault();
    // go to verify page to resend verification
    window.location.href = 'verify.html';
  }
});

// Verify resend logic on verify.html
document.addEventListener('click', function(e){
  if(e.target && e.target.id === 'resendVerify'){
    e.preventDefault();
    const btn = e.target;
    const email = document.getElementById('verify-email').value.trim();
    const pw = document.getElementById('verify-password').value;
    if(!isValidEmail(email) || !pw){ showToast('Enter email & password to resend', false); return; }
    const auth = getAuth();
    // sign in temporarily, send verification, sign out
    auth.signInWithEmailAndPassword(email, pw).then(res=>{
      const user = res.user;
      if(user && user.emailVerified){ showToast('This account is already verified. Please login.'); auth.signOut(); return; }
      const actionCodeSettings = { url: window.location.origin + '/index.html?mode=verifyEmail', handleCodeInApp: false };
      user.sendEmailVerification(actionCodeSettings).then(()=>{
        showToast('📩 Verification email resent. Check your inbox.');
        // cooldown 60s
        let wait = 60;
        btn.disabled = true;
        const orig = btn.textContent;
        btn.textContent = 'Resend ('+wait+'s)';
        const ti = setInterval(()=>{
          wait -= 1;
          if(wait <= 0){ clearInterval(ti); btn.disabled = false; btn.textContent = orig; } else { btn.textContent = 'Resend ('+wait+'s)'; }
        }, 1000);
        // sign out after sending
        auth.signOut();
      }).catch(err=>{ showToast('Resend failed: '+(err.message||''), false); auth.signOut(); });
    }).catch(err=> showToast('Sign-in failed: '+(err.message||''), false));
  }
});

// handle applyActionCode from email link (verification)
document.addEventListener('DOMContentLoaded', function(){
  initFirebaseCompat();
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const oobCode = urlParams.get('oobCode') || urlParams.get('oobcode');
  if(mode === 'verifyEmail' && oobCode){
    const auth = getAuth();
    auth.applyActionCode(oobCode).then(()=>{
      showToast('✅ Email verified! You can now login.');
      // remove query params by redirecting to index without params
      setTimeout(()=>{ window.location.href = 'index.html'; }, 1400);
    }).catch(err=>{
      console.error(err);
      showToast('Verification failed: '+(err.message||''), false);
    });
  }
});

// logout - works across pages
document.addEventListener('click', function(e){
  if(e.target && (e.target.id==='logoutBtn' || e.target.id==='logoutBtn2' || e.target.id==='logoutBtn3')){
    const auth = getAuth();
    auth.signOut().then(()=>{ showToast('👋 Logged out successfully'); document.body.style.transition='opacity .45s ease'; document.body.style.opacity='0.4'; setTimeout(()=> window.location.href='index.html',600); }).catch(err=> showToast('Logout failed', false));
  }
});

// modal open/close and auth gating for resume/projects
function openModalIfAuth(modalId){
  initFirebaseCompat(); const auth = firebase.auth();
  auth.onAuthStateChanged(function(user){
    if(!user){ showToast('⚠️ Please log in or sign up to access this section.', false); setTimeout(()=> window.location.href='index.html',600); return; }
    if(!user.emailVerified){ showToast('⚠️ Please verify your email first.', false); setTimeout(()=> window.location.href='verify.html',700); return; }
    openModal(modalId);
  });
}
function openModal(modalId){ const backdrop=document.getElementById('modal-backdrop'); const modal=document.getElementById(modalId); if(backdrop && modal){ backdrop.classList.add('show'); modal.style.display='block'; backdrop.setAttribute('aria-hidden','false'); if(modalId==='modal-resume'){ showToast('📄 Resume loaded successfully'); } } }
function closeModal(modalId){ const backdrop=document.getElementById('modal-backdrop'); const modal=document.getElementById(modalId); if(backdrop && modal){ modal.style.display='none'; const anyVisible=Array.from(document.querySelectorAll('.modal')).some(m=>m.style.display==='block'); if(!anyVisible) backdrop.classList.remove('show'); backdrop.setAttribute('aria-hidden','true'); } }
function openResumeIfAuth(){ openModalIfAuth('modal-resume'); } function openProjectsIfAuth(){ openModalIfAuth('modal-projects'); }

// download resume
document.addEventListener('click', function(e){
  if(e.target && e.target.id==='download-resume'){ const a=document.createElement('a'); a.href='assets/Utkarsh_Modern_Resume.pdf'; a.download='Utkarsh_Modern_Resume.pdf'; document.body.appendChild(a); a.click(); a.remove(); }
});
