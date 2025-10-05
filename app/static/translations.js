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
        "Modern Campus Expansion": "Modern Campus Expansion"
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
        "Modern Campus Expansion": "Upanuzi wa Kampasi ya Kisasa"
    }
};

function translatePage() {
    const lang = localStorage.getItem('language') || 'en';
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}