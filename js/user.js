class User {
    constructor() {
        this.apiUrl = "https://dummyjson.com/";
    }

    getAccountInfo(user) {
        console.log(user);
        document.getElementById("username").value = user.username;
        document.getElementById("fname").value = user.firstName;
        document.getElementById("lname").value = user.lastName;
        document.getElementById("phone").value = user.phone;
        document.getElementById("email").value = user.email;
        document.getElementById("address").value = user.address.address;
        document.getElementById("city").value = user.address.city;
    }

    doLogin(username, password) {
        localStorage.clear();
        const users = this.getAllUsers();
        let user = null;

        // Check in local storage first
        users.forEach(u => {
            if (u.username === username && u.password === password) {
                user = u;
            }
        });

        if (user) {
            // If user is found in local storage
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "/index.html";
        } else {
            // If user is not found in local storage, check the JSON file
            fetch(this.apiUrl + "users")
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    data.users.forEach(u => {
                        if (u.username === username && u.password === password) {
                            user = u;
                        }
                    });
                    if (user) {
                        localStorage.setItem("user", JSON.stringify(user));
                        window.location.href = "/index.html";
                    } else {
                        document.querySelector(".loginMsg").innerHTML = 
                            '<div class="alert alert-danger" role="alert">Your password or username is incorrect. Please try again.</div>';
                    }
                });
        }
    }

    checkLogoutPageAccess() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = '/login.html';
        }
    }

    logout() {
        localStorage.clear();
        window.location.href = '/logout.html';  
    }

    checkLogin() {
        const userAccount = JSON.parse(localStorage.getItem('user'));
        if (userAccount) {
            this.getAccountInfo(userAccount);
        } else {
            window.location.href = 'login.html';
        }
    }

    // Function to get all users from local storage
    getAllUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    // Function to save a user to local storage
    saveUser(user) {
        const users = this.getAllUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Function to update a user in local storage
    updateUser(updatedUser) {
        const users = this.getAllUsers();
        const index = users.findIndex(user => user.username === updatedUser.username);
        if (index !== -1) {
            // Preserve the existing password if it's not provided in the updatedUser object
            const existingUser = users[index];
            updatedUser.password = existingUser.password;

            users[index] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Updated user:', updatedUser);
        }
    }

    // Function to delete a user from local storage
    deleteUser(username) {
        const users = this.getAllUsers();
        const updatedUsers = users.filter(user => user.username !== username);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    // Function to validate user input
    validateUserInput(user) {
        const { username, firstName, lastName, phone, email, address: { address, city } } = user;

        if (!username) return "Username is required.";
        if (!firstName) return "First name is required.";
        if (!lastName) return "Last name is required.";
        if (!phone || isNaN(phone)) return "Valid phone number is required.";
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) return "Valid email address is required.";
        if (!address) return "Street address is required.";
        if (!city) return "City is required.";

        return null;
    }
}




document.addEventListener('DOMContentLoaded', (event) => {
    const userClass = new User();

    // Check if the user is logged in
    userClass.checkLogin();

    // Handle account update form submission
    const updateAccountForm = document.querySelector('.updateAccount');
    if (updateAccountForm) {
        updateAccountForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the form from submitting the traditional way

            // Get the existing user data from local storage
            const existingUser = JSON.parse(localStorage.getItem('user'));

            // Gather updated user information from the form
            const updatedUser = {
                username: document.getElementById('username').value,
                firstName: document.getElementById('fname').value,
                lastName: document.getElementById('lname').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: {
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value
                },
                password: existingUser.password 
            };

            // Validate the input
            const validationError = userClass.validateUserInput(updatedUser);
            if (validationError) {
                alert(validationError);
                return;
            }

            // Update the user in local storage
            userClass.updateUser(updatedUser);

            // Update the current user in local storage
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Optionally, show a success message or perform other actions
            alert('Account updated successfully');
        });
    }

    // Handle login form submission
    const loginForm = document.querySelector('.login');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            userClass.doLogin(username, password);
        });
    }
}); 
