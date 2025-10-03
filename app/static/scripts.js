// Enhanced Flash Message System for Bottom Position
function showFlashMessage(message, category = 'info') {
    // Create or get flash container
    let flashContainer = document.getElementById('flash-messages-container');
    if (!flashContainer) {
        flashContainer = document.createElement('div');
        flashContainer.id = 'flash-messages-container';
        // Bottom positioning
        flashContainer.style.position = 'fixed';
        flashContainer.style.bottom = '20px';
        flashContainer.style.left = '50%';
        flashContainer.style.transform = 'translateX(-50%)';
        flashContainer.style.zIndex = '1060';
        flashContainer.style.width = 'auto';
        flashContainer.style.maxWidth = '90%';
        flashContainer.style.display = 'flex';
        flashContainer.style.flexDirection = 'column';
        flashContainer.style.alignItems = 'center';
        flashContainer.style.gap = '10px';
        document.body.appendChild(flashContainer);
    }

    // Create message element
    const messageId = 'flash-' + Date.now();
    const flashMessage = document.createElement('div');
    flashMessage.id = messageId;
    
    // Set colors based on category
    const colorConfig = {
        success: {
            bg: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
            color: '#155724',
            border: '#28a745'
        },
        danger: {
            bg: 'linear-gradient(135deg, #f8d7da 0%, #f1b0b7 100%)',
            color: '#721c24',
            border: '#dc3545'
        },
        warning: {
            bg: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
            color: '#856404',
            border: '#ffc107'
        },
        info: {
            bg: 'linear-gradient(135deg, #d1ecf1 0%, #b8e2e8 100%)',
            color: '#0c5460',
            border: '#17a2b8'
        },
        primary: {
            bg: 'linear-gradient(135deg, #cce7ff 0%, #b3d9ff 100%)',
            color: '#004085',
            border: '#007bff'
        }
    };
    
    const config = colorConfig[category] || colorConfig.info;
    
    // Apply styles
    flashMessage.style.cssText = `
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        border: none;
        border-radius: 12px;
        min-width: 320px;
        max-width: 500px;
        padding: 15px 20px;
        font-weight: 500;
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
        border-left: 5px solid ${config.border};
        transform-origin: center;
        animation: slideUpBounce 0.6s ease-out;
        background: ${config.bg};
        color: ${config.color};
    `;

    flashMessage.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close ms-2" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: currentColor; opacity: 0.3; animation: progressBar 5s linear forwards;"></div>
    `;
    
    // Add to container
    flashContainer.appendChild(flashMessage);
    
    // Auto remove after 5 seconds with cool exit animation
    setTimeout(() => {
        const element = document.getElementById(messageId);
        if (element && element.parentElement) {
            element.style.animation = 'slideDownFade 0.5s ease-in forwards';
            setTimeout(() => {
                if (element.parentElement) {
                    element.remove();
                }
            }, 500);
        }
    }, 5000);
}

// Enhanced form handler
function handleFormSubmission(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const originalContent = submitButton.innerHTML;
        const originalDisabled = submitButton.disabled;

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status"></span>
            Processing...
        `;

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const result = await response.json();
            
            // Show the flash message
            showFlashMessage(result.message, result.category || (result.success ? 'success' : 'danger'));

            // Reset form if successful
            if (result.success) {
                form.reset();
            }

        } catch (error) {
            console.error('Form submission error:', error);
            showFlashMessage('An error occurred. Please try again.', 'danger');
        } finally {
            // Restore button
            submitButton.disabled = originalDisabled;
            submitButton.innerHTML = originalContent;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.querySelector('.preloader');
    const content = document.getElementById('content');
    const body = document.body;
    
    // Immediately hide content
    if (content) content.style.display = 'none';
    
    // Start preloader animation
    if (preloader) {
        preloader.style.opacity = '1';
        
        // Handle page load completion with a fixed minimum display time
        const minDisplayTime = 500; // 0.5s minimum for all pages
        const handleLoadComplete = () => {
            const loadTime = performance.now();
            const remainingTime = Math.max(0, minDisplayTime - loadTime);
            
            setTimeout(() => {
                preloader.classList.add('hidden');
                
                setTimeout(() => {
                    preloader.style.display = 'none';
                    if (content) {
                        content.style.display = 'block';
                        content.classList.add('visible');
                    }
                    body.classList.add('loaded'); // Enable scrolling
                    initializePageFeatures();
                }, 500);
            }, remainingTime);
        };
        
        // Check if page is already loaded or handle load event
        if (document.readyState === 'complete') {
            handleLoadComplete();
        } else {
            window.addEventListener('load', handleLoadComplete);
        }
        
        // Fallback to show content after 5 seconds if load event fails
        setTimeout(() => {
            if (preloader.style.display !== 'none' && content) {
                console.warn('Preloader timeout reached, forcing content display');
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                    content.style.display = 'block';
                    content.classList.add('visible');
                    body.classList.add('loaded'); // Enable scrolling
                    initializePageFeatures();
                }, 500);
            }
        }, 5000);
    } else {
        // If no preloader, show content immediately and initialize features
        if (content) {
            content.style.display = 'block';
            content.classList.add('visible');
        }
        body.classList.add('loaded'); // Enable scrolling
        initializePageFeatures();
    }
    
    // Function to initialize all page features (AOS, counters, chatbot, etc.)
    function initializePageFeatures() {
        // Initialize AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true
            });
        } else {
            console.warn('AOS library not loaded');
        }
        
        // Initialize Vanilla Tilt for card hover effects
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.3
            });
        } else {
            console.warn('VanillaTilt library not loaded');
        }
        
        // Close navbar on link click (mobile)
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarToggler && navbarCollapse) {
            document.addEventListener('click', function(event) {
                if (navbarCollapse.classList.contains('show') && !navbarCollapse.contains(event.target) && !navbarToggler.contains(event.target)) {
                    navbarToggler.click();
                }
            });
        }
        
        // Animated Counter
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const updateCounter = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace('%', '');
                const increment = target / 200;
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment) + (counter.innerText.includes('%') ? '%' : '');
                    setTimeout(updateCounter, 20);
                } else {
                    counter.innerText = target + (counter.innerText.includes('%') ? '%' : '');
                }
            };
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            observer.observe(counter);
        });
        
        // Chatbot Toggle
        const chatbotToggle = document.querySelector('.chatbot-toggle');
        const chatbotBox = document.querySelector('.chatbot-box');
        const chatbotClose = document.querySelector('.chatbot-close');
        if (chatbotToggle && chatbotBox && chatbotClose) {
            chatbotToggle.addEventListener('click', () => {
                chatbotBox.classList.toggle('active');
            });
            chatbotClose.addEventListener('click', () => {
                chatbotBox.classList.remove('active');
            });
        }

        // Initialize AJAX forms
        const ajaxForms = document.querySelectorAll('form[data-ajax="true"]');
        ajaxForms.forEach(form => {
            handleFormSubmission(form);
        });
    }
});

