const firebaseConfig = {'apiKey': 'AIzaSyB1NtsmihmojQsWzOwqRo-286cv12spgdE', 'authDomain': 'utkarshchaudhary-portfolio.firebaseapp.com', 'projectId': 'utkarshchaudhary-portfolio', 'storageBucket': 'utkarshchaudhary-portfolio.firebasestorage.app', 'messagingSenderId': '487685457505', 'appId': '1:487685457505:web:797c7ac6cc2e40d8c1cc20', 'measurementId': 'G-VYF9PRY0F9'};
firebase.initializeApp(firebaseConfig);

function showToast(msg){ const t=document.createElement('div'); t.className='toast show'; t.innerText=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),3000); }

document.addEventListener('DOMContentLoaded', ()=>{ 
  const hb=document.querySelector('.hamburger'); const sb=document.querySelector('.sidebar');
  if(hb) hb.addEventListener('click', ()=> sb.classList.toggle('active'));
  if(window.AOS) AOS.init({duration:600, once:true});
  document.getElementById('logoutBtn')?.addEventListener('click', (e)=>{ e.preventDefault(); firebase.auth().signOut().then(()=>{ showToast('Logged out'); window.location.href='index.html'; }).catch(err=>showToast(err.message)); });
});

firebase.auth().onAuthStateChanged(user=>{ 
  const path = window.location.pathname.split('/').pop();
  if((path==='projects.html' || document.title==='Projects') && !user){ window.location.href='login.html'; }
});

document.getElementById('loginForm')?.addEventListener('submit', (e)=>{ e.preventDefault(); const email=document.getElementById('loginEmail').value; const pass=document.getElementById('loginPassword').value; firebase.auth().signInWithEmailAndPassword(email,pass).then(()=>{ showToast('Login successful'); window.location.href='projects.html'; }).catch(err=>showToast(err.message)); });

document.getElementById('signupForm')?.addEventListener('submit', (e)=>{ e.preventDefault(); const email=document.getElementById('signupEmail').value; const pass=document.getElementById('signupPassword').value; firebase.auth().createUserWithEmailAndPassword(email,pass).then(()=>{ showToast('Account created'); window.location.href='projects.html'; }).catch(err=>showToast(err.message)); });

document.getElementById('resetForm')?.addEventListener('submit', (e)=>{ e.preventDefault(); const email=document.getElementById('resetEmail').value; firebase.auth().sendPasswordResetEmail(email).then(()=>showToast('Reset email sent')).catch(err=>showToast(err.message)); });

document.getElementById('contactForm')?.addEventListener('submit', (e)=>{ e.preventDefault(); showToast('Message sent (dummy)'); document.getElementById('contactForm').reset(); });
