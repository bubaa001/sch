
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

// Enhanced form handler for static website
function handleFormSubmission(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const originalContent = submitButton ? submitButton.innerHTML : '';
        const originalDisabled = submitButton ? submitButton.disabled : false;

        // Show loading state briefly
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status"></span>
                Processing...
            `;
        }

        setTimeout(() => {
            showFlashMessage('Online portal submissions are currently offline. Please contact the school directly via phone/WhatsApp (+255 753 638 938) or email (fmlibermann@gmail.com).', 'info');
            if (submitButton) {
                submitButton.disabled = originalDisabled;
                submitButton.innerHTML = originalContent;
            }
        }, 500);
    });
}

// Robust preloader handler - reveals site swiftly
function initializePreloader() {
    const preloader = document.getElementById('preloader') || document.querySelector('.preloader');
    const content = document.getElementById('content');
    const body = document.body;
    let dismissed = false;

    function dismissPreloader() {
        if (dismissed) return;
        dismissed = true;
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 400);
        }
        if (content) {
            content.style.display = 'block';
            content.classList.add('visible');
        }
        body.classList.add('loaded');
        try {
            initializePageFeatures();
        } catch (err) {
            console.error('Error initializing page features:', err);
        }
    }

    // Dismiss shortly after DOM is ready (giving smooth 400ms intro)
    setTimeout(dismissPreloader, 400);

    // Also listen to window load
    if (document.readyState === 'complete') {
        dismissPreloader();
    } else {
        window.addEventListener('load', dismissPreloader);
    }

    // Absolute fallback: ensure content is ALWAYS visible after 1 second max
    setTimeout(dismissPreloader, 1000);
}

// Function to initialize all page features (AOS, counters, chatbot, etc.)
function initializePageFeatures() {
    console.log('Initializing page features');
    
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
    
    console.log('Page features initialized successfully');
}

// Main initialization with comprehensive error handling
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    
    try {
        initializePreloader();
    } catch (error) {
        console.error('Critical error in preloader initialization:', error);
        // Emergency fallback: show content immediately
        const preloader = document.querySelector('.preloader');
        const content = document.getElementById('content');
        const body = document.body;
        
        if (preloader) preloader.style.display = 'none';
        if (content) content.style.display = 'block';
        if (body) body.classList.add('loaded');
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

// COMPREHENSIVE ENHANCED AI CHATBOT FOR FML SCHOOL
class SchoolChatbot {
    constructor() {
        this.knowledgeBase = {
            // Enhanced Admissions Information
            'admission': {
                keywords: ['admission', 'apply', 'enroll', 'application', 'register', 'join', 'admissions'],
                answer: `📚 <strong>Complete Admission Process:</strong>

<strong>1. Online Application:</strong> Submit through our website
<strong>2. Required Documents:</strong>
   • Birth certificate
   • Previous school reports (last two years)
   • Medical certificate with vaccinations
   • Parent/guardian ID
   • Transfer certificate (if applicable)

<strong>3. Application Fee:</strong> TZS 50,000 (non-refundable)
<strong>4. Entrance Exam:</strong> Academic evaluation in English, Mathematics, General Knowledge
<strong>5. Interview:</strong> Student and parent meeting with Admissions Team
<strong>6. Registration:</strong> Final enrollment and fee payment

<strong>Educational Levels Available:</strong>
• Nursery (Age 3+)
• Kindergarten
• Primary (Class 1-7)
• Secondary (Form 1-4)
• Pre-Form 1 Preparatory Program

<em>We accept students from Nursery to Form 4 levels.</em>`
            },

            // Enhanced Fees Information
            'fees': {
                keywords: ['fee', 'fees', 'cost', 'price', 'payment', 'tuition', 'school fees'],
                answer: `💰 <strong>Complete Fee Structure 2025:</strong>

<strong>Registration Fees (One-time):</strong>
• Kindergarten: TZS 50,000
• Kindergarten to Primary (FMLS students): TZS 55,000
• Transfer to Primary: TZS 80,000
• Transfer to Secondary: TZS 120,000
• FMLS Primary to Secondary: FREE

<strong>Primary School Fees (Annual):</strong>
• Nursery: TZS 650,000 (400,000 + 250,000 per term)
• Classes I-II: TZS 750,000 (500,000 + 250,000 per term)
• Classes III-VII: TZS 850,000 (500,000 + 350,000 per term)

<strong>Secondary School Fees (Annual):</strong>
• Form I: TZS 2,000,000 (1,000,000 + 1,000,000 per term)
• Form II: TZS 2,303,000 (1,303,000 + 1,000,000 per term)
• Form III: TZS 2,140,000 (1,140,000 + 1,000,000 per term)
• Form IV: TZS 2,363,000 (1,363,000 + 1,000,000 per term)

<strong>Boarding Fees (Primary IV-VII):</strong>
• Annual: TZS 1,750,000 (1,000,000 + 750,000 per term)

<strong>Additional Costs:</strong>
• New students: TZS 405,000 for uniforms and dormitory needs
• Boarding items: TZS 209,000 (uniform, mattress, sheets, etc.)
• Health Insurance: TZS 51,000

<strong>Payment Information:</strong>
• Bank: NMB Bank
• Account: 22910002851
• Name: FRANCIS MARIA LIBERMANN SCHOOL

<em>All fees are non-refundable. Payment plans available for qualifying families.</em>`
            },

            // Enhanced Academic Programs
            'programs': {
                keywords: ['program', 'course', 'subject', 'curriculum', 'study', 'academic', 'education'],
                answer: `🏫 <strong>Complete Academic Programs:</strong>

<strong>Primary Level (Class 1-7):</strong>
• Mathematics • English • Kiswahili • Science
• Social Studies • Religious Education • Creative Arts

<strong>Secondary Level (Form 1-4):</strong>
<strong>Core Subjects:</strong>
• Mathematics • English • Kiswahili • Biology
• Chemistry • Physics • History • Geography
• Civics • Religious Studies

<strong>Elective Subjects:</strong>
• Commerce • Book Keeping

<strong>Examinations:</strong>
• Class 7: PSLE (Primary School Leaving Examination)
• Form 2: FTNA (Form Two National Assessment)
• Form 4: CSEE (Certificate of Secondary Education Examination)

<strong>NECTA Registration Codes:</strong>
• Primary: ZP0372
• Secondary: S4202

<strong>Pre-Form 1 Preparatory Program:</strong>
One-year program for students needing foundational skills before Form 1

<em>All programs follow Tanzanian National Curriculum with practical enhancements.</em>`
            },

            // Enhanced School Life
            'school_life': {
                keywords: ['school life', 'daily life', 'routine', 'timetable', 'schedule', 'activities'],
                answer: `🎒 <strong>School Life at FML:</strong>

<strong>Daily Timetable (Form 3 Example):</strong>
• 6:00 AM: Wake Up & Morning Routine
• 6:30 AM: Morning Prayers in Chapel
• 7:00 AM: Breakfast
• 7:30 AM - 3:00 PM: Academic Classes
• 3:30 PM - 5:00 PM: Club Activities/Sports
• 6:00 PM - 8:00 PM: Supervised Study (Boarders)
• 9:00 PM: Lights Out

<strong>Meals & Nutrition:</strong>
• Breakfast: Porridge, bread, tea
• Lunch: Balanced meals with ugali/rice, beans, vegetables
• Dinner: Rice, stew, greens
• Special dietary accommodations available

<strong>Boarding Facilities:</strong>
• Separate dormitories for boys and girls
• Comfortable beds and storage
• 24/7 security and supervision
• Regular health checks

<strong>Health Services:</strong>
• Full-time nurse (Sr. Marry)
• School clinic with basic medical care
• Partnership with local clinics
• Health education sessions

<em>Our boarding environment fosters independence and community living skills.</em>`
            },

            // Enhanced Facilities
            'facilities': {
                keywords: ['facility', 'building', 'lab', 'library', 'sports', 'dormitory', 'campus'],
                answer: `⚽ <strong>Complete Campus Facilities:</strong>

<strong>Academic Facilities:</strong>
• Modern Science Laboratories (Physics, Chemistry, Biology)
• Well-stocked Library with digital resources
• Computer Labs with internet access
• Spacious, well-ventilated classrooms
• Staff offices and common room

<strong>Boarding Facilities:</strong>
• Comfortable dormitories (up to 60 boarders per dorm)
• Personal lockers and study areas
• Supervised by house masters
• 24/7 security

<strong>Recreational Facilities:</strong>
• Sports fields (Football, Basketball, Athletics)
• Chapel for spiritual activities
• Music and arts rooms
• Assembly hall
• Dining hall

<strong>Additional Amenities:</strong>
• School clinic with full-time nurse
• Counseling services
• Career guidance center
• School shop (stationery, toiletries)
• Parent meeting areas

<strong>Campus Environment:</strong>
• 5 hectares of green space
• Peaceful atmosphere near Tomondo area
• Sustainability initiatives (rainwater harvesting, solar power)
• Well-maintained gardens by Environmental Club

<em>Our facilities support holistic development and academic excellence.</em>`
            },

            // Enhanced Extracurricular Activities
            'activities': {
                keywords: ['activity', 'club', 'sports', 'music', 'drama', 'extracurricular', 'hobby'],
                answer: `🎭 <strong>Extracurricular Activities & Clubs:</strong>

<strong>Sports Programs:</strong>
• Football (regional tournament participation)
• Basketball (weekly training, inter-house competitions)
• Athletics (annual sports days, national meets)
• Physical education classes

<strong>Clubs & Societies:</strong>
• Environmental Club (tree planting, campus cleanups)
• Debate Club (public speaking, regional competitions)
• Music and Drama Club (performances, festivals)
• Science Club
• Computer Club
• Cultural Activities Club

<strong>Leadership Opportunities:</strong>
• Prefects and house captains
• Club leadership positions
• Peer Mentorship Program
• Leadership Training Program (annual workshops)

<strong>Community Engagement:</strong>
• Community outreach programs
• Local business visits
• Charity drives and environmental cleanups
• Participation in community festivals

<strong>Spiritual Activities:</strong>
• Daily morning and evening prayers
• Sunday Mass for boarders
• Marian devotions (Rosary in October)
• Annual retreats for Forms 3 and 4

<em>Activities foster teamwork, creativity, and community spirit.</em>`
            },

            // Enhanced Community Information
            'community': {
                keywords: ['community', 'parent', 'alumni', 'volunteer', 'pta', 'partnership'],
                answer: `👥 <strong>School Community & Engagement:</strong>

<strong>Parent-Teacher Association (PTA):</strong>
• Monthly meetings for school improvements
• Event planning and student welfare support
• Recent initiatives: library books, Family Day
• Parent volunteers welcome

<strong>Alumni Network:</strong>
• 200+ alumni connected
• Mentorship opportunities for current students
• Professional networking
• Graduation year reunions

<strong>Parent Involvement:</strong>
• Family Day events
• Parent meetings (first Saturday monthly)
• Volunteer opportunities
• Communication via school office

<strong>Community Partnerships:</strong>
• Collaboration with local churches and schools
• Business partnerships for practical learning
• Health awareness campaigns
• Environmental initiatives

<strong>Career Opportunities:</strong>
• Current openings: Mathematics Teacher, Boarding House Master, School Counselor
• Application: Email CV to fmlibermann@gmail.com
• Background checks required for all positions

<em>We welcome parents, alumni, and community members to join our Libermann family.</em>`
            },

            // Enhanced Health & Safety
            'health_safety': {
                keywords: ['health', 'safety', 'medical', 'nurse', 'medication', 'security', 'wellbeing'],
                answer: `🏥 <strong>Health, Safety & Wellbeing:</strong>

<strong>Health Services:</strong>
• Full-time school nurse (Sr. Marry)
• School clinic open 8:00 AM - 5:00 PM
• Basic medical care and first aid
• Annual health check-ups
• Partnership with local clinics

<strong>Medication Management:</strong>
• All medications registered with school nurse
• Stored securely in clinic
• Administered by nurse during designated times
• Emergency items (asthma inhalers) with prior approval

<strong>Safety Protocols:</strong>
• Fully fenced campus with 24/7 security guards
• Visitor sign-in and badge system
• Strict anti-bullying policy
• Child protection training for staff
• Emergency response procedures

<strong>Wellbeing Support:</strong>
• Guidance Counselor for personal issues
• Peer support program (senior mentors)
• Monthly "Circle Time" sessions
• PSHE classes (Personal, Social, Health, Economic education)

<strong>Environmental Safety:</strong>
• Clean, well-maintained facilities
• Regular health and safety inspections
• Sustainable campus practices

<em>Student safety and wellbeing are our top priorities.</em>`
            },

            // Enhanced Location & Contact
            'location': {
                keywords: ['location', 'address', 'where', 'map', 'directions', 'contact', 'phone', 'email'],
                answer: `📍 <strong>Location & Contact Information:</strong>

<strong>School Address:</strong>
Francis Maria Libermann School
Shehia of Tomondo, Western District
Urban Western Region, Zanzibar
Tanzania

<strong>Distance:</strong> Just 5km from Stone Town
<strong>Accessibility:</strong> Easily accessible by public transport

<strong>Contact Information:</strong>
📞 Phone: +255 658 638 938 / +255 713 616 049
📱 WhatsApp: +255 753 638 938
📧 Email: fmlibermann@gmail.com
🌐 Instagram: @fmlibermann

<strong>Office Hours:</strong>
Monday - Friday: 8:00 AM - 4:00 PM
Saturday: 9:00 AM - 1:00 PM

<strong>Visiting Hours:</strong>
Please call ahead to schedule appointments
Parent visits: First Saturday monthly (9:00 AM - 1:00 PM)

<strong>Bank Details:</strong>
NMB Bank - Account: 22910002851
Name: FRANCIS MARIA LIBERMANN SCHOOL

<em>We welcome visitors during school hours. Contact us for campus tours!</em>`
            },

            // Enhanced Calendar & Events
            'calendar': {
                keywords: ['calendar', 'term', 'holiday', 'schedule', 'dates', 'event', 'open day'],
                answer: `📅 <strong>2025 Academic Calendar & Events:</strong>

<strong>Term Dates:</strong>
• <strong>Term 1:</strong> January 15th - April 5th
  (Mid-term break: February 20th-25th)
• <strong>Term 2:</strong> May 6th - August 15th
  (Mid-term break: June 20th-25th)
• <strong>Term 3:</strong> September 9th - November 29th
  (Mid-term break: October 15th-20th)

<strong>Major Holidays:</strong>
• April Break: April 6th - May 5th (1 month)
• August Break: August 16th - September 8th (3 weeks)
• December Break: November 30th - January 14th (6 weeks)

<strong>Examination Periods:</strong>
• Form 2 (FTNA): October
• Form 4 (CSEE): October-November

<strong>Open Days & Events:</strong>
• May 10, 2025: Discover FML Day (9:00 AM - 2:00 PM)
• August 15, 2025: Family Open House (10:00 AM - 3:00 PM)
• November 8, 2025: Academic Showcase Day (9:00 AM - 1:00 PM)

<strong>Parent Meetings:</strong>
First Saturday of each month (dates announced by administration)

<em>Check our website or contact office for updated event information.</em>`
            },

            // Enhanced Results & Performance
            'results': {
                keywords: ['result', 'exam', 'necta', 'performance', 'grades', 'achievement'],
                answer: `🎓 <strong>Academic Performance & Results:</strong>

<strong>NECTA Registration Codes:</strong>
• Primary: ZP0372
• Secondary: S4202

<strong>2024 Examination Results:</strong>
• <strong>Form 2 (FTNA):</strong> 88% pass rate
  <a href="https://bmz.go.tz/exam_result/schools/STD7(2024)/ZP0372.html" target="_blank">View Results</a>
• <strong>Form 4 (CSEE):</strong> 92% pass rate (15% Division I)
  <a href="https://onlinesys.necta.go.tz/results/2024/csee/results/s4202.htm" target="_blank">View Results</a>

<strong>Performance Highlights:</strong>
✓ Consistent improvement in pass rates
✓ Strong performance in Sciences and Mathematics
✓ Excellent results in Languages
✓ Notable academic improvements since 2021

<strong>Student Achievements:</strong>
• Regional sports tournament participation
• Cultural festival performances
• Community service recognition
• Leadership development

<em>Our students consistently achieve strong results in national examinations.</em>`
            },

            // Enhanced History & Mission
            'history': {
                keywords: ['history', 'founded', 'established', 'background', 'story', 'mission', 'vision', 'values'],
                answer: `🏛️ <strong>School History, Mission & Values:</strong>

<strong>Historical Timeline:</strong>
• <strong>1994:</strong> School founded
• <strong>1996:</strong> Nursery section opened
• <strong>1998:</strong> Primary education introduced
• <strong>2007:</strong> Secondary education launched
• <strong>2017:</strong> First Form 4 graduates
• <strong>2021:</strong> Notable academic improvements

<strong>Ownership:</strong> Catholic Diocese of Zanzibar
<strong>Religious Affiliation:</strong> Catholic (welcoming all faiths)
<strong>Motto:</strong> "Education Key to Liberty"

<strong>Our Mission:</strong>
"To Provide Quality Education with Competitive Standards, to help the Students Become more Curious, Reflective and Critical Thinkers as Global citizens."

<strong>Our Vision:</strong>
To develop Learners who are:
• Confident in working with information and ideas
• Responsible for themselves, environment and respect of others
• Reflective as learners, developing their ability to learn
• Innovative and equipped for new challenges
• Engaged intellectually, spiritually and socially

<strong>Core Values:</strong>
• Compassion: Caring environment with mutual respect
• Integrity: Honesty and ethical behavior
• Excellence: Highest standards in academics and character
• Service: Commitment to community and others

<em>Our values guide everything we do at Francis Maria Libermann School.</em>`
            }
        };

        this.init();
    }

    // Enhanced off-topic question handling
    handleOffTopic(message) {
        const offTopicResponses = [
            "I'm here to help you learn about Francis Maria Libermann School. Try asking about admissions, fees, programs, or school life!",
            "That's an interesting question! I specialize in school information. You might want to ask about our academic programs, admission process, or campus facilities.",
            "I focus on providing information about our school. Would you like to know about our admission requirements, fee structure, or extracurricular activities?",
            "For questions about our school, I'm your best resource! Try asking about our history, facilities, or academic performance.",
            "I'm designed to help with school-related inquiries. You can ask me about admissions, fees, programs, or any other aspect of Francis Maria Libermann School."
        ];
        return offTopicResponses[Math.floor(Math.random() * offTopicResponses.length)];
    }

    // Enhanced initialization
    init() {
        this.toggleBtn = document.getElementById('chatbotToggle');
        this.closeBtn = document.getElementById('chatbotClose');
        this.chatBox = document.getElementById('chatbotBox');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSend');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.quickQuestions = document.getElementById('quick-questions');

        if (this.toggleBtn && this.chatBox) {
            this.toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleChat();
            });
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.closeChat();
                });
            }
            if (this.sendBtn) {
                this.sendBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.sendMessage();
                });
            }
            if (this.input) {
                this.input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.sendMessage();
                });
            }

            // Prevent clicks inside the chatbox from closing it
            this.chatBox.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Collapse chatbox when clicking anywhere outside
            document.addEventListener('click', (e) => {
                if (this.chatBox.classList.contains('show') &&
                    !this.chatBox.contains(e.target) &&
                    e.target !== this.toggleBtn &&
                    !this.toggleBtn.contains(e.target)) {
                    this.closeChat();
                }
            }, true);

            // Also allow pressing Escape to collapse
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.chatBox.classList.contains('show')) {
                    this.closeChat();
                }
            });
            
            // Enhanced quick questions
            this.setupQuickQuestions();
        }
    }

    toggleChat() {
        this.chatBox.classList.toggle('show');
        if (this.chatBox.classList.contains('show')) {
            if (this.input) this.input.focus();
        }
    }

    closeChat() {
        this.chatBox.classList.remove('show');
    }

    // Enhanced quick questions setup
    setupQuickQuestions() {
        const questions = [
            "What are the admission requirements?",
            "How much are school fees?",
            "What subjects do you offer?",
            "Tell me about boarding facilities",
            "What extracurricular activities are available?",
            "How do I contact the school?",
            "What are the term dates?",
            "Tell me about school history"
        ];

        if (this.quickQuestions) {
            this.quickQuestions.innerHTML = questions.map(question =>
                `<button class="quick-question" onclick="chatbot.handleQuickQuestion('${question}')">${question}</button>`
            ).join('');
        }
    }

    // Enhanced quick question handler
    handleQuickQuestion(question) {
        this.input.value = question;
        this.sendMessage();
    }

    // Enhanced message sending
    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
            this.scrollToBottom();
        }, 500);
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
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Enhanced response generation
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for exact matches first
        for (const [key, data] of Object.entries(this.knowledgeBase)) {
            if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return data.answer;
            }
        }

        // Check for partial matches with higher threshold
        for (const [key, data] of Object.entries(this.knowledgeBase)) {
            const matchCount = data.keywords.filter(keyword =>
                lowerMessage.includes(keyword)
            ).length;
            
            if (matchCount >= 2) {
                return data.answer;
            }
        }

        // Enhanced fallback responses
        const fallbackResponses = [
            "I'm not sure I understand. Could you rephrase your question about our school?",
            "I'd love to help! Could you be more specific about what you'd like to know about Francis Maria Libermann School?",
            "That's an interesting question! I specialize in school information like admissions, fees, programs, and facilities.",
            "I'm here to provide information about our school. Try asking about specific topics like admission requirements or academic programs."
        ];

        // Check if message seems completely off-topic
        const schoolKeywords = ['school', 'admission', 'fee', 'program', 'student', 'teacher', 'class', 'exam'];
        const isSchoolRelated = schoolKeywords.some(keyword => lowerMessage.includes(keyword));
        
        if (!isSchoolRelated) {
            return this.handleOffTopic(message);
        }

        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    // Enhanced message display
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.innerHTML = text;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }


    // Utility function
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.chatbot = new SchoolChatbot();
});
