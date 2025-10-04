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
        width: 100%;
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
            console.log('AJAX submit for form', form.action, form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            let result = null;
            try {
                result = await response.json();
            } catch (jsonErr) {
                // Not JSON - log and create a fallback
                console.warn('Non-JSON response from', form.action, jsonErr);
                const text = await response.text().catch(() => '');
                result = { success: false, message: text || 'Unexpected server response', category: 'danger' };
            }

            console.log('AJAX response for', form.action, result);

            // Show the flash message
            if (result && result.message) {
                showFlashMessage(result.message, result.category || (result.success ? 'success' : 'info'));
            } else {
                showFlashMessage('No message returned from server.', 'warning');
            }

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
document.addEventListener('DOMContentLoaded', () => {
    console.log('ensureFlashAnimations is running');
    ensureFlashAnimations();
});

// Comprehensive AI Chatbot for FML School
class SchoolChatbot {
    constructor() {
        this.knowledgeBase = {
            // Admissions Information
            'admission': {
                keywords: ['admission', 'apply', 'enroll', 'application', 'register', 'join'],
                answer: `📚 <strong>Admission Process:</strong>

1. <strong>Online Application:</strong> Submit through our website
2. <strong>Required Documents:</strong>
   - Birth certificate
   - Previous school reports
   - Medical certificate
   - Parent/guardian ID
   - Transfer certificate (if applicable)
3. <strong>Application Fee:</strong> TZS 50,000
4. <strong>Assessment:</strong> Academic evaluation
5. <strong>Interview:</strong> Student and parent meeting
6. <strong>Registration:</strong> Final enrollment

<em>We accept students from Nursery to Form 6 levels.</em>`
            },

            'fees': {
                keywords: ['fee', 'fees', 'cost', 'price', 'payment', 'tuition'],
                answer: `💰 <strong>Fee Structure 2025:</strong>

• <strong>Form 1-2:</strong> TZS 1,200,000 per term
• <strong>Form 3-4:</strong> TZS 1,400,000 per term  
• <strong>Form 5-6:</strong> TZS 1,600,000 per term

<strong>What's Included:</strong>
✓ Tuition fees
✓ Meals and boarding
✓ Basic learning materials
✓ Sports facilities
✓ Library access

<strong>Additional Costs:</strong>
- Uniforms: TZS 150,000
- Textbooks: TZS 200,000 (annual)
- Examination fees: As per NECTA rates

<em>Payment plans and scholarships available for qualifying students.</em>`
            },

            'programs': {
                keywords: ['program', 'course', 'subject', 'curriculum', 'study'],
                answer: `🏫 <strong>Academic Programs:</strong>

<strong>Science Stream:</strong>
• Physics, Chemistry, Biology
• Advanced Mathematics
• Computer Studies

<strong>Arts Stream:</strong>
• History, Geography, Commerce
• English Language & Literature
• Kiswahili

<strong>Technical Subjects:</strong>
• Engineering Science
• Technical Drawing
• Information Technology

<strong>Extracurricular Activities:</strong>
🎵 Music & Choir
⚽ Sports (Football, Basketball, Athletics)
🎭 Drama & Cultural Activities
🔬 Science Club
💻 Computer Club
📚 Debate Society

<em>All programs follow Tanzanian National Curriculum with practical enhancements.</em>`
            },

            'location': {
                keywords: ['location', 'address', 'where', 'map', 'directions'],
                answer: `📍 <strong>School Location:</strong>

<strong>Francis Maria Libermann School</strong>
Shehia of Tomondo, Western District
Urban Western Region, Zanzibar
Tanzania

<strong>Distance:</strong> Just 5km from Stone Town
<strong>Accessibility:</strong> Easily accessible by public transport

<strong>Contact Information:</strong>
📞 Phone: +255 658 638 938 / +255 713 616 049
📧 Email: fmlibermann@gmail.com
📱 WhatsApp: <a href="https://wa.me/255658638938" target="_blank">Chat with us</a>

<em>We welcome visitors during school hours (7:00 AM - 4:00 PM).</em>`
            },

            'calendar': {
                keywords: ['calendar', 'term', 'holiday', 'schedule', 'dates'],
                answer: `📅 <strong>2025 Academic Calendar:</strong>

<strong>Term 1:</strong> January 15th - April 5th
• Mid-term break: February 20th-25th

<strong>Term 2:</strong> May 6th - August 15th  
• Mid-term break: June 20th-25th

<strong>Term 3:</strong> September 9th - November 29th
• Mid-term break: October 15th-20th

<strong>Major Holidays:</strong>
• April Break: April 6th - May 5th (1 month)
• August Break: August 16th - September 8th (3 weeks)
• December Break: November 30th - January 14th (6 weeks)

<strong>Examination Periods:</strong>
• Form 2 (FTNA): October
• Form 4 (CSEE): October-November`
            },

            'results': {
                keywords: ['result', 'exam', 'necta', 'performance', 'grades'],
                answer: `🎓 <strong>Academic Performance:</strong>

<strong>NECTA Registration Codes:</strong>
• Primary: ZP0372
• Secondary: S4202

<strong>2024 Examination Results:</strong>
• <strong>Form 2 (FTNA):</strong> <a href="https://bmz.go.tz/exam_result/schools/STD7(2024)/ZP0372.html" target="_blank">View Results</a>
• <strong>Form 4 (CSEE):</strong> <a href="https://onlinesys.necta.go.tz/results/2024/csee/results/s4202.htm" target="_blank">View Results</a>

<strong>Performance Highlights:</strong>
✓ Consistent improvement in pass rates
✓ Strong performance in Sciences
✓ Excellent results in Mathematics
✓ Notable achievements in Languages

<em>Check our detailed results on the official NECTA portal.</em>`
            },

            'history': {
                keywords: ['history', 'founded', 'established', 'background', 'story'],
                answer: `🏛️ <strong>School History:</strong>

<strong>Foundation:</strong> 1994
<strong>Ownership:</strong> Catholic Diocese of Zanzibar
<strong>Religious Affiliation:</strong> Catholic (welcoming all faiths)

<strong>Historical Timeline:</strong>
• <strong>1994:</strong> School founded
• <strong>1996:</strong> Nursery section opened
• <strong>1998:</strong> Primary education introduced
• <strong>2007:</strong> Secondary education launched
• <strong>2017:</strong> First Form 4 graduates
• <strong>2021:</strong> Notable academic improvements

<strong>Founding Leadership:</strong>
Brother Kiko Baeza served as first headmaster, supported by the Nyakato community and five Tanzanian staff members.

<em>Our motto: "Education Key to Liberty"</em>`
            },

            'facilities': {
                keywords: ['facility', 'building', 'lab', 'library', 'sports', 'dormitory'],
                answer: `⚽ <strong>School Facilities:</strong>

<strong>Academic Facilities:</strong>
• Modern Science Laboratories (Physics, Chemistry, Biology)
• Well-stocked Library with digital resources
• Computer Labs with internet access
• Spacious, well-ventilated classrooms

<strong>Boarding Facilities:</strong>
• Comfortable dormitories
• Supervised accommodation
• Clean dining facilities
• 24/7 security

<strong>Recreational Facilities:</strong>
• Sports fields (Football, Basketball, Athletics)
• Chapel for spiritual activities
• Music and arts rooms
• Assembly hall

<strong>Additional Amenities:</strong>
• Medical clinic
• Counseling services
• Career guidance center
• Parent meeting areas`
            },

            'uniform': {
                keywords: ['uniform', 'dress', 'attire', 'clothing'],
                answer: `👔 <strong>School Uniform:</strong>

<strong>Boys' Uniform:</strong>
• White shirt with school badge
• Navy blue trousers
• School tie
• Black shoes and socks
• Navy blue sweater (optional)

<strong>Girls' Uniform:</strong>  
• White blouse with school badge
• Navy blue skirt/trousers
• School tie
• Black shoes and socks
• Navy blue sweater (optional)

<strong>Sports Uniform:</strong>
• School T-shirt
• Navy blue shorts/tracksuit
• Sports shoes

<strong>Cost:</strong> Approximately TZS 150,000 for complete set
<strong>Available at:</strong> School administration office

<em>Proper uniform is mandatory for all students.</em>`
            },

            'transport': {
                keywords: ['transport', 'bus', 'commute', 'travel'],
                answer: `🚌 <strong>Transportation:</strong>

<strong>School Bus Service:</strong>
• Available for day students
• Covers major routes in Zanzibar
• Safe and reliable transportation
• Professional drivers

<strong>Public Transport:</strong>
• Easily accessible by dalla-dalla
• Multiple routes pass near school
• Affordable options available

<strong>Private Transport:</strong>
• Ample parking space available
• Safe drop-off/pick-up zones
• Clear signage for visitors

<strong>Boarding Students:</strong>
• Transport provided for official trips
• Airport/ferry pickup available (on request)

<em>Contact administration for bus route details and fees.</em>`
            },

            'scholarship': {
                keywords: ['scholarship', 'financial aid', 'bursary', 'sponsorship'],
                answer: `🎗️ <strong>Scholarships & Financial Aid:</strong>

<strong>Available Scholarships:</strong>
• Academic Excellence Scholarships
• Sports Talent Scholarships
• Need-based Financial Aid
• Diocesan Sponsorships

<strong>Eligibility Criteria:</strong>
✓ Outstanding academic performance
✓ Demonstrated financial need
✓ Exceptional talent in sports/arts
✓ Active community involvement

<strong>Application Process:</strong>
1. Submit scholarship application form
2. Provide supporting documents
3. Attend interview (if required)
4. Committee review and decision

<strong>Renewal Requirements:</strong>
• Maintain good academic standing
• Positive behavior record
• Active participation in school activities

<em>Limited scholarships available. Apply early!</em>`
            },

            'staff': {
                keywords: ['teacher', 'staff', 'faculty', 'principal', 'headmaster'],
                answer: `👨‍🏫 <strong>Teaching Staff:</strong>

<strong>Faculty Composition:</strong>
• Qualified and experienced teachers
• Subject specialists for all areas
• Continuous professional development
• Student-centered teaching approach

<strong>Student-Teacher Ratio:</strong> 25:1
<strong>Qualification:</strong> All teachers meet TIE requirements

<strong>Leadership Team:</strong>
• For current leadership details, please contact the school directly as leadership positions may change.

<strong>Support Staff:</strong>
• Administrative personnel
• Laboratory technicians
• Librarians
• Sports coaches
• Counselors

<em>Our staff is committed to student success and holistic development.</em>`
            },

            'boarding': {
                keywords: ['boarding', 'hostel', 'dorm', 'accommodation', 'residence'],
                answer: `🏠 <strong>Boarding Facilities:</strong>

<strong>Accommodation:</strong>
• Separate dormitories for boys and girls
• Comfortable beds and storage
• Regular room maintenance
• 24/7 security and supervision

<strong>Meals & Nutrition:</strong>
• Balanced, nutritious meals
• Special dietary accommodations
• Clean dining facilities
• Regular health checks

<strong>Study Support:</strong>
• Supervised prep sessions
• Library access
• Quiet study areas
• Academic support

<strong>Activities & Recreation:</strong>
• Evening sports
• Cultural activities
• Religious services
• Weekend excursions

<em>Boarding fosters independence and community living skills.</em>`
            },

            'contact': {
                keywords: ['contact', 'phone', 'email', 'whatsapp', 'visit'],
                answer: `📞 <strong>Contact Information:</strong>

<strong>Phone Numbers:</strong>
• +255 658 638 938
• +255 713 616 049

<strong>Email:</strong> fmlibermann@gmail.com
<em>(Messages received as PDF attachments)</em>

<strong>Social Media:</strong>
• Instagram: <a href="https://www.instagram.com/fmlibermann/" target="_blank">@fmlibermann</a>

<strong>WhatsApp:</strong>
<a href="https://wa.me/255658638938" target="_blank">Chat with us on WhatsApp</a>

<strong>School Hours:</strong>
Monday - Friday: 7:00 AM - 4:00 PM
Saturday: 8:00 AM - 1:00 PM

<strong>Visiting Hours:</strong>
Please call ahead to schedule appointments.`
            }
        };

        this.init();
    }

    init() {
        this.toggleBtn = document.getElementById('chatbotToggle');
        this.closeBtn = document.getElementById('chatbotClose');
        this.chatBox = document.getElementById('chatbotBox');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSend');
        this.messagesContainer = document.getElementById('chatbotMessages');

        if (this.toggleBtn && this.chatBox) {
            this.toggleBtn.addEventListener('click', () => this.toggleChat());
            this.closeBtn.addEventListener('click', () => this.closeChat());
            this.sendBtn.addEventListener('click', () => this.sendMessage());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });

        }
    }

    toggleChat() {
        this.chatBox.classList.toggle('show');
        if (this.chatBox.classList.contains('show')) {
            this.input.focus();
        }
    }

    closeChat() {
        this.chatBox.classList.remove('show');
    }

    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getResponse(message);
            this.addMessage(response, 'bot');
            this.addQuickQuestions();
        }, 1500);
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.innerHTML = text;
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span class="typing-text">FML Assistant is typing...</span>
        </div>
    `;
    this.messagesContainer.appendChild(typingDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
}

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Greetings
        if (this.isGreeting(lowerMessage)) {
            return `Hello! Welcome to Francis Maria Libermann School! 🎓<br><br>
            I'm your FML School Assistant. I can help you with admissions, fees, programs, facilities, and much more. What specific information are you looking for today?`;
        }

        // Thanks
        if (this.isThanks(lowerMessage)) {
            return `You're welcome! 😊<br><br>
            Is there anything else you'd like to know about Francis Maria Libermann School? I'm here to help with any questions about our programs, admissions, or school life.`;
        }

        // Search for topic matches
        for (const [topic, data] of Object.entries(this.knowledgeBase)) {
            for (const keyword of data.keywords) {
                if (lowerMessage.includes(keyword)) {
                    return data.answer;
                }
            }
        }

        // Default response for unknown questions
        return `I'm here to help you learn about Francis Maria Libermann School! 🤖<br><br>
        I can provide information about:
        <ul>
            <li>📚 Admissions process and requirements</li>
            <li>💰 School fees and payment options</li>
            <li>🏫 Academic programs and subjects</li>
            <li>📍 School location and contact details</li>
            <li>📅 Academic calendar and term dates</li>
            <li>🎓 Examination results and performance</li>
            <li>⚽ Facilities and extracurricular activities</li>
            <li>🏛️ School history and background</li>
        </ul>
        What would you like to know more about?`;
    }

    isGreeting(message) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
        return greetings.some(greet => message.includes(greet));
    }

    isThanks(message) {
        const thanks = ['thank', 'thanks', 'appreciate'];
        return thanks.some(thank => message.includes(thank));
    }

    addQuickQuestions() {
        // Remove existing quick questions
        const existing = this.messagesContainer.querySelector('.quick-questions');
        if (existing) existing.remove();

        const quickQuestions = document.createElement('div');
        quickQuestions.className = 'quick-questions';
        quickQuestions.innerHTML = `
            <button class="quick-question" data-question="How do I apply for admission?">How to apply?</button>
            <button class="quick-question" data-question="What are the school fees?">School fees</button>
            <button class="quick-question" data-question="What programs do you offer?">Academic programs</button>
            <button class="quick-question" data-question="Where is the school located?">Location & contacts</button>
        `;
        
        // Add event listeners to new quick questions
        quickQuestions.querySelectorAll('.quick-question').forEach(button => {
            button.addEventListener('click', (e) => {
                const question = e.target.getAttribute('data-question');
                this.selectQuickQuestion(question);
            });
        });
        
        this.messagesContainer.appendChild(quickQuestions);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    selectQuickQuestion(question) {
        this.addMessage(question, 'user');
        this.input.value = '';

        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getResponse(question);
            this.addMessage(response, 'bot');
            this.addQuickQuestions();
        }, 1000);
    }
}

// Initialize chatbot when page loads
let chatbot;
document.addEventListener('DOMContentLoaded', function() {
    chatbot = new SchoolChatbot();
});

