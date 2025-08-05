// src/scripts/nav.js
// Manejo de la navegación y menú móvil

class NavigationHandler {
    constructor() {
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.header = document.querySelector('.header');
        this.body = document.body;
        this.isMenuOpen = false;
    }

    init() {
        if (!this.navToggle || !this.navMenu) {
            console.warn('Navigation elements not found');
            return;
        }

        this.setupMobileMenu();
        this.setupScrollEffects();
        
        console.log('✅ Navigation initialized');
    }

    setupMobileMenu() {
        // Toggle button click
        this.navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Only handle internal anchors
                if (href && href.startsWith('#')) {
                    if (window.innerWidth <= 768) {
                        this.closeMenu();
                    }
                }
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.navMenu.contains(e.target) && 
                !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        // Toggle classes
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        this.body.classList.toggle('menu-open');
        
        // Update ARIA attributes
        this.navToggle.setAttribute('aria-expanded', this.isMenuOpen);
        this.navToggle.setAttribute('aria-label', 
            this.isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
        );
    }

    closeMenu() {
        if (this.isMenuOpen) {
            this.isMenuOpen = false;
            this.navToggle.classList.remove('active');
            this.navMenu.classList.remove('active');
            this.body.classList.remove('menu-open');
            this.navToggle.setAttribute('aria-expanded', 'false');
            this.navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        }
    }

    setupScrollEffects() {
        if (!this.header) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                this.header.classList.add('header-scrolled');
            } else {
                this.header.classList.remove('header-scrolled');
            }
        });
    }
}

// Export for use in other files
window.NavigationHandler = NavigationHandler;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const nav = new NavigationHandler();
        nav.init();
    });
} else {
    const nav = new NavigationHandler();
    nav.init();
}