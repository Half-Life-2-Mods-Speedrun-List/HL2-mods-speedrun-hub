
const backendUrl = "http://localhost:3001"


function getModId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('modId');  
}

function getCategoryId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('categoryId'); 
}

function showUrlParams() {
    const modId = getModId();
    const categoryId = getCategoryId();
    console.log("Mod ID:", modId);  
    console.log("Category ID:", categoryId);  
}
showUrlParams();  

document.getElementById("wr-form").addEventListener("submit", async (event) => {
    event.preventDefault()

    const data = {
        runnerName: document.getElementById("runnerName").value,
        recordTime: document.getElementById("recordTime").value,
        recordDate: document.getElementById("recordDate").value, 
        categoryId: getCategoryId(),
        modId: getModId()
    }

    if (!data.runnerName || !data.recordTime || !data.recordDate) {
        alert("Please fill all fields.");
        return;
    }

    if (!data.categoryId || !data.modId) {
        alert("Category ID or Mod ID is missing.");
        return;
    }
    try {
        const response = await fetch(`${backendUrl}/add-world-record?category_id=${data.categoryId}&mod_id=${data.modId}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(data)
        });
  
        const result = await response.json();
  
        if (response.status === 200) {
            alert("World record added successfully!");
            console.log(result);
        } else {
            alert("Error adding world record.");
            console.error(result);
        }
    } catch (error) {
        alert("Failed to submit the form.");
        console.error("Error:", error);
    }
});

