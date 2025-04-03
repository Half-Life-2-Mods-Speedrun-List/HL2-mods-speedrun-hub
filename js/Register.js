import { timeout } from "./Utils.js"
const backendUrl = "http://localhost:3001"
document.getElementById("registerForm").addEventListener("submit", async function(event) {
  event.preventDefault(); 

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

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

