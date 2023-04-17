const form = document.getElementById("login");
const error = document.getElementById("error-message");

form.addEventListener("submit", function(event){
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    fetch("http://localhost:5678/api/users/login" , {
        method : "POST" , 
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            email : email,
            password : password
        })
    })
    .then(function(reponse) {
        return reponse.json();
      })
      .then(function(user) {
        if (user.token) {
          localStorage.setItem("token", user.token);
          window.location.href = "index.html";
        } else {
          error.textContent = "Email ou mot de passe incorrect";
        }
      });
    });