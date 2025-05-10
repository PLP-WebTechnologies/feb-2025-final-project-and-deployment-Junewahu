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
    ambientSound = new Audio('assets/sounds/ambient-water.mp3');
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

// Package Management
const packages = [
    {
        id: 'basic',
        name: 'HydraLite',
        price: 500,
        description: 'Oral hydration + electrolytes (ORS, optional beef broth)',
        image: 'assets/images/packages/hydralite.jpg'
    },
    {
        id: 'tier1',
        name: 'Hangover Halt',
        price: 1000,
        description: 'IV hydration (500ml Normal Saline) + anti-nausea meds (Ondansetron)',
        image: 'assets/images/packages/hangover-halt.jpg'
    },
    {
        id: 'tier2',
        name: 'Relief Rush',
        price: 2000,
        description: 'IV hydration + anti-nausea + pain relief (Diclofenac/Paracetamol)',
        image: 'assets/images/packages/relief-rush.jpg'
    },
    {
        id: 'tier3',
        name: 'Recovery Max',
        price: 3500,
        description: 'IV hydration + anti-nausea + pain relief + oral vitamins (B1, B6, C)',
        image: 'assets/images/packages/recovery-max.jpg'
    },
    {
        id: 'vip',
        name: 'Revive Elite',
        price: 5000,
        description: 'Full reboot: 1000ml Dextrose/Saline + meds + IV & oral vitamins',
        image: 'assets/images/packages/revive-elite.jpg'
    }
];

function createPackageCard(package) {
    return `
        <div class="package-card" data-id="${package.id}">
            <img src="${package.image}" alt="${package.name}" class="package-image">
            <h3>${package.name}</h3>
            <p class="price">KES ${package.price}</p>
            <p class="description">${package.description}</p>
            <button class="add-to-cart-btn" onclick="addToCart('${package.id}')">
                Add to Cart
            </button>
        </div>
    `;
}

function loadPackages() {
    const packageGrid = document.querySelector('.package-grid');
    if (packageGrid) {
        packageGrid.innerHTML = packages.map(createPackageCard).join('');
    }
}

// Cart Functions
function addToCart(packageId) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === packageId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const package = packages.find(p => p.id === packageId);
        cart.push({
            id: packageId,
            name: package.name,
            price: package.price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    
    // Show notification
    showNotification(`${package.name} added to cart!`);
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
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
    loadPackages();
    
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