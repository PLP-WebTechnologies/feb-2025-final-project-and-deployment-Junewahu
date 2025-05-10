// Add-ons Page Functionality

document.addEventListener('DOMContentLoaded', () => {
    // Initialize filters
    initFilters();
    
    // Initialize cart functionality
    initCart();
    
    // Initialize scroll animations
    initScrollAnimations();
});

// Filter functionality
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const addOnCards = document.querySelectorAll('.add-on-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Filter cards
            addOnCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                    // Add animation class
                    card.classList.add('animate-on-scroll');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('animate-on-scroll');
                }
            });
        });
    });
}

// Cart functionality
function initCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = {
                id: button.getAttribute('data-item'),
                name: button.getAttribute('data-name'),
                price: parseFloat(button.getAttribute('data-price')),
                quantity: 1
            };
            
            addToCart(item);
            showNotification(`${item.name} added to cart`);
        });
    });
}

// Add item to cart
function addToCart(item) {
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Show notification
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all add-on cards
    document.querySelectorAll('.add-on-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize cart count on page load
updateCartCount(); 