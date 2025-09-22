const auth = firebase.auth();
const protectedPages = [
  "index.html","about.html","projects.html",
  "resume.html","contact.html","game.html"
];

auth.onAuthStateChanged(user => {
  const page = location.pathname.split("/").pop();
  if (!user && protectedPages.includes(page)) {
    location.href = "login.html";
  }
});

function logout() {
  auth.signOut().then(()=>location.href="login.html");
}

