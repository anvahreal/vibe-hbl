// Checkout functionality
let selectedDeliveryFee = 2000; // Default standard delivery

// Select delivery option
function selectDelivery(element, fee) {
    // Remove selected class from all options
    document.querySelectorAll('.delivery-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    element.classList.add('selected');
    
    // Update the radio button
    const radio = element.querySelector('input[type="radio"]');
    radio.checked = true;
    
    // Update delivery fee
    selectedDeliveryFee = fee;
    updateCheckoutTotal();
    
    // Show notification
    const deliveryType = radio.value;
    const deliveryNames = {
        'standard': 'Standard Delivery',
        'express': 'Express Delivery',
        'nationwide': 'Nationwide Delivery'
    };
    
    showNotification(`${deliveryNames[deliveryType]} selected`, 'success');
}

// Update checkout total
function updateCheckoutTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + selectedDeliveryFee;
    
    document.getElementById('checkout-delivery').textContent = `₦${selectedDeliveryFee.toLocaleString()}`;
    document.getElementById('checkout-total').textContent = `₦${total.toLocaleString()}`;
}

// Validate form
function validateCheckoutForm() {
    const form = document.getElementById('checkout-form');
    const requiredFields = form.querySelectorAll('input[required]');
    let isValid = true;
    const errors = [];
    
    requiredFields.forEach(field => {
        field.classList.remove('error');
        
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
            errors.push(`${field.previousElementSibling.textContent.replace(' *', '')} is required`);
        } else {
            // Specific validations
            if (field.type === 'email' && !isValidEmail(field.value)) {
                field.classList.add('error');
                isValid = false;
                errors.push('Please enter a valid email address');
            }
            
            if (field.type === 'tel' && !isValidPhone(field.value)) {
                field.classList.add('error');
                isValid = false;
                errors.push('Please enter a valid phone number');
            }
        }
    });
    
    return { isValid, errors };
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Format phone number
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('234')) {
        value = '+' + value;
    } else if (value.startsWith('0')) {
        value = '+234' + value.substring(1);
    } else if (!value.startsWith('+234')) {
        value = '+234' + value;
    }
    
    // Format as +234 XXX XXX XXXX
    if (value.length > 4) {
        value = value.substring(0, 4) + ' ' + value.substring(4);
    }
    if (value.length > 8) {
        value = value.substring(0, 8) + ' ' + value.substring(8);
    }
    if (value.length > 12) {
        value = value.substring(0, 12) + ' ' + value.substring(12, 16);
    }
    
    input.value = value;
}

// Place order
function placeOrder() {
    const validation = validateCheckoutForm();
    
    if (!validation.isValid) {
        showNotification(validation.errors[0], 'error');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Get form data
    const formData = getFormData();
    
    // Generate order summary
    const orderSummary = generateOrderSummary(formData);
    
    // Create WhatsApp message
    const whatsappMessage = createWhatsAppMessage(orderSummary);
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/2347056599602?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Show success message
    showNotification('Redirecting to WhatsApp...', 'success');
    
    // Clear cart after successful order
    setTimeout(() => {
        clearCart();
        closeCheckout();
        showNotification('Order sent! We\'ll contact you soon.', 'success');
    }, 2000);
}

// Get form data
function getFormData() {
    return {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        delivery: document.querySelector('input[name="delivery"]:checked').value
    };
}

// Generate order summary
function generateOrderSummary(formData) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + selectedDeliveryFee;
    
    const deliveryNames = {
        'standard': 'Standard Delivery (5-7 business days)',
        'express': 'Express Delivery (2-3 business days)',
        'nationwide': 'Nationwide Delivery (7-10 business days)'
    };
    
    return {
        orderNumber: generateOrderNumber(),
        customer: formData,
        items: cart,
        subtotal: subtotal,
        deliveryFee: selectedDeliveryFee,
        deliveryType: deliveryNames[formData.delivery],
        total: total,
        orderDate: new Date().toLocaleDateString('en-GB')
    };
}

// Generate order number
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `HBL${year}${month}${day}${random}`;
}

// Create WhatsApp message
function createWhatsAppMessage(orderSummary) {
    let message = `🧶 *NEW ORDER - Hooked by Lulu* 🧶\n\n`;
    message += `📋 *Order Details*\n`;
    message += `Order Number: ${orderSummary.orderNumber}\n`;
    message += `Date: ${orderSummary.orderDate}\n\n`;
    
    message += `👤 *Customer Information*\n`;
    message += `Name: ${orderSummary.customer.firstName} ${orderSummary.customer.lastName}\n`;
    message += `Email: ${orderSummary.customer.email}\n`;
    message += `Phone: ${orderSummary.customer.phone}\n`;
    message += `Address: ${orderSummary.customer.address}\n`;
    message += `City: ${orderSummary.customer.city}\n`;
    message += `State: ${orderSummary.customer.state}\n\n`;
    
    message += `🛍️ *Items Ordered*\n`;
    orderSummary.items.forEach((item, index) => {
        message += `${index + 1}. ${item.title}\n`;
        message += `   Quantity: ${item.quantity}\n`;
        message += `   Price: ₦${(item.price * item.quantity).toLocaleString()}\n\n`;
    });
    
    message += `💰 *Order Summary*\n`;
    message += `Subtotal: ₦${orderSummary.subtotal.toLocaleString()}\n`;
    message += `Delivery: ${orderSummary.deliveryType}\n`;
    message += `Delivery Fee: ₦${orderSummary.deliveryFee.toLocaleString()}\n`;
    message += `*Total: ₦${orderSummary.total.toLocaleString()}*\n\n`;
    
    if (orderSummary.customer.notes) {
        message += `📝 *Special Instructions*\n`;
        message += `${orderSummary.customer.notes}\n\n`;
    }
    
    message += `Thank you for choosing Hooked by Lulu! 💜\n`;
    message += `We'll confirm your order and provide payment details shortly.`;
    
    return message;
}

// Clear cart
function clearCart() {
    cart = [];
    updateCartDisplay();
    updateCartBadge();
    saveCart();
}

// Auto-fill form for testing (development only)
function autoFillForm() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1:5500') {
        document.getElementById('firstName').value = 'John';
        document.getElementById('lastName').value = 'Doe';
        document.getElementById('email').value = 'john.doe@example.com';
        document.getElementById('phone').value = '+234 801 234 5678';
        document.getElementById('address').value = '123 Main Street';
        document.getElementById('city').value = 'Lagos';
        document.getElementById('state').value = 'Lagos';
        document.getElementById('notes').value = 'Please handle with care';
    }
}

// Initialize checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Format phone number on input
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        
        // Set placeholder
        phoneInput.placeholder = '+234 801 234 5678';
    }
    
    // Add form validation on input
    const form = document.getElementById('checkout-form');
    if (form) {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error') && this.value.trim()) {
                    this.classList.remove('error');
                }
            });
        });
    }
    
    // Prevent form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            placeOrder();
        });
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key to close checkout
        if (e.key === 'Escape') {
            const checkoutPage = document.getElementById('checkout-page');
            if (checkoutPage && checkoutPage.classList.contains('active')) {
                closeCheckout();
            }
        }
        
        // Ctrl/Cmd + Enter to place order
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const checkoutPage = document.getElementById('checkout-page');
            if (checkoutPage && checkoutPage.classList.contains('active')) {
                placeOrder();
            }
        }
    });
    
    // Auto-fill form in development
    // autoFillForm();
});

// Export functions for global access
window.selectDelivery = selectDelivery;
window.placeOrder = placeOrder;