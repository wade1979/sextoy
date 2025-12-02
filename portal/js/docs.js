// ============================================
// How It Works / Docs Page - Tree Menu Logic
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initDocsMenu();
    initDocsScrollSpy();
});

// ============================================
// Docs Menu Navigation
// ============================================
function initDocsMenu() {
    const menuLinks = document.querySelectorAll('.docs-menu-link');
    const sections = document.querySelectorAll('.docs-section');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // Update active state
                    menuLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Scroll to section
                    const offsetTop = targetSection.offsetTop - 52; // Account for navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('.mobile-menu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        document.querySelector('.mobile-menu-toggle').click();
                    }
                }
            }
        });
    });
}

// ============================================
// Scroll Spy - Highlight Active Section
// ============================================
function initDocsScrollSpy() {
    const sections = document.querySelectorAll('.docs-section');
    const menuLinks = document.querySelectorAll('.docs-menu-link[href^="#"]');
    
    if (sections.length === 0 || menuLinks.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-52px 0px -66%',
        threshold: 0
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                menuLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}




