// login.js using async/await

document.addEventListener("DOMContentLoaded", () => {
    console.log("Login Script Loaded");

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const loginbutton = document.getElementById("loginbutton");
    const loginForm = document.getElementById("loginForm");

    if (loginForm && loginbutton) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Input Validation (same as before)
            // ...

            const data = { email: email.value, password: password.value }; 
            console.log("Login Data:", data);

            try {
                const response = await axios.post('https://tunga-c3-diaryapi.onrender.com/api/cohort3-fullstack/auth/login', data);
                console.log('Success:', response.data);
                
                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                    window.location.href = '/homepage.html';
                } else {
                    alert('Login failed: No token received.');
                }
            } catch (error) {
                console.error('Error:', error);
                if (error.response && error.response.data && error.response.data.message) {
                    alert('Login failed: ' + error.response.data.message);
                } else {
                    alert('An unexpected error occurred during login.');
                }
            }
            console.log(`Attempted login as ${email.value}`);
        });
    } else {
        console.error('Login form or login button not found in the DOM.');
    }
});

// Show/Hide Password Functionality
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        // Toggle the type attribute
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle the eye / eye-slash icon
        togglePassword.classList.toggle('bx-show');
        togglePassword.classList.toggle('bx-hide');
    });
} else {
    console.error('Toggle password icon or password input not found in the DOM.');
}