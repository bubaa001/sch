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
    }

    // Enhanced Flash Message System
    function showFlashMessage(message, category = 'info') {
        // Create or get flash container
        let flashContainer = document.getElementById('flash-messages-container');
        if (!flashContainer) {
            flashContainer = document.createElement('div');
            flashContainer.id = 'flash-messages-container';
            flashContainer.className = 'position-fixed top-0 start-50 translate-middle-x mt-3 z-3';
            flashContainer.style.zIndex = '1055';
            document.body.appendChild(flashContainer);
        }

        // Create message element
        const messageId = 'flash-' + Date.now();
        const flashMessage = document.createElement('div');
        flashMessage.id = messageId;
        flashMessage.className = `alert alert-${category} alert-dismissible fade show`;
        flashMessage.style.minWidth = '300px';
        flashMessage.style.maxWidth = '500px';
        flashMessage.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Add to container
        flashContainer.appendChild(flashMessage);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            const element = document.getElementById(messageId);
            if (element && element.parentElement) {
                element.remove();
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
                
                // Show the flash message - use message and category directly
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

    // Initialize all forms with data-ajax attribute
    document.addEventListener('DOMContentLoaded', function() {
        // Ensure flash container exists
        let flashContainer = document.getElementById('flash-messages-container');
        if (!flashContainer) {
            flashContainer = document.createElement('div');
            flashContainer.id = 'flash-messages-container';
            flashContainer.className = 'position-fixed top-0 start-50 translate-middle-x mt-3 z-3';
            flashContainer.style.zIndex = '1055';
            document.body.appendChild(flashContainer);
        }

        // Initialize AJAX forms
        const ajaxForms = document.querySelectorAll('form[data-ajax="true"]');
        ajaxForms.forEach(form => {
            handleFormSubmission(form);
        });
    });
});