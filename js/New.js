document.getElementById("createMod").addEventListener("submit", async function(event) {
  event.preventDefault(); 
    const mod_name = document.getElementById("modName").value;

    try {
      const response = await fetch("http://localhost:3001/newmod/newmod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ mod_name })
      });

      const data = await response.json();
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