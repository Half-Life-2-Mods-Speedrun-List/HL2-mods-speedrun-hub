import { timeout } from "./Utils.js"

document.getElementById("registerForm").addEventListener("submit", async function(event) {
  event.preventDefault(); 

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  try {
      const response = await fetch("http://127.0.0.1:3001/auth/register", {
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

