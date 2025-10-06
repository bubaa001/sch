const translations = {
    en: {
        // Existing translations...
        "Students Enrolled": "Students Enrolled",
        "Alumni Worldwide": "Alumni Worldwide",
        "Years of Excellence": "Years of Excellence",
        "Stay Updated": "Stay Updated",
        "Subscribe to our newsletter for the latest news and updates from Marist School.": "Subscribe to our newsletter for the latest news and updates from Marist School.",
        "Subscribe": "Subscribe",
        "Chat with Us": "Chat with Us",
        "Hello! How can we assist you today?": "Hello! How can we assist you today?",
        "Send": "Send",
        "1965": "1965",
        "Marist School Founded": "Marist School Founded",
        "2000": "2000",
        "First National Award": "First National Award",
        "2020": "2020",
        "Modern Campus Expansion": "Modern Campus Expansion",

        // --- NEW ADMISSIONS FORM TRANSLATIONS ---
        "Online Registration Form": "Online Registration Form",
        "Begin your journey at Francis Maria Libermann School by completing our online registration form.": "Begin your journey at Francis Maria Libermann School by completing our online registration form.",
        "(Please fill out all required fields. Instructions are available in English and Swahili.)": "(Please fill out all required fields. Instructions are available in English and Swahili.)",
        "English": "English",
        "Swahili": "Swahili",
        "Student Information": "Student Information",
        "Parent/Guardian Information": "Parent/Guardian Information",
        "Academic Information": "Academic Information",
        "Required Documents": "Required Documents",
        "A non-refundable registration fee of TZS 50,000 is required to complete your application. After submission, you will receive payment instructions via email.": "A non-refundable registration fee of TZS 50,000 is required to complete your application. After submission, you will receive payment instructions via email.",
        "Submit Application": "Submit Application",
        "Male": "Male",
        "Female": "Female",
        "Please upload the following documents (PDF or image format, max 5MB each):": "Please upload the following documents (PDF or image format, max 5MB each):"
        // Form field labels are handled directly by data-en attributes in HTML
    },
    sw: {
        // Existing translations...
        "Students Enrolled": "Wanafunzi Waliandikishwa",
        "Alumni Worldwide": "Wahitimu Ulimwenguni",
        "Years of Excellence": "Miaka ya Ubora",
        "Stay Updated": "Endelea Kusasishwa",
        "Subscribe to our newsletter for the latest news and updates from Marist School.": "Jisajili kwa jarida letu la habari ili upate habari za hivi punde na masasisho kutoka Shule ya Marist.",
        "Subscribe": "Jisajili",
        "Chat with Us": "Ongea Nasi",
        "Hello! How can we assist you today?": "Habari! Tunawezaje kukusaidia leo?",
        "Send": "Tuma",
        "1965": "1965",
        "Marist School Founded": "Shule ya Marist Ilianzishwa",
        "2000": "2000",
        "First National Award": "Tuzo ya Kwanza ya Kitaifa",
        "2020": "2020",
        "Modern Campus Expansion": "Upanuzi wa Kampasi ya Kisasa",

        // --- NEW ADMISSIONS FORM TRANSLATIONS ---
        "Online Registration Form": "Fomu ya Kujisajili Mtandaoni",
        "Begin your journey at Francis Maria Libermann School by completing our online registration form.": "Anza safari yako katika Shule ya Francis Maria Libermann kwa kujaza fomu yetu ya usajili mtandaoni.",
        "(Please fill out all required fields. Instructions are available in English and Swahili.)": "(Tafadhali jaza sehemu zote zinazohitajika. Maelekezo yanapatikana kwa Kiingereza na Kiswahili.)",
        "English": "Kiingereza",
        "Swahili": "Kiswahili",
        "Student Information": "Taarifa za Mwanafunzi",
        "Parent/Guardian Information": "Taarifa za Mzazi/Mlezi",
        "Academic Information": "Taarifa za Masomo",
        "Required Documents": "Hati Zinazohitajika",
        "A non-refundable registration fee of TZS 50,000 is required to complete your application. After submission, you will receive payment instructions via email.": "Ada ya usajili isiyoweza kurejeshwa ya TZS 50,000 inahitajika ili kukamilisha maombi yako. Baada ya kuwasilisha, utapokea maelekezo ya malipo kupitia barua pepe.",
        "Submit Application": "Tuma Maombi",
        "Male": "Mwanaume",
        "Female": "Mwanamke",
        "Please upload the following documents (PDF or image format, max 5MB each):": "Tafadhali pakia hati zifuatazo (umbile la PDF au picha, max 5MB kila moja):"
    }
};

function toggleLanguage() {
    const langSelect = document.getElementById('language-toggle');
    const lang = langSelect ? langSelect.value : 'en'; // Default to English if selector is missing

    // 1. Handle elements with data-en/data-sw attributes (form labels)
    // The inner text will be overridden by the content of data-sw if available
    document.querySelectorAll('[data-en]').forEach(element => {
        const enText = element.getAttribute('data-en');
        const swText = element.getAttribute('data-sw');

        if (lang === 'sw' && swText) {
            element.textContent = swText;
        } else {
            element.textContent = enText;
        }
    });

    // 2. Handle specific elements like section titles, headers, and the submit button
    // which use data-i18n attributes to look up text in the translations object
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[lang][key];
        if (translation) {
            element.textContent = translation;
        }
    });

    // 3. Handle SELECT options (Gender and Language Toggle)
    const genderSelect = document.getElementById('gender');
    const langOptions = document.getElementById('language-toggle');

    [genderSelect, langOptions].filter(e => e).forEach(select => {
        Array.from(select.options).forEach(option => {
            // Check for data-i18n attribute first (used on language and gender options)
            const key = option.getAttribute('data-i18n');
            if (key) {
                const translation = translations[lang][key.trim()];
                if (translation) {
                    option.textContent = translation;
                }
            }
        });
    });


    // Set the language in a cookie or local storage for persistence
    localStorage.setItem('selectedLanguage', lang);
}

// Call on DOM content loaded to initialize translation
document.addEventListener('DOMContentLoaded', () => {
    // Set initial language from local storage or default to 'en'
    const storedLang = localStorage.getItem('selectedLanguage');
    const langSelect = document.getElementById('language-toggle');
    if (langSelect) {
        langSelect.value = storedLang || 'en';
    }
    // Perform initial translation
    toggleLanguage();
});