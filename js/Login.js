import { timeout } from "./Utils.js"
// const backendUrl = "http://localhost:3001"
const backendUrl = "https://hl2-speedrunhub-backend.onrender.com/"

document.getElementById("loginForm").addEventListener("submit", async function(event) {
  event.preventDefault(); 

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  try {
      const response = await fetch(backendUrl + "/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Include cookies in the request
          body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        // save token and userId to localStorage
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("userId", result.user_id);
        localStorage.setItem("isLogged", true);
        timeout("Login")
      } else {
          alert("Login failed: " + result.message);
      }
  } catch (error) {
      console.error("Error:", error);
  }
});

