import { backendUrl, frontendUrl } from "./config.js";

document.getElementById("createMod").addEventListener("submit", async function(event) {
  event.preventDefault(); 
    const mod_name = document.getElementById("modName").value;
    console.log(mod_name)
    try {
      const response = await fetch(backendUrl + "/mods/newmod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" 
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify({mod_name: mod_name })
      });

      const data = await response.json();
      if (response.status === 401) {
        console.log("Unauthorized access. Please log in.");
        document.getElementById("message").innerText = "Unauthorized access. Please log in.";
      } else {
        document.getElementById("message").innerText = data.message;
      }
      document.getElementById("message").style.color = "rgb(235,235,235)";

    // appending modId to url and redirecting to ModPage.html  
      if (response.ok) {
          console.log("A new mod created: " + mod_name, data);
          let modId = data.mod_id
          let url = new URL(`${frontendUrl}/views/ModPage.html`)
          url.searchParams.append("id", modId)
          window.location.href = url.toString()
      } else {
          console.error("Error:", data.message);
          document.getElementById("message").style.color = "red";
      }

    } catch (error) {
      console.error("Error:", error);
      document.getElementById("message").style.color = "red";
    }
  });