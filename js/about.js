document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    handleScrollAnimation();
    
    // Initialize water animation in hero section
    initWaterAnimation();
});

// Handle scroll animations for elements with animate-on-scroll class
function handleScrollAnimation() {
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

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

// Initialize water animation in hero section
function initWaterAnimation() {
    const waterAnimation = document.querySelector('.water-animation');
    if (!waterAnimation) return;

    // Create water droplets
    for (let i = 0; i < 20; i++) {
        const droplet = document.createElement('div');
        droplet.className = 'water-droplet';
        droplet.style.left = `${Math.random() * 100}%`;
        droplet.style.animationDelay = `${Math.random() * 2}s`;
        waterAnimation.appendChild(droplet);
    }
}

// Add smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}); 