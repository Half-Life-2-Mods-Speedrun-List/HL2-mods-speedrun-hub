const backendUrl = "http://localhost:3001"
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
      console.log
      document.getElementById("message").innerText = data.message;
      document.getElementById("message").style.color = "rgb(235,235,235)";

      if (response.ok) {
          console.log("A new mod created: " + mod_name, data);
      } else {
          console.error("Error:", data.message);
          document.getElementById("message").style.color = "red";
      }

    } catch (error) {
      console.error("Error:", error);
      document.getElementById("message").style.color = "red";
    }
  });