// Cart functionality
let cart = [];
let cartTotal = 0;

// Initialize cart from localStorage
function initializeCart() {
    const savedCart = localStorage.getItem('hookedByLuluCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
        updateCartBadge();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('hookedByLuluCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(productElement) {
    const title = productElement.querySelector('.product-title').textContent;
    const priceText = productElement.querySelector('.product-price').textContent;
    const price = parseInt(priceText.replace(/[₦,]/g, ''));
    const button = productElement.querySelector('.add-to-cart');
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.title === title);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            title: title,
            price: price,
            quantity: 1
        });
    }
    
    // Update button appearance
    button.textContent = 'Added!';
    button.classList.add('added');
    
    // Reset button after 2 seconds
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.classList.remove('added');
    }, 2000);
    
    updateCartDisplay();
    updateCartBadge();
    saveCart();
    
    // Show success message
    showNotification('Item added to cart!', 'success');
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    updateCartBadge();
    saveCart();
    showNotification('Item removed from cart', 'info');
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartFooter = document.getElementById('cart-footer');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
            </div>
        `;
        cartFooter.style.display = 'none';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="cart-item-price">₦${(item.price * item.quantity).toLocaleString()}</span>
                <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
            </div>
        </div>
    `).join('');
    
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `₦${cartTotal.toLocaleString()}`;
    cartFooter.style.display = 'block';
}

// Toggle cart sidebar
function toggleCart() {
    const overlay = document.getElementById('cart-overlay');
    const sidebar = document.getElementById('cart-sidebar');
    
    overlay.classList.toggle('active');
    sidebar.classList.toggle('active');
    
    if (overlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close cart
function closeCart() {
    const overlay = document.getElementById('cart-overlay');
    const sidebar = document.getElementById('cart-sidebar');
    
    overlay.classList.remove('active');
    sidebar.classList.remove('active');
    document.body.style.overflow = '';
}

// Open checkout
function openCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    closeCart();
    
    // Populate checkout items
    populateCheckoutItems();
    
    // Show checkout page
    const checkoutPage = document.getElementById('checkout-page');
    checkoutPage.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close checkout
function closeCheckout() {
    const checkoutPage = document.getElementById('checkout-page');
    checkoutPage.classList.remove('active');
    document.body.style.overflow = '';
}

// Populate checkout items
function populateCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const totalElement = document.getElementById('checkout-total');
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="item-details">
                <h4>${item.title}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <span class="item-price">₦${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = parseInt(document.getElementById('checkout-delivery').textContent.replace(/[₦,]/g, ''));
    const total = subtotal + deliveryFee;
    
    subtotalElement.textContent = `₦${subtotal.toLocaleString()}`;
    totalElement.textContent = `₦${total.toLocaleString()}`;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#16a34a' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    
    // Add event listeners to all "Add to Cart" buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            addToCart(productCard);
        }
    });
    
    // Close cart when clicking overlay
    document.getElementById('cart-overlay').addEventListener('click', closeCart);
    
    // Close checkout when clicking outside
    document.getElementById('checkout-page').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCheckout();
        }
    });
    
    // Prevent checkout container clicks from closing the modal
    document.querySelector('.checkout-container').addEventListener('click', function(e) {
        e.stopPropagation();
    });
});