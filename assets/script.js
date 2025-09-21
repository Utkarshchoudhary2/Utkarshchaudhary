/* basic script: hamburger toggle, auth demo, loader, toast, demo buttons open new tab */
document.addEventListener('DOMContentLoaded', function(){
  // hamburger toggle
  const ham = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  if(ham && sidebar){
    ham.addEventListener('click', ()=> sidebar.classList.toggle('open'));
  }

  // demo login logic - buttons
  const loginBtn = document.getElementById('loginBtn');
  if(loginBtn){
    loginBtn.addEventListener('click', async ()=>{
      const email = document.getElementById('email').value.trim();
      const pw = document.getElementById('password').value.trim();
      const remember = document.getElementById('remember')?.checked;
      // demo check
      if((email==='test@demo.com' && pw==='123456') || (email==='admin' && pw==='1234')){
        if(remember) localStorage.setItem('demo_token','1'); else sessionStorage.setItem('demo_token','1');
        showToast('Login successful');
        setTimeout(()=> location.href='index.html',600);
      } else {
        showToast('Invalid credentials', false);
        const c = document.querySelector('.card'); if(c){ c.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:480}) }
      }
    });
  }

  const signupBtn = document.getElementById('signupBtn');
  if(signupBtn){
    signupBtn.addEventListener('click', ()=>{
      showToast('Signup demo: account created. Use test@demo.com / 123456 to login');
      setTimeout(()=> location.href='login.html',800);
    });
  }

  // demo logout
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn){
    logoutBtn.addEventListener('click', ()=>{
      localStorage.removeItem('demo_token'); sessionStorage.removeItem('demo_token'); location.href='login.html';
    });
  }

  // project demo buttons - open in new tab
  document.querySelectorAll('.btn-demo').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const url = e.currentTarget.getAttribute('data-url');
      if(url) window.open(url, '_blank', 'noopener');
    });
  });

  // hide loader early
  const loader = document.getElementById('global-loader');
  if(loader) setTimeout(()=> loader.style.display='none', 600);
});

function showToast(msg, ok=true){
  const wrap = document.querySelector('.toast-wrap') || (function(){ const d=document.createElement('div'); d.className='toast-wrap'; document.body.appendChild(d); return d; })();
  const t = document.createElement('div'); t.className='toast'; t.textContent=msg; if(!ok) t.style.background='linear-gradient(90deg,#ff9b9b,#ff8b8b)'; wrap.appendChild(t);
  setTimeout(()=> t.style.opacity='0', 3200); setTimeout(()=> t.remove(), 3600);
}

// auth protection on pages: redirect to login if not demo-token present (if not on login/signup)
(function(){
  const path = location.pathname.split('/').pop();
  if(path !== 'login.html' && path !== 'signup.html'){
    if(!localStorage.getItem('demo_token') && !sessionStorage.getItem('demo_token')){
      // if firebase not set, redirect to login (demo)
      setTimeout(()=> location.href='login.html', 300);
    }
  }
})();
