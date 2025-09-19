// auth.js - simple wrapper for demo offline login.
// If Firebase config is provided and Firebase SDKs loaded, auth-client will attempt real auth.
async function demoSignInDirect(email,password,remember){
  if(email==='test@demo.com' && password==='123456'){
    if(remember) localStorage.setItem('demo_token','1'); else sessionStorage.setItem('demo_token','1');
    return true;
  }
  throw new Error('Invalid demo credentials');
}
