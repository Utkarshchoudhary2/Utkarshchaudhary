// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB1NtsmihmojQsWzOwqRo-286cv12spgdE",
  authDomain: "utkarshchaudhary-portfolio.firebaseapp.com",
  projectId: "utkarshchaudhary-portfolio",
  storageBucket: "utkarshchaudhary-portfolio.firebasestorage.app",
  messagingSenderId: "487685457505",
  appId: "1:487685457505:web:797c7ac6cc2e40d8c1cc20",
  measurementId: "G-VYF9PRY0F9"
};
firebase.initializeApp(firebaseConfig);

// Auth state protect Projects page
firebase.auth().onAuthStateChanged(user=>{
  if(document.title==="Projects" && !user){
    window.location.href="login.html";
  }
});

// Login
document.getElementById("loginForm")?.addEventListener("submit", (e)=>{
  e.preventDefault();
  const email=document.getElementById("loginEmail").value;
  const pass=document.getElementById("loginPassword").value;
  firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(()=> {
      showToast("Login Successful");
      window.location.href="projects.html";
    })
    .catch(err=> showToast(err.message));
});

// Signup
document.getElementById("signupForm")?.addEventListener("submit", (e)=>{
  e.preventDefault();
  const email=document.getElementById("signupEmail").value;
  const pass=document.getElementById("signupPassword").value;
  firebase.auth().createUserWithEmailAndPassword(email, pass)
    .then(()=> {
      showToast("Account Created");
      window.location.href="projects.html";
    })
    .catch(err=> showToast(err.message));
});

// Reset Password
document.getElementById("resetForm")?.addEventListener("submit", (e)=>{
  e.preventDefault();
  const email=document.getElementById("resetEmail").value;
  firebase.auth().sendPasswordResetEmail(email)
    .then(()=> showToast("Reset email sent"))
    .catch(err=> showToast(err.message));
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", ()=>{
  firebase.auth().signOut().then(()=> showToast("Logged out!"));
});

// Toast function
function showToast(msg){
  let toast=document.createElement("div");
  toast.className="toast show";
  toast.innerText=msg;
  document.body.appendChild(toast);
  setTimeout(()=> toast.remove(),3000);
}

// Sidebar toggle
document.addEventListener("DOMContentLoaded", ()=>{
  const hb=document.querySelector(".hamburger");
  const sb=document.querySelector(".sidebar");
  if(hb){ hb.addEventListener("click", ()=> sb.classList.toggle("active")); }
  AOS.init();
});
