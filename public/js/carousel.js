// public/js/carousel.js
// Sistema de carousel para la sección hero

window.HeroCarousel = class HeroCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.dots = [];
        this.autoplayInterval = null;
        this.autoplayDelay = 6000; // 6 segundos
    }

    init() {
        // Buscar elementos del carousel
        this.carouselContainer = document.querySelector('.hero-carousel');
        
        if (!this.carouselContainer) {
            console.log('Carousel container not found');
            return;
        }

        this.slides = document.querySelectorAll('.carousel-slide');
        
        if (this.slides.length === 0) {
            console.log('No carousel slides found');
            return;
        }

        console.log(`Carousel initialized with ${this.slides.length} slides`);
        
        this.createNavigation();
        this.bindEvents();
        this.startAutoplay();
        
        // Asegurar que el primer slide está activo
        this.showSlide(0);
    }

    createNavigation() {
        // Crear contenedor de navegación
        const navContainer = document.createElement('div');
        navContainer.className = 'carousel-nav';
        navContainer.setAttribute('role', 'tablist');
        navContainer.setAttribute('aria-label', 'Navegación del carousel');
        
        // Crear dots para cada slide
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Ir al slide ${index + 1} de ${this.slides.length}`);
            dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
            
            this.dots.push(dot);
            navContainer.appendChild(dot);
        });
        
        // Añadir navegación al body en lugar del carousel para evitar z-index issues
        document.body.appendChild(navContainer);
        
        // Guardar referencia para poder eliminarla después
        this.navContainer = navContainer;
        
        // Solo mostrar en la sección hero
        this.updateNavVisibility();
    }

    bindEvents() {
        // Pausar autoplay cuando el mouse está sobre el carousel
        this.carouselContainer.addEventListener('mouseenter', () => {
            this.stopAutoplay();
        });
        
        // Reanudar autoplay cuando el mouse sale del carousel
        this.carouselContainer.addEventListener('mouseleave', () => {
            this.startAutoplay();
        });
        
        // Manejar teclado para accesibilidad
        this.carouselContainer.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
            }
        });

        // Manejar scroll para mostrar/ocultar navegación
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateNavVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        
        // Guardar referencias para limpiar después
        this.scrollHandler = handleScroll;
    }

    showSlide(index) {
        // Remover clase active de todos los slides
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (this.dots[i]) {
                this.dots[i].classList.remove('active');
                this.dots[i].setAttribute('aria-selected', 'false');
            }
        });
        
        // Activar el slide actual
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
            this.dots[index].setAttribute('aria-selected', 'true');
        }
        
        this.currentSlide = index;
    }

    updateNavVisibility() {
        if (!this.navContainer) return;
        
        // Verificar si estamos en la sección hero
        const heroSection = document.getElementById('inicio');
        if (!heroSection) {
            this.navContainer.style.display = 'none';
            return;
        }
        
        const rect = heroSection.getBoundingClientRect();
        const isHeroVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        this.navContainer.style.display = isHeroVisible ? 'flex' : 'none';
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
            // Reiniciar autoplay
            this.stopAutoplay();
            this.startAutoplay();
        }
    }

    startAutoplay() {
        this.stopAutoplay(); // Limpiar cualquier interval existente
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    destroy() {
        this.stopAutoplay();
        
        // Remover navegación del body
        if (this.navContainer && this.navContainer.parentNode) {
            this.navContainer.parentNode.removeChild(this.navContainer);
        }
        
        // Remover event listeners
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            window.removeEventListener('resize', this.scrollHandler);
        }
        
        // Limpiar referencias
        this.navContainer = null;
        this.scrollHandler = null;
        this.dots = [];
    }
};

// Función global para inicializar el carousel
window.initHeroCarousel = function() {
    if (typeof window.HeroCarousel === 'undefined') {
        console.error('HeroCarousel class not found');
        return;
    }
    
    const carousel = new window.HeroCarousel();
    carousel.init();
    
    // Exponer para debugging
    if (window.location.hostname === 'localhost') {
        window.debugCarousel = carousel;
    }
};

console.log('✅ Hero Carousel script loaded');