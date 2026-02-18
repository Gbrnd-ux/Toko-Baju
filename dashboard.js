// --- BAGIAN 1: LOGIKA SLIDER ---
let slideIndex = 0;
let slideTimer;

function showSlides() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;

    slides.forEach(slide => {
        slide.style.display = "none"; 
        slide.classList.remove('active');
    });
    dots.forEach(dot => dot.classList.remove('active'));

    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }

    slides[slideIndex - 1].style.display = "flex";
    slides[slideIndex - 1].classList.add('active');
    dots[slideIndex - 1].classList.add('active');

    clearTimeout(slideTimer);
    slideTimer = setTimeout(showSlides, 5000);
}

function currentSlide(n) {
    clearTimeout(slideTimer);
    slideIndex = n;
    
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    slides.forEach(slide => {
        slide.style.display = "none";
        slide.classList.remove('active');
    });
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex].style.display = "flex";
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
    
    slideTimer = setTimeout(showSlides, 5000);
}

// --- BAGIAN 2: LOGIKA TRANSLASI (API) ---
async function changeLanguage(lang) {
    // Google Translate menggunakan 'ja' untuk Jepang
    const targetLang = (lang === 'jp') ? 'ja' : lang; 
    const elements = document.querySelectorAll('[data-i18n], [data-i18n-placeholder]');
    const textsToTranslate = [];

    elements.forEach(el => {
        let original;
        if (el.hasAttribute('data-i18n')) {
            if (!el.getAttribute('data-origin')) {
                // Ambil teks murni, abaikan elemen span/panah di dalamnya
                el.setAttribute('data-origin', el.childNodes[0].textContent.trim());
            }
            original = el.getAttribute('data-origin');
        } else if (el.hasAttribute('data-i18n-placeholder')) {
            if (!el.getAttribute('data-origin-placeholder')) {
                el.setAttribute('data-origin-placeholder', el.getAttribute('placeholder'));
            }
            original = el.getAttribute('data-origin-placeholder');
        }
        textsToTranslate.push(original);
    });

    const delimiter = " [X] ";
    const combinedText = textsToTranslate.join(delimiter);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(combinedText)}`;

    try {
        const currentLangLabel = document.getElementById('current-lang');
        if(currentLangLabel) currentLangLabel.innerText = "Translating...";

        const response = await fetch(url);
        const result = await response.json();

        if (result && result[0]) {
            let translatedFull = result[0].map(part => part[0]).join("");
            const translatedArray = translatedFull.split(/\s*\[X\]\s*/i);

            elements.forEach((el, index) => {
                const val = translatedArray[index] ? translatedArray[index].trim() : textsToTranslate[index];
                
                if (el.hasAttribute('data-i18n')) {
                    // Update teks tanpa merusak elemen anak (seperti panah sidebar)
                    el.childNodes[0].textContent = val + " ";
                } 
                if (el.hasAttribute('data-i18n-placeholder')) {
                    el.setAttribute('placeholder', val);
                }
            });
        }
    } catch (error) {
        console.error("Translation Error:", error);
    }

    const displayNames = { 'id': 'Indonesia', 'en': 'English', 'jp': '日本語' };
    if(document.getElementById('current-lang')) {
        document.getElementById('current-lang').innerText = displayNames[lang];
    }
    localStorage.setItem('preferredLang', lang);
}

// --- BAGIAN 3: INISIALISASI ---
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan Slider
    showSlides();

    // Jalankan Bahasa yang tersimpan
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    if (savedLang !== 'en') {
        changeLanguage(savedLang);
    }
});
// --- LOGIKA COUNTDOWN TIMER ---
function startCountdown() {
    const targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000) + (23 * 60 * 60 * 1000); // 3 hari 23 jam ke depan

    setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = d.toString().padStart(2, '0');
        document.getElementById("hours").innerText = h.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = m.innerText = m.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = s.toString().padStart(2, '0');
    }, 1000);
}

// Panggil di DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    showSlides();
    startCountdown(); // Jalankan timer
    // ... kode translasi ...
});