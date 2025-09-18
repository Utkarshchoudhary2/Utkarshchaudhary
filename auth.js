import { app } from "./firebase-config.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const auth = getAuth(app);

// Tab switching
document.addEventListener('DOMContentLoaded', () => {
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
  });

  signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
  });

  document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const errorEl = document.getElementById('loginError');

    if (!email || !password) {
      errorEl.textContent = "Please enter email and password";
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(userCred => {
        if (userCred.user.emailVerified) {
          window.location.href = "home.html";
        } else {
          errorEl.textContent = "Please verify your email before logging in.";
        }
      })
      .catch(err => errorEl.textContent = err.message);
  });

  document.getElementById('signupBtn').addEventListener('click', () => {
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirm = document.getElementById('signup-confirm').value.trim();
    const errorEl = document.getElementById('signupError');

    if (!fullname || !email || !password || !confirm) {
      errorEl.textContent = "All fields required";
      return;
    }
    if (password !== confirm) {
      errorEl.textContent = "Passwords do not match";
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCred => {
        return updateProfile(userCred.user, { displayName: fullname }).then(() => {
          return sendEmailVerification(userCred.user).then(() => {
            errorEl.style.color = "green";
            errorEl.textContent = "Signup successful! Check your email to verify.";
          });
        });
      })
      .catch(err => errorEl.textContent = err.message);
  });
});
