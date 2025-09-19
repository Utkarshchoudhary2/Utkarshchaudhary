/* auth-client.js - include in login.html and signup.html */
// We use Firebase CDN (modular-compatible wrapper if present). Fallback to demo credentials.
async function doLogin(email,password,remember){
  try{
    if(window.firebaseConfig && window.firebaseConfig.apiKey && window.firebaseConfig.apiKey!=='YOUR_API_KEY' && window.firebase){ 
      // initialize firebase (assume firebase SDK loaded as 'firebase' global with compat)
      const app = firebase.initializeApp(window.firebaseConfig);
      const auth = firebase.getAuth ? firebase.getAuth(app) : firebase.auth();
      if(firebase.getAuth){
        const userCred = await firebase.signInWithEmailAndPassword(auth,email,password);
      } else {
        await firebase.auth().signInWithEmailAndPassword(email,password);
      }
      // persistence
      if(remember && firebase.setPersistence && firebase.browserLocalPersistence){
        try{ await firebase.setPersistence(auth, firebase.browserLocalPersistence); }catch(e){}
      }
      return true;
    } else {
      // demo fallback
      await demoSignIn(email,password,remember);
      return true;
    }
  }catch(err){
    throw err;
  }
}

async function doSignup(email,password,remember){
  try{
    if(window.firebaseConfig && window.firebaseConfig.apiKey && window.firebaseConfig.apiKey!=='YOUR_API_KEY' && window.firebase){ 
      const app = firebase.initializeApp(window.firebaseConfig);
      const auth = firebase.getAuth ? firebase.getAuth(app) : firebase.auth();
      if(firebase.createUserWithEmailAndPassword){
        await firebase.createUserWithEmailAndPassword(auth,email,password);
      } else {
        await firebase.auth().createUserWithEmailAndPassword(email,password);
      }
      // persistence
      return true;
    } else {
      // demo: accept signup but no persistence
      return true;
    }
  }catch(e){
    throw e;
  }
}
