// js/auth.js
const auth = firebase.auth();

function signup(username, email, password, confirm) {
  if (password !== confirm) return alert("Passwords do not match!");
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      user.updateProfile({ displayName: username });
      sendVerification();
    })
    .catch(err => alert(err.message));
}

function sendVerification() {
  const user = auth.currentUser;
  user.sendEmailVerification().then(() => {
    alert("Verification email sent! Check your inbox.");
  });
}

function login(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      if (!userCredential.user.emailVerified) {
        alert("Please verify your email first!");
        auth.signOut();
      } else {
        window.location.href = "index.html";
      }
    })
    .catch(err => alert(err.message));
}

function logout() {
  auth.signOut().then(() => window.location.href = "login.html");
}
