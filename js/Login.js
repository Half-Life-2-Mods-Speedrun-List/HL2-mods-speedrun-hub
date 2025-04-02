import { timeout } from "./Utils.js"

document.getElementById("loginForm").addEventListener("submit", async function(event) {
  event.preventDefault(); 

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  try {
      const response = await fetch("http://127.0.0.1:3001/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Include cookies in the request
          body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        timeout("Login")
      } else {
          alert("Login failed: " + result.message);
      }
  } catch (error) {
      console.error("Error:", error);
  }
});

