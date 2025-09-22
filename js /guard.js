// js/guard.js
firebase.auth().onAuthStateChanged(user => {
  if (!user || !user.emailVerified) {
    window.location.href = "login.html";
  }
});
