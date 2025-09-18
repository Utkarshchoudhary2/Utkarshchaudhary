
function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if (email === "test@demo.com" && password === "123456") {
    alert("Demo login successful!");
    window.location.href = "index.html";
  } else {
    alert("Invalid login. Use test@demo.com / 123456 for demo.");
  }
}

function signup() {
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  if (email && password) {
    alert("Demo signup successful! You can now login.");
    window.location.href = "login.html";
  } else {
    alert("Please enter valid email and password.");
  }
}

function logout() {
  alert("Logged out!");
  window.location.href = "login.html";
}
