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