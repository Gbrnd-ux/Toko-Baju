async function changeLanguage(lang) {
    try {
        // 1. Ambil data dari file JSON sesuai bahasa yang dipilih
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) throw new Error('File bahasa tidak ditemukan');
        
        const translations = await response.json();

        // 2. Cari semua elemen dengan atribut data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.textContent = translations[key]; // Ganti teks secara otomatis
            }
        });

        // 3. Update label dropdown dan simpan ke localStorage
        document.getElementById('current-lang').textContent = translations['lang_label'];
        localStorage.setItem('preferredLang', lang);
        
        // Update atribut lang di HTML tag untuk SEO
        document.documentElement.lang = lang;

    } catch (error) {
        console.error('Gagal memuat bahasa:', error);
    }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    changeLanguage(savedLang);
});