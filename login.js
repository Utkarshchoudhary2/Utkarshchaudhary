document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if(email === "test@gmail.com" && password === "12345"){
        window.location.href = "index.html";
    } else {
        let msg = document.getElementById("error-msg");
        msg.innerText = "❌ Invalid Email or Password";
        msg.style.display = "block";
    }
});
