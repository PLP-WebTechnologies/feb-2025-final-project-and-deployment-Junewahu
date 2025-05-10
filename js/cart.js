// Cart Management
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.serviceFee = 500; // KES 500 service fee
        this.init();
    }

    init() {
        this.loadCart();
        this.updateCartCount();
        this.setupEventListeners();
    }

    loadCart() {
        const cartItemsList = document.getElementById('cartItemsList');
        const emptyCartMessage = document.querySelector('.empty-cart-message');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (this.cart.length === 0) {
            cartItemsList.innerHTML = '';
            emptyCartMessage.classList.remove('hidden');
            checkoutBtn.disabled = true;
            return;
        }

        emptyCartMessage.classList.add('hidden');
        checkoutBtn.disabled = false;

        cartItemsList.innerHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
        this.updateTotals();
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">KES ${item.price}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus" aria-label="Decrease quantity">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="10" aria-label="Item quantity">
                    <button class="quantity-btn plus" aria-label="Increase quantity">+</button>
                </div>
                <div class="item-total">
                    <p>KES ${item.price * item.quantity}</p>
                </div>
                <button class="remove-item" aria-label="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    updateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + this.serviceFee;

        document.getElementById('subtotal').textContent = `KES ${subtotal}`;
        document.getElementById('serviceFee').textContent = `KES ${this.serviceFee}`;
        document.getElementById('total').textContent = `KES ${total}`;
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    addToCart(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1
            });
        }

        this.saveCart();
        this.loadCart();
        this.showNotification(`${item.name} added to cart!`);
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.loadCart();
        this.showNotification('Item removed from cart');
    }

    updateQuantity(itemId, quantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = Math.max(1, Math.min(10, quantity));
            this.saveCart();
            this.loadCart();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.loadCart();
    }

    setupEventListeners() {
        const cartItemsList = document.getElementById('cartItemsList');
        const checkoutBtn = document.getElementById('checkoutBtn');

        // Handle quantity changes
        cartItemsList.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;

            const itemId = cartItem.dataset.id;
            const quantityInput = cartItem.querySelector('input[type="number"]');
            let quantity = parseInt(quantityInput.value);

            if (e.target.classList.contains('minus')) {
                quantity = Math.max(1, quantity - 1);
            } else if (e.target.classList.contains('plus')) {
                quantity = Math.min(10, quantity + 1);
            } else if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                this.removeFromCart(itemId);
                return;
            }

            quantityInput.value = quantity;
            this.updateQuantity(itemId, quantity);
        });

        // Handle manual quantity input
        cartItemsList.addEventListener('change', (e) => {
            if (e.target.matches('input[type="number"]')) {
                const cartItem = e.target.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                const quantity = parseInt(e.target.value);
                this.updateQuantity(itemId, quantity);
            }
        });

        // Handle checkout
        checkoutBtn.addEventListener('click', () => {
            if (this.cart.length > 0) {
                // Redirect to checkout page or show checkout modal
                window.location.href = 'checkout.html';
            }
        });
    }

    showNotification(message) {
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
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartManager();
}); 