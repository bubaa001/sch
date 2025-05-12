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

    // Handle form submissions with AJAX
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Find the submit button within the form
            const submitButton = form.querySelector('button[type="submit"]');
            if (!submitButton) return;

            // Store the original button HTML and attributes
            const originalButtonHTML = submitButton.innerHTML;
            const originalDisabledState = submitButton.disabled;

            // Change button to loading state using Bootstrap spinner
            submitButton.disabled = true;
            submitButton.className = 'btn btn-primary disabled';
            submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Sending...
            `;

            const formData = new FormData(form);
            const action = form.action || window.location.href;
            const method = form.method.toUpperCase();

            try {
                const response = await fetch(action, {
                    method: method,
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                const result = await response.json();

                // Update flash messages
                const flashMessages = document.getElementById('flashMessages');
                if (flashMessages) {
                    flashMessages.innerHTML = `
                        <div class="alert alert-${result.category} alert-dismissible fade show" role="alert">
                            ${result.message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-hidden="true"></button>
                        </div>
                    `;
                }

                // Reset form if successful
                if (result.success) {
                    form.reset();
                }
            } catch (error) {
                console.error('Form submission error:', error);
                const flashMessages = document.getElementById('flashMessages');
                if (flashMessages) {
                    flashMessages.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            An error occurred. Please try again.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-hidden="true"></button>
                        </div>
                    `;
                }
            } finally {
                // Revert button to original state
                submitButton.disabled = originalDisabledState;
                submitButton.innerHTML = originalButtonHTML;
                submitButton.className = 'btn btn-primary';
            }
        });
    });

    // Debug Preloader
    console.log("Page loaded, checking preloader...");
});