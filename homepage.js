const entries = document.getElementById ("entries");
entries.textContent = "entries";

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    console.log("logoutButton:", logoutButton); // Debugging line

    if (logoutButton) {
        logoutButton.addEventListener("click", (event) => {
            event.preventDefault();

            axios.post('https://tunga-c3-diaryapi.onrender.com/api/cohort3-fullstack/auth/logout')
                .then(function (response) { 
                    console.log('Logout Successful:', response.data);
                    // Redirect to login page after logout
                    window.location.href = '/loginpage.html';
                })
                .catch(function (error) { 
                    console.error('Logout Error:', error);
                    alert('Logout failed. Please try again.');
                });
        });
    } else {
        console.warn('Logout button not found in the DOM.');
    }
});

const authToken = localStorage.getItem('authToken');
console.log("authToken:", authToken); // Debugging line

const authorization = { Authorization: `Bearer ${authToken}` };

// Set default Authorization header for all Axios requests
axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

// window.onload = function() { 
//     // URL of the API endpoint 
//     const apiUrl = 'https://tunga-c3-diaryapi.onrender.com/api/cohort3-fullstack/diary/entries'; 
//     // Fetch data using Axios 
//     axios.get(apiUrl)
//         .then(function(response) { 
//             // Handle success 
//             const data = response.data.data; 
//             console.log(data.data);
//             const dataContainer = document.getElementById('entries'); 

//             if (!dataContainer) {
//                 console.error('Data container element not found.');
//                 return;
//             }

//             // Clear previous data to prevent duplicates
//             dataContainer.innerHTML = '';

//             // Display the data 
//             data.forEach(item => { 
//                 const div = document.createElement('div'); 
//                 div.innerHTML = `<h2>${item.title}</h2><p>${item.content}</p>`; 
//                 dataContainer.appendChild(div); 
//             }); 
//         }) 
//         .catch(function(error) { 
//             // Handle error 
//             if (error.response && error.response.status === 429) {
//                 console.error('Error fetching data: Too Many Requests (429). Please try again later.');
//                 alert('Too many requests. Please wait a while before trying again.');
//             } else {
//                 console.error('Error fetching data:', error);
//                 alert('An error occurred while fetching data. Please try again.');
//             }
//         }); 
// };

//Diary loading
// login.js using async/await

document.addEventListener("DOMContentLoaded", () => {
    console.log("Login Script Loaded");

    const title = document.getElementById("title");
    const content = document.getElementById("content");
    const diaryButton = document.getElementById("diaryButton");
    const diaryForm = document.getElementById("diaryForm");

    if (diaryForm && diaryButton) {
        diaryForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Input Validation (same as before)
            // ...

            const data = { title: title.value, content: content.value }; 
            console.log("Login Data:", data);

            try {
                const response = await axios.post('https://tunga-c3-diaryapi.onrender.com/api/cohort3-fullstack/diary/create', data);
                console.log('Success:', response.data);
                
                // if (response.data.token) {
                //     localStorage.setItem('authToken', response.data.token);
                //     window.location.href = '/homepage.html';
                // } else {
                //     alert('Login failed: No token received.');
                // }
            } catch (error) {
                console.error('Error:', error);
                if (error.response && error.response.data && error.response.data.message) {
                    alert('Login failed: ' + error.response.data.message);
                } else {
                    alert('An unexpected error occurred during login.');
                }
            }

            console.log(`Attempted login as ${title.value}`);
        });
    } else {
        console.error('Login form or login button not found in the DOM.');
    }
});

window.onload = function () {
    // URL of the API endpoint
    const apiUrl = 'https://tunga-c3-diaryapi.onrender.com/api/cohort3-fullstack/diary/entries';
    
    // Fetch data using Axios
    axios.get(apiUrl)
        .then(function (response) {
            // Handle success
            const data = response.data.data;
            const dataContainer = document.getElementById('entries');
            
            if (!dataContainer) {
                console.error('Data container element not found.');
                return;
            }
            
            // Clear previous data to prevent duplicates
            dataContainer.innerHTML = '';
            
            // Check if data is an array
            if (!Array.isArray(data)) {
                console.error('Expected data to be an array, but got:', typeof data);
                alert('Unexpected data format received from the server.');
                return;
            }
            
            // Display the data with delete buttons
            data.forEach(item => {
                // Ensure the item has an ID property
                const diaryId = item._id || item.id; // Adjust based on your API's response structure
                if (!diaryId) {
                    console.warn('Diary entry missing ID:', item);
                    return; // Skip entries without an ID
                }
                
                const entryDiv = document.createElement('div');
                entryDiv.innerHTML = `
                    <h2>${sanitizeHTML(item.title)}</h2>
                    <p>${sanitizeHTML(item.content)}</p>
                    <button class="delete-btn" data-id="${diaryId}">Delete</button>
                `;
                dataContainer.appendChild(entryDiv);
            });
            
            // Add event listeners for delete buttons
            const deleteButtons = document.querySelectorAll('.delete-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const diaryId = this.getAttribute('data-id');
                    if (!diaryId) {
                        console.error('Delete button clicked without a valid diary ID.');
                        alert('Cannot delete entry: Invalid diary ID.');
                        return;
                    }
                    // Optional: Confirm deletion with the user
                    if (confirm('Are you sure you want to delete this diary entry?')) {
                        deleteDiary(diaryId);
                    }
                });
            });
        })
        .catch(function (error) {
            // Handle error
            if (error.response && error.response.status === 429) {
                console.error('Error fetching data: Too Many Requests (429). Please try again later.');
                alert('Too many requests. Please wait a while before trying again.');
            } else {
                console.error('Error fetching data:', error);
                alert('An error occurred while fetching data. Please try again.');
            }
        });
};

// Function to sanitize HTML to prevent XSS attacks
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Function to delete a diary entry
function deleteDiary(diaryId) {
    if (!diaryId) {
        console.error("deleteDiary called without a valid diaryId.");
        alert("Cannot delete diary: Invalid ID.");
        return;
    }

    const deleteUrl = `https://tunga-c3-diaryapi.onrender.com/api/cohort3-fullstack/diary/delete/${encodeURIComponent(diaryId)}`;
    
    console.log(`Attempting to delete diary with ID: ${diaryId}`);
    
    axios.delete(deleteUrl)
        .then(response => {
            console.log("Diary deleted successfully!", response);
            alert("Diary deleted successfully!");
            // Optionally, remove the deleted entry from the DOM without reloading
            // location.reload(); // Reload the page to update the entries
            removeDiaryFromDOM(diaryId);
        })
        .catch(error => {
            console.error("Error deleting diary:", error);
            if (error.response && error.response.status === 404) {
                alert("Diary entry not found. It might have already been deleted.");
            } else if (error.response && error.response.status === 500) {
                alert("Server error occurred while deleting the diary. Please try again later.");
            } else {
                alert("Failed to delete diary. Please try again.");
            }
        });
}

// Optional: Function to remove the diary entry from the DOM without reloading
function removeDiaryFromDOM(diaryId) {
    const deleteButton = document.querySelector(`.delete-btn[data-id="${diaryId}"]`);
    if (deleteButton) {
        const entryDiv = deleteButton.parentElement;
        if (entryDiv) {
            entryDiv.remove();
            console.log(`Diary entry with ID ${diaryId} removed from the DOM.`);
        }
    }
}



// document.getElementById ("deleteDiary").addEventListener ("click", () => {
//     axios.delete(`https://tunga-c3-diaryapi.onrender.com/api/cohort3-fullstack/diary/delete/${"67840987afbd9b4bbf4e61d2"}`)
//        .then(response => {
//             console.log("Diary deleted successfully!");
//             window.location.href = "/homepage.html";
//         })
//        .catch(error => {
//             console.error("Error deleting diary:", error);
//             alert("Failed to delete diary. Please try again.");
//         });
// });