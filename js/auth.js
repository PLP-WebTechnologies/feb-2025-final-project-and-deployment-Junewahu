// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAuthUI();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const loginContent = document.getElementById('loginContent');
        const registerContent = document.getElementById('registerContent');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e.target);
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration(e.target);
            });
        }

        if (loginTab && registerTab) {
            loginTab.addEventListener('click', () => this.switchTab('login'));
            registerTab.addEventListener('click', () => this.switchTab('register'));
        }
    }

    switchTab(tab) {
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const loginContent = document.getElementById('loginContent');
        const registerContent = document.getElementById('registerContent');

        if (tab === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginContent.classList.remove('hidden');
            registerContent.classList.add('hidden');
        } else {
            loginTab.classList.remove('active');
            registerTab.classList.add('active');
            loginContent.classList.add('hidden');
            registerContent.classList.remove('hidden');
        }
    }

    async handleLogin(form) {
        const email = form.querySelector('[name="email"]').value;
        const password = form.querySelector('[name="password"]').value;
        const rememberMe = form.querySelector('[name="rememberMe"]').checked;

        try {
            // In a real application, this would be an API call
            const user = await this.mockLoginAPI(email, password);
            
            if (user) {
                this.setCurrentUser(user, rememberMe);
                this.showNotification('Login successful!');
                window.location.href = 'index.html';
            } else {
                this.showNotification('Invalid email or password', 'error');
            }
        } catch (error) {
            this.showNotification('An error occurred during login', 'error');
        }
    }

    async handleRegistration(form) {
        const fullName = form.querySelector('[name="fullName"]').value;
        const email = form.querySelector('[name="email"]').value;
        const phone = form.querySelector('[name="phone"]').value;
        const password = form.querySelector('[name="password"]').value;
        const confirmPassword = form.querySelector('[name="confirmPassword"]').value;
        const termsAgreed = form.querySelector('[name="termsAgreed"]').checked;

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (!termsAgreed) {
            this.showNotification('Please agree to the terms and conditions', 'error');
            return;
        }

        try {
            // In a real application, this would be an API call
            const user = await this.mockRegisterAPI(fullName, email, phone, password);
            
            if (user) {
                this.setCurrentUser(user, true);
                this.showNotification('Registration successful!');
                window.location.href = 'index.html';
            } else {
                this.showNotification('Registration failed', 'error');
            }
        } catch (error) {
            this.showNotification('An error occurred during registration', 'error');
        }
    }

    setCurrentUser(user, rememberMe) {
        this.currentUser = user;
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.updateAuthUI();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        this.updateAuthUI();
        window.location.href = 'index.html';
    }

    updateAuthUI() {
        const loginBtn = document.querySelector('.login-btn');
        const userMenu = document.querySelector('.user-menu');
        const userName = document.querySelector('.user-name');

        if (this.currentUser) {
            if (loginBtn) loginBtn.classList.add('hidden');
            if (userMenu) userMenu.classList.remove('hidden');
            if (userName) userName.textContent = this.currentUser.fullName;
        } else {
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
        }
    }

    // Mock API calls for demonstration
    async mockLoginAPI(email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock user data
        const mockUsers = [
            {
                id: 1,
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+254712345678',
                password: 'password123'
            }
        ];

        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    async mockRegisterAPI(fullName, email, phone, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock successful registration
        return {
            id: Date.now(),
            fullName,
            email,
            phone
        };
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.dataset.tab;
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show target form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetForm}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Password Visibility Toggle
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            
            // Update icon
            const icon = button.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    });

    // Form Validation
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Login Form Validation
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        let isValid = true;

        // Reset previous errors
        clearErrors();

        // Validate email
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (isValid) {
            // Here you would typically send the login request to your server
            showNotification('Logging in...', 'info');
            // Simulate API call
            setTimeout(() => {
                showNotification('Login successful!', 'success');
                window.location.href = 'index.html';
            }, 1500);
        }
    });

    // Registration Form Validation
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName');
        const email = document.getElementById('registerEmail');
        const phone = document.getElementById('registerPhone');
        const password = document.getElementById('registerPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        let isValid = true;

        // Reset previous errors
        clearErrors();

        // Validate name
        if (name.value.trim().length < 2) {
            showError(name, 'Name must be at least 2 characters');
            isValid = false;
        }

        // Validate email
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate phone
        if (!validatePhone(phone.value)) {
            showError(phone, 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate password
        if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        }

        // Validate password confirmation
        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }

        if (isValid) {
            // Here you would typically send the registration request to your server
            showNotification('Creating account...', 'info');
            // Simulate API call
            setTimeout(() => {
                showNotification('Account created successfully!', 'success');
                // Switch to login tab
                document.querySelector('[data-tab="login"]').click();
            }, 1500);
        }
    });

    // Validation Helper Functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^\+?[\d\s-]{10,}$/;
        return re.test(phone);
    }

    function showError(input, message) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
        input.classList.add('invalid');
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
        document.querySelectorAll('.invalid').forEach(input => {
            input.classList.remove('invalid');
        });
    }

    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger reflow
        notification.offsetHeight;
        
        // Add show class for animation
        notification.classList.add('show');
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Social Login Buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const provider = button.classList.contains('google') ? 'Google' : 'Facebook';
            showNotification(`Connecting to ${provider}...`, 'info');
            // Here you would typically implement social login
        });
    });
});

// Scroll Animation for Benefits Section
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    handleScrollAnimation();
}); 