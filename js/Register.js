import { timeout } from "./Utils.js"
// const backendUrl = "http://localhost:3001"
const backendUrl = "https://hl2-speedrunhub-backend.onrender.com/"

document.getElementById("registerForm").addEventListener("submit", async function(event) {
  event.preventDefault(); 

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());
  const password = document.querySelector("input[name='password']").value;
  const confirmPassword = document.querySelector("input[name='confirmPassword']").value;
  const errorMessage = document.getElementById("passwordError");

  if (password !== confirmPassword) {
    errorMessage.textContent = "Passwords do not match.";
    errorMessage.style.fontSize = "1em";
    return;
} else {
    errorMessage.textContent = "";
    errorMessage.style.fontSize = "0em";
}

  try {
      const response = await fetch(backendUrl + "/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        timeout("Register")
      } else {
          alert("Register failed: " + result.message);
      }
  } catch (error) {
      console.error("Error:", error);
  }
});

