import { backendUrl } from "./config.js";


document.addEventListener("DOMContentLoaded", function() {

      if (localStorage.getItem("isLogged")) {
        const logoutButton = document.createElement('button');
        logoutButton.innerText = 'Logout';
        logoutButton.id = 'logout-btn';
        logoutButton.style.position = 'absolute';
        logoutButton.style.top = '20px';   // Distance from the top of the page
        logoutButton.style.right = '20px'; // Distance from the right of the page
        logoutButton.style.padding = '10px 20px';
        logoutButton.style.cursor = 'pointer';
        logoutButton.style.fontSize = '16px';
        logoutButton.style.background = 'linear-gradient(to bottom, #f44336,rgb(155, 17, 17))'; // Red background
        logoutButton.style.color = 'white';
        logoutButton.style.border = 'none';
        logoutButton.style.borderRadius = '10px';
        logoutButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.43)';
        
        console.log("hello from logout script")
        const logoutContainer = document.createElement('div');
        logoutContainer.appendChild(logoutButton);
        document.body.appendChild(logoutContainer)
    
        logoutButton.addEventListener('mouseover', () => {
          logoutButton.style.background = 'linear-gradient(to bottom,rgb(252, 48, 33),rgb(102, 3, 3))';
        });
        
        logoutButton.addEventListener('mouseout', () => {
          logoutButton.style.background = 'linear-gradient(to bottom, #f44336,rgb(155, 17, 17))';
        });
      
        logoutButton.addEventListener('click', async () => {
          try {
          
            const response = await fetch(`${backendUrl}/user/logout`, {
              method: 'POST',
              credentials: 'include', 
            });
    
            if (response.ok) {

              // Clear the JWT from the localStorage or cookies manually
              // clear whole local storage where the access_token is
              localStorage.clear();

              console.log(document.cookie)
              alert('Logged out successfully!');
              
              window.location.href = '/views/ModList.html';  
            } else {
              alert('Error logging out. Please try again.');
              console.log(document.cookie)
            }
          } catch (error) {
            console.error('Error during logout:', error);
            alert('An error occurred during logout. Please try again.');
          }
        });
      }
})