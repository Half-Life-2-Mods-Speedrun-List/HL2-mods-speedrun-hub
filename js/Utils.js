
const timeout = (context) => {
    const successDiv = document.createElement("div")
          successDiv.textContent= context +" successfull"
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


export { timeout, }