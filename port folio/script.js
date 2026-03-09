const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

const textOptions = ["Video Editor", "Future Web Designer", "Creative Thinker", "Content Creator"];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';
let isDeleting = false;

const typingElement = document.querySelector('.typing-text');

function type() {
    if (count === textOptions.length) { count = 0; }
    currentText = textOptions[count];
    
    if (isDeleting) {
        letter = currentText.slice(0, --index);
    } else {
        letter = currentText.slice(0, ++index);
    }
    
    typingElement.textContent = letter;
    
    let typeSpeed = isDeleting ? 50 : 100;
    
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

window.addEventListener('load', () => {
    if(typingElement) {
        setTimeout(type, 1000);
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
    
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        nav.style.boxShadow = 'none';
        nav.style.background = 'rgba(10, 10, 10, 0.8)';
    }
});
