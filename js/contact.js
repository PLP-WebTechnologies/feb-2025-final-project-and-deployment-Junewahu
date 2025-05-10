// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});

// Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', validateInput);
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput({ target: input })) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Here you would typically send the form data to your server
            showNotification('Message sent successfully!', 'success');
            form.reset();
        }
    });
});

function validateInput(e) {
    const input = e.target;
    const errorElement = document.getElementById(`${input.id}-error`);
    let isValid = true;
    let errorMessage = '';
    
    if (input.required && !input.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (input.type === 'tel' && input.value) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(input.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
    
    input.classList.toggle('invalid', !isValid);
    return isValid;
}

// Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});

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