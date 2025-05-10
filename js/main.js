// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const soundToggle = document.querySelector('.sound-toggle');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const cartCount = document.querySelector('.cart-count');

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Sound Management
let ambientSound = null;

function initSound() {
    ambientSound = new Audio('assets/sounds/water-ambient.mp3');
    ambientSound.loop = true;
    ambientSound.volume = 0.3;
}

function toggleSound() {
    const icon = soundToggle.querySelector('i');
    
    if (ambientSound.paused) {
        ambientSound.play();
        icon.className = 'fas fa-volume-up';
    } else {
        ambientSound.pause();
        icon.className = 'fas fa-volume-mute';
    }
}

// Mobile Menu
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
}

// Cart Management
function updateCartCount(count) {
    cartCount.textContent = count;
    localStorage.setItem('cartCount', count);
}

function initCart() {
    const savedCount = localStorage.getItem('cartCount') || '0';
    updateCartCount(savedCount);
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSound();
    initCart();
    
    themeToggle.addEventListener('click', toggleTheme);
    soundToggle.addEventListener('click', toggleSound);
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
                showNotification('Please fill in all required fields');
            }
        });
    });
});

// Accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
}); 