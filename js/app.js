function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("show");
}

// Sign Up
function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      return user.updateProfile({ displayName: name });
    })
    .then(() => {
      alert("Account created! Please login.");
      window.location.href = "login.html";
    })
    .catch(error => alert(error.message));
}

// Login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = "index.html")
    .catch(error => alert(error.message));
}

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
  });
});

// Restrict Projects
document.querySelectorAll('a[href="projects.html"]').forEach(link => {
  link.addEventListener("click", (e) => {
    if (!firebase.auth().currentUser) {
      e.preventDefault();
      alert("Please login to view Projects!");
      window.location.href = "login.html";
    }
  });
});