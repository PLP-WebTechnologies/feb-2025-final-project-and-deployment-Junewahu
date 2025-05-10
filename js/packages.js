// Package data
const packages = [
    {
        id: 'hydralite',
        name: 'HydraLite',
        category: 'basic',
        price: 500,
        description: 'Oral hydration + electrolytes (ORS, beef broth optional). Ideal for mild hangovers and fatigue.',
        features: ['Oral Hydration', 'Electrolytes (ORS)', 'Optional Beef Broth', '30 min duration'],
        image: 'assets/images/packages/hydralite.jpg'
    },
    {
        id: 'hangover-halt',
        name: 'Hangover Halt',
        category: 'tier1',
        price: 1000,
        description: 'IV hydration (500ml Normal Saline) + anti-nausea meds (Ondansetron/Promethazine). For light hangovers.',
        features: ['IV Hydration (500ml)', 'Anti-nausea Meds', 'Normal Saline', '45-60 min duration'],
        image: 'assets/images/packages/hangover-halt.jpg'
    },
    {
        id: 'relief-rush',
        name: 'Relief Rush',
        category: 'tier2',
        price: 2000,
        description: 'IV hydration + anti-nausea + pain relief (Diclofenac/Paracetamol). For moderate hangovers with aches.',
        features: ['IV Hydration', 'Anti-nausea Meds', 'Pain Relief', '60-75 min duration'],
        image: 'assets/images/packages/relief-rush.jpg'
    },
    {
        id: 'recovery-max',
        name: 'Recovery Max',
        category: 'tier3',
        price: 3500,
        description: 'IV hydration (500ml Lactated Ringer\'s) + anti-nausea + pain relief + oral vitamins (B1, B6, C). For severe cases.',
        features: ['IV Hydration (500ml)', 'Anti-nausea Meds', 'Pain Relief', 'Oral Vitamins', '75-90 min duration'],
        image: 'assets/images/packages/recovery-max.jpg'
    },
    {
        id: 'revive-elite',
        name: 'Revive Elite',
        category: 'vip',
        price: 5000,
        description: 'Full reboot: 1000ml Dextrose/Saline + anti-nausea + pain relief + IV & oral vitamins (B1, B6, B12, C).',
        features: ['IV Hydration (1000ml)', 'Anti-nausea Meds', 'Pain Relief', 'IV & Oral Vitamins', '90-120 min duration'],
        image: 'assets/images/packages/revive-elite.jpg'
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.setAttribute('aria-label', `${totalItems} items in cart`);
}

function addToCart(itemId, itemName, price) {
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: itemId,
            name: itemName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${itemName} added to cart`);
}

// Package rendering
function renderPackages(filter = 'all') {
    const packageGrid = document.querySelector('.package-grid');
    if (!packageGrid) return;

    const filteredPackages = filter === 'all' 
        ? packages 
        : packages.filter(pkg => pkg.category === filter);
    
    packageGrid.innerHTML = filteredPackages.map(pkg => `
        <div class="package-card animate-on-scroll" 
             data-category="${pkg.category}"
             data-item="${pkg.id}"
             data-name="${pkg.name}"
             data-price="${pkg.price}"
             role="button"
             tabindex="0"
             aria-label="Add ${pkg.name} to cart">
            <div class="package-image">
                <img src="${pkg.image}" alt="${pkg.name} package" loading="lazy">
            </div>
            <div class="package-content">
                <h3 class="package-title">${pkg.name}</h3>
                <p class="package-price">KES ${pkg.price.toLocaleString()}</p>
                <p class="package-description">${pkg.description}</p>
                <ul class="package-features">
                    ${pkg.features.map(feature => `<li><i class="fas fa-check" aria-hidden="true"></i> ${feature}</li>`).join('')}
                </ul>
                <button class="add-to-cart-btn" 
                        data-item="${pkg.id}" 
                        data-name="${pkg.name}" 
                        data-price="${pkg.price}">
                    <i class="fas fa-plus" aria-hidden="true"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Filter functionality
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            // Filter packages
            const filter = button.dataset.filter;
            renderPackages(filter);
        });
    });
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderPackages();
    initFilters();
    updateCartCount();
    
    // Add to cart event delegation
    document.addEventListener('click', (e) => {
        const packageCard = e.target.closest('.package-card');
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        
        if (packageCard && !addToCartBtn) {
            const itemId = packageCard.dataset.item;
            const itemName = packageCard.dataset.name;
            const price = parseInt(packageCard.dataset.price);
            
            addToCart(itemId, itemName, price);
        } else if (addToCartBtn) {
            const itemId = addToCartBtn.dataset.item;
            const itemName = addToCartBtn.dataset.name;
            const price = parseInt(addToCartBtn.dataset.price);
            
            addToCart(itemId, itemName, price);
        }
    });
    
    // Keyboard accessibility for package cards
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const packageCard = e.target.closest('.package-card');
            if (packageCard) {
                e.preventDefault();
                const itemId = packageCard.dataset.item;
                const itemName = packageCard.dataset.name;
                const price = parseInt(packageCard.dataset.price);
                
                addToCart(itemId, itemName, price);
            }
        }
    });
    
    // Initialize scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}); 