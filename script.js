// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Reveal Animations on Scroll
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Special handling for skill bars to animate only when visible
            if (entry.target.classList.contains('skills-left')) {
                animateSkillBars();
            }
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');
    bars.forEach(bar => {
        const width = bar.style.getPropertyValue('--skill-width') || bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Typing Effect
const textOptions = ["Designer.", "Editor.", "Creator.", "Thinker."];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';
let isDeleting = false;

const typingElement = document.querySelector('.typing-text');

function type() {
    if (!typingElement) return;

    if (count === textOptions.length) { count = 0; }
    currentText = textOptions[count];

    if (isDeleting) {
        letter = currentText.slice(0, --index);
    } else {
        letter = currentText.slice(0, ++index);
    }

    typingElement.textContent = letter;

    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && letter.length === currentText.length) {
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && letter.length === 0) {
        isDeleting = false;
        count++;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Initialization
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
});

// Theme Toggle
const themeBtn = document.getElementById('theme-btn');
const themeIcon = themeBtn.querySelector('i');

// Check for saved theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    if (document.body.classList.contains('light-mode')) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// Translations
const translations = {
    en: {
        nav_home: "Home",
        nav_services: "Services",
        nav_portfolio: "Portfolio",
        nav_skills: "Skills",
        nav_contact: "Contact",
        greeting: "HELLO, I'M",
        hero_desc: "I'm a digital creator specializing in crafting immersive web experiences and cinematic video edits that capture attention.",
        view_work: "View My Work",
        contact_me: "Get in Touch",
        services_label: "EXCELLENCE",
        services_title: "Professional Services",
        service_web_title: "Web Design",
        service_web_desc: "Building modern, responsive, and high-performance websites tailored to your brand's unique identity.",
        service_video_title: "Video Editing",
        service_video_desc: "Transforming raw footage into cinematic masterpieces with professional transitions, grading, and sound design.",
        service_content_title: "Content Creation",
        service_content_desc: "Creating engaging short-form content for Reels, TikTok, and YouTube aimed at maximum audience retention.",
        portfolio_label: "WORK",
        portfolio_title: "Selected Projects",
        project1_title: "Luxury Landing Page",
        project1_desc: "A premium e-commerce design with glassmorphism effects and smooth scroll interactions.",
        project2_title: "Cinematic Ad Edit",
        project2_desc: "A high-intensity commercial edit featuring professional color grading and sound design.",
        project3_title: "Productivity Platform",
        project3_desc: "A minimalist productivity application interface designed for clarity and efficiency.",
        project4_title: "AL-QUDS Clothing Store",
        project4_desc: "A premium luxury line web application for the Al-Quds fashion brand with sophisticated design.",
        project5_title: "Konnash Debt Tracker",
        project5_desc: "A comprehensive web application for tracking personal debts and managing financial records.",
        skills_label: "PROFICIENCY",
        skills_title: "Technical Expertise",
        skills_core: "Core Competencies",
        skill_web: "Web Design (HTML, CSS, JS)",
        skill_video: "Video Editing",
        skill_content: "Content Strategy",
        tools_label: "My Workspace",
        contact_title: "Let's Create Together",
        contact_desc: "Have a vision for your next brand design or video project? Let's discuss how we can bring it to life.",
        email_label: "Email",
        whatsapp_label: "WhatsApp",
        name_label: "Full Name",
        email_label_field: "Email Address",
        msg_label: "Your Message",
        send_btn: "Send Message",
        footer_rights: "All rights reserved.",
        toast_success: "Message sent successfully!"
    },
    ar: {
        nav_home: "الرئيسية",
        nav_services: "الخدمات",
        nav_portfolio: "الأعمال",
        nav_skills: "المهارات",
        nav_contact: "تواصل معي",
        greeting: "مرحباً، أنا",
        hero_desc: "أنا صانع محتوى رقمي متخصص في تصميم تجارب الويب الغامرة وتحرير الفيديو السينمائي الذي يلفت الانتباه.",
        view_work: "شاهد أعمالي",
        contact_me: "تحدث معي",
        services_label: "التميز",
        services_title: "خدمات احترافية",
        service_web_title: "تصميم المواقع",
        service_web_desc: "بناء مواقع حديثة وعالية الأداء مصممة خصيصاً لهوية علامتك التجارية الفريدة.",
        service_video_title: "مونتاج الفيديو",
        service_video_desc: "تحويل المقاطع الخام إلى تحف سينمائية مع انتقالات احترافية وتصحيح ألوان وتصميم صوتي.",
        service_content_title: "صناعة المحتوى",
        service_content_desc: "إنشاء محتوى قصير جذاب للـ Reels و TikTok و YouTube يهدف إلى أقصى درجات الاحتفاظ بالجمهور.",
        portfolio_label: "أعمالي",
        portfolio_title: "مشاريع مختارة",
        project1_title: "صفحة هبوط فاخرة",
        project1_desc: "تصميم تجارة إلكترونية متميز مع تأثيرات زجاجية وتفاعلات تمرير سلسة.",
        project2_title: "إعلان سينمائي",
        project2_desc: "مونتاج تجاري عالي الكثافة يتميز بتصحيح ألوان احترافي وتصميم صوتي.",
        project3_title: "منصة إنتاجية",
        project3_desc: "واجهة تطبيق إنتاجية بسيطة مصممة للوضوح والكفاءة.",
        project4_title: "متجر القدس للملابس",
        project4_desc: "تطبيق ويب فاخر لعلامة القدس التجارية للملابس مع تصميم عصري وتجربة مستخدم سلسة.",
        project5_title: "كناش - مدير الديون",
        project5_desc: "تطبيق ويب شامل لتتبع الديون وإدارة السجلات المالية الشخصية.",
        skills_label: "الكفاءة",
        skills_title: "الخبرة التقنية",
        skills_core: "الكفاءات الأساسية",
        skill_web: "تصميم الويب (HTML, CSS, JS)",
        skill_video: "مونتاج الفيديو",
        skill_content: "استراتيجية المحتوى",
        tools_label: "بيئة عملي",
        contact_title: "لنبدأ الإبداع سوياً",
        contact_desc: "هل لديك رؤية لمشروعك القادم؟ لنناقش كيف يمكننا تحويلها إلى حقيقة.",
        email_label: "البريد الإلكتروني",
        whatsapp_label: "واتساب",
        name_label: "الاسم الكامل",
        email_label_field: "عنوان البريد",
        msg_label: "رسالتك",
        send_btn: "إرسال الرسالة",
        footer_rights: "جميع الحقوق محفوظة.",
        toast_success: "تم إرسال الرسالة بنجاح!"
    }
};

function changeLanguage() {
    const lang = document.getElementById("lang-select").value;
    const elementsToTranslate = document.querySelectorAll("[data-lang]");

    elementsToTranslate.forEach(element => {
        const key = element.getAttribute("data-lang");
        if (translations[lang][key]) {
            if (element.tagName === "SPAN" || element.tagName === "H1" || element.tagName === "H2" || element.tagName === "H3" || element.tagName === "H4" || element.tagName === "P" || element.tagName === "LABEL" || element.tagName === "BUTTON") {
                element.innerText = translations[lang][key];
            } else if (element.tagName === "A") {
                // If it's a link with a span inside, don't overwrite the span's text unless it's direct
                if (element.children.length === 0) {
                    element.innerText = translations[lang][key];
                }
            }
        }
    });

    // Update form placeholders
    if (lang === 'ar') {
        document.getElementById('name').placeholder = 'جون دو';
        document.getElementById('email').placeholder = 'john@example.com';
        document.getElementById('msg').placeholder = 'أخبرني عن مشروعك...';
        document.body.dir = 'rtl';
        document.body.style.fontFamily = "'Arial', sans-serif";
    } else {
        document.getElementById('name').placeholder = 'John Doe';
        document.getElementById('email').placeholder = 'john@example.com';
        document.getElementById('msg').placeholder = 'Tell me about your project...';
        document.body.dir = 'ltr';
        document.body.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    }
    
    // Save language preference
    localStorage.setItem('lang', lang);
}

// Check for saved language
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        document.getElementById('lang-select').value = savedLang;
        changeLanguage();
    }
});

// Form Submission & Toast
async function sendMsg(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button');
    const originalText = submitBtn.innerText;
    
    // Simple UI feedback
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const toast = document.getElementById("toast");
    const lang = document.getElementById("lang-select").value;
    toast.querySelector('span').innerText = translations[lang].toast_success;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        e.target.reset();
    }, 3000);
}
