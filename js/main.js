// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeMainFunctionality();
});

// Initialize all main functionality
function initializeMainFunctionality() {
    initializeSmoothScrolling();
    initializeAnimations();
    initializeContactForm();
    initializeNavigation();
    initializeHeroButton();
    initializeLazyLoading();
    initializeKeyboardNavigation();
    initializePerformanceOptimizations();
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize scroll animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.product-card, .review-card, .feature, .contact-item'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name') || this.querySelector('input[type="text"]').value;
            const email = formData.get('email') || this.querySelector('input[type="email"]').value;
            const message = formData.get('message') || this.querySelector('textarea').value;
            
            // Validate form
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Create WhatsApp message
            const whatsappMessage = createContactWhatsAppMessage(name, email, message);
            const whatsappUrl = `https://wa.me/2347056599602?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            // Reset form
            this.reset();
            showNotification('Message sent via WhatsApp!', 'success');
        });
    }
}

// Create contact WhatsApp message
function createContactWhatsAppMessage(name, email, message) {
    let whatsappMessage = `💜 *Contact Message - Hooked by Lulu* 💜\n\n`;
    whatsappMessage += `👤 *From:* ${name}\n`;
    whatsappMessage += `📧 *Email:* ${email}\n\n`;
    whatsappMessage += `💬 *Message:*\n${message}\n\n`;
    whatsappMessage += `📅 *Date:* ${new Date().toLocaleDateString('en-GB')}\n`;
    whatsappMessage += `🕐 *Time:* ${new Date().toLocaleTimeString('en-GB')}`;
    
    return whatsappMessage;
}

// Navigation functionality
function initializeNavigation() {
    const nav = document.querySelector('nav');
    let lastScrollY = window.scrollY;
    
    // Hide/show navigation on scroll
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Add scroll effect to navigation
    nav.style.transition = 'transform 0.3s ease';
    
    // Add active section highlighting
    highlightActiveSection();
}

// Highlight active navigation section
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Hero button functionality
function initializeHeroButton() {
    const heroBtn = document.querySelector('.hero-btn');
    
    if (heroBtn) {
        heroBtn.addEventListener('click', function() {
            // Scroll to products section
            const productsSection = document.querySelector('.products-section');
            if (productsSection) {
                productsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Add ripple effect
            createRippleEffect(this, event);
        });
    }
}

// Create ripple effect for buttons
function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add ripple animation CSS if not exists
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Lazy loading for images and content
function initializeLazyLoading() {
    // Lazy load product cards
    const productCards = document.querySelectorAll('.product-card');
    
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                lazyLoadObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    productCards.forEach(card => {
        lazyLoadObserver.observe(card);
    });
}

// Keyboard navigation support
function initializeKeyboardNavigation() {
    // Add keyboard support for buttons and interactive elements
    document.addEventListener('keydown', function(e) {
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Enter key for buttons
        if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
            e.target.click();
        }
        
        // Escape key to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add focus styles for keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid #7c3aed !important;
            outline-offset: 2px !important;
        }
        
        .keyboard-navigation button:focus,
        .keyboard-navigation input:focus,
        .keyboard-navigation textarea:focus,
        .keyboard-navigation select:focus {
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.3) !important;
        }
    `;
    document.head.appendChild(style);
}

// Close all modals
function closeAllModals() {
    closeCart();
    closeCheckout();
}

// Performance optimizations
function initializePerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 16); // ~60fps
    });
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Optimize images
    optimizeImages();
}

// Preload critical resources
function preloadCriticalResources() {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
}

// Optimize images (placeholder for future image optimization)
function optimizeImages() {
    // This would handle image optimization in a real implementation
    // For now, we're using SVGs and emojis which are already optimized
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add loading states for better UX
function showLoadingState(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
    
    const loader = document.createElement('div');
    loader.className = 'loading-spinner';
    loader.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        border: 2px solid #e5e7eb;
        border-top: 2px solid #7c3aed;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    element.style.position = 'relative';
    element.appendChild(loader);
    
    // Add spin animation if not exists
    if (!document.querySelector('#spin-animation')) {
        const style = document.createElement('style');
        style.id = 'spin-animation';
        style.textContent = `
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Remove loading state
function hideLoadingState(element) {
    element.style.opacity = '';
    element.style.pointerEvents = '';
    
    const loader = element.querySelector('.loading-spinner');
    if (loader) {
        loader.remove();
    }
}

// Add error handling for failed operations
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('Something went wrong. Please try again.', 'error');
});

// Add unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('Something went wrong. Please try again.', 'error');
});

// Export utility functions for global access
window.createRippleEffect = createRippleEffect;
window.showLoadingState = showLoadingState;
window.hideLoadingState = hideLoadingState;
window.isInViewport = isInViewport;

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMainFunctionality);
} else {
    initializeMainFunctionality();
}