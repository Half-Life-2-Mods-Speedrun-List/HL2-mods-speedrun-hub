document.getElementById("loginForm").addEventListener("submit", async function(event) {
  event.preventDefault(); 

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  function timeout(){
    const successDiv = document.createElement("div")
          successDiv.textContent= "Login successfull"
          successDiv.style.position ="fixed";
          successDiv.style.top = "10%";
          successDiv.style.left = "50%";
          successDiv.style.transform = "translate(-50%, -50%)";
          successDiv.style.backgroundColor = "green";
          successDiv.style.color = "white";
          successDiv.style.padding = "20px";
          successDiv.style.borderRadius = "5px";
          successDiv.style.font = "24px"
          document.body.appendChild(successDiv)

          setTimeout(() => {
            window.location.href = "/views/Mods.html"; 
          }, 1500)
          
  }
  try {
      const response = await fetch("http://localhost:3001/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        timeout()
      } else {
          alert("Login failed: " + result.message);
      }
  } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
  }
});

document.getElementById("registerForm").addEventListener("submit", async function(event) {
  event.preventDefault(); 

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      document.getElementById("message").innerText = data.message;

      if (response.ok) {
          console.log("Registeration succesful");
      } else {
          console.error("Error:", data.message);
      }

    } catch (error) {
      console.error("Error:", error);
    }
  });