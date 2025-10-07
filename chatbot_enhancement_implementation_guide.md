
# Chatbot Enhancement Implementation Guide
## Complete Code Implementation for Enhanced School Chatbot

This guide provides the complete enhanced chatbot implementation that can be directly applied to the existing [`scripts.js`](app/static/scripts.js:379) file.

## Implementation Steps

### Step 1: Replace the Existing SchoolChatbot Class

Replace the current `SchoolChatbot` class (lines 379-919 in [`scripts.js`](app/static/scripts.js:379)) with the enhanced version below:

```javascript
// Comprehensive AI Chatbot for FML School - Enhanced Version
class SchoolChatbot {
    constructor() {
        this.knowledgeBase = {
            // Admissions Information - Enhanced
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

<em>Founded by Brother Kiko Baeza with support from Nyakato community.</em>`
            }
        };

        this.init();
    }

    // Enhanced off-topic question handling
    handleOffTopic(message) {
        const offTopicResponses = [
            "I'm here to help you learn about Francis Maria Libermann School! 🤖<br><br>I specialize in providing information about our school's admissions, programs, fees, and campus life. Would you