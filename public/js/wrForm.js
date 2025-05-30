import { backendUrl } from "./config";

document.getElementById("wr-form").addEventListener("submit", async (event) => {
    event.preventDefault()

    const categoryId = getCategoryId()

    if (!categoryId) {
        alert("Category ID is missing.");
        return;
    }

    const data = {
        runnerName: document.getElementById("runnerName").value,
        recordTime: document.getElementById("recordTime").value,
        recordDate: document.getElementById("recordDate").value
    }

    if (!data.runnerName || !data.recordTime || !data.recordDate) {
        alert("Please fill all fields.");
        return;
    }

    console.log(JSON.stringify(data));
    console.log("Form data:", data);

    try {
        const response = await fetch(`${backendUrl}/add-world-record/${categoryId}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(data)
        });
  
        const result = await response.json();
  
        if (response.ok) {
            alert("World record added successfully!");
            console.log(result);
        } else {
            if (response.status === 401) {
                alert("Unauthorized access. Please log in.");
            } else {
            alert("Error adding world record.");
            console.error(result);
            }
        }
    } catch (error) {
        alert("Failed to submit the form.");
        console.error("Error:", error);
    }
});

function getCategoryId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('categoryId'); 
}

document.getElementById("backToModPage").addEventListener("click", () => {
    history.back()
});