// Add CSS animations to the page if they don't exist
function ensureFlashAnimations() {
    if (!document.getElementById('flash-animations')) {
        const style = document.createElement('style');
        style.id = 'flash-animations';
        style.textContent = `
            @keyframes slideUpBounce {
                0% {
                    transform: translate(-50%, 100px);
                    opacity: 0;
                    scale: 0.8;
                }
                60% {
                    transform: translate(-50%, -10px);
                    opacity: 1;
                    scale: 1.05;
                }
                80% {
                    transform: translate(-50%, 5px);
                    scale: 0.98;
                }
                100% {
                    transform: translate(-50%, 0);
                    opacity: 1;
                    scale: 1;
                }
            }
            
            @keyframes progressBar {
                0% {
                    width: 100%;
                }
                100% {
                    width: 0%;
                }
            }
            
            @keyframes slideDownFade {
                0% {
                    transform: translate(-50%, 0);
                    opacity: 1;
                    scale: 1;
                }
                100% {
                    transform: translate(-50%, 100px);
                    opacity: 0;
                    scale: 0.8;
                }
            }
            
            @media (max-width: 768px) {
                @keyframes slideUpBounce {
                    0% {
                        transform: translate(-50%, 100px);
                        opacity: 0;
                        scale: 0.8;
                    }
                    60% {
                        transform: translate(-50%, -5px);
                        opacity: 1;
                        scale: 1.03;
                    }
                    80% {
                        transform: translate(-50%, 2px);
                        scale: 0.99;
                    }
                    100% {
                        transform: translate(-50%, 0);
                        opacity: 1;
                        scale: 1;
                    }
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Ensure animations are available when the page loads
document.addEventListener('DOMContentLoaded', ensureFlashAnimations);