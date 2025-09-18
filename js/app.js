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
