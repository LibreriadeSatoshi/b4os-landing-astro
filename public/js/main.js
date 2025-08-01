// src/scripts/main.js
// Script principal con integración de APIs

document.addEventListener('DOMContentLoaded', async function() {
    // Detectar entorno
    const isLocal = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname.includes('.local');
    
    console.log(`🚀 Iniciando B4OS en modo: ${isLocal ? 'DESARROLLO' : 'PRODUCCIÓN'}`);
    
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav-menu-active');
            navToggle.classList.toggle('nav-toggle-active');
        });
    }
    
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('nav-menu-active')) {
                    navMenu.classList.remove('nav-menu-active');
                    navToggle.classList.remove('nav-toggle-active');
                }
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
    
    // Inicializar manejador de formulario con APIs
    try {
        // Wait for FormHandler to be available
        if (typeof window.FormHandler === 'undefined') {
            console.warn('⚠️ FormHandler no disponible aún, reintentando...');
            // Wait a bit more and try again
            setTimeout(async () => {
                await initializeForm();
            }, 500);
        } else {
            await initializeForm();
        }
        
    } catch (error) {
        console.error('❌ Error inicializando formulario:', error);
    }
   
    // Inicializar efectos de alianzas
    initPartnershipsSection();
    console.log('%cBienvenido a B4OS! 🚀', 'color: #f7931a; font-size: 16px; font-weight: bold;');
    console.log('%cBitcoin 4 Open Source - Programa de formación técnica', 'color: #1a1a1a; font-size: 12px;');
    
    if (isLocal) {
        console.log('%c🔧 MODO DESARROLLO ACTIVO', 'color: #10b981; font-size: 14px; font-weight: bold;');
        console.log('%cEl formulario simula envíos sin usar Customer.io real', 'color: #6b7280; font-size: 12px;');
    }
});

// Function to initialize form
async function initializeForm() {
    try {
        if (typeof window.FormHandler !== 'undefined') {
            const formHandler = new window.FormHandler();
            await formHandler.init();
            
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            console.log(`✅ Formulario inicializado en modo: ${isLocal ? 'DESARROLLO' : 'PRODUCCIÓN'}`);
            
            // Exponer función de limpieza de caché para desarrollo
            if (isLocal) {
                window.clearLocationCache = () => formHandler.clearLocationCache();
                window.debugFormHandler = formHandler;
                console.log('🔧 Funciones de desarrollo disponibles:');
                console.log('   - clearLocationCache()');
                console.log('   - debugFormHandler');
            }
        } else {
            throw new Error('FormHandler class not available');
        }
    } catch (error) {
        console.error('❌ Error en initializeForm:', error);
    }
}

// Función global para notificaciones
window.showNotification = function(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
};

// === EFECTOS PARA SECCIÓN DE ALIANZAS ===

/**
 * Inicializar efectos de la sección de alianzas
 */
function initializePartnershipsEffects() {
    // Intersection Observer para animaciones de entrada
    const partnershipsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animar las cards con delay escalonado
                if (entry.target.classList.contains('partners-grid')) {
                    const cards = entry.target.querySelectorAll('.partner-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
                
                // Animar logos de comunidad
                if (entry.target.classList.contains('community-logos')) {
                    const logos = entry.target.querySelectorAll('.community-logo');
                    logos.forEach((logo, index) => {
                        setTimeout(() => {
                            logo.style.opacity = '1';
                            logo.style.transform = 'scale(1)';
                        }, index * 150);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observar elementos de la sección de alianzas
    const partnershipsElements = document.querySelectorAll(
        '.partnerships .section-header, .partners-grid, .community-logos'
    );
    
    partnershipsElements.forEach(el => {
        // Configurar estado inicial para animaciones
        if (el.classList.contains('partners-grid')) {
            const cards = el.querySelectorAll('.partner-card');
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
        }
        
        if (el.classList.contains('community-logos')) {
            const logos = el.querySelectorAll('.community-logo');
            logos.forEach(logo => {
                logo.style.opacity = '0';
                logo.style.transform = 'scale(0.8)';
                logo.style.transition = 'opacity 0.5s ease, transform 0.5s ease, filter 0.3s ease';
            });
        }
        
        partnershipsObserver.observe(el);
    });
}

/**
 * Efectos adicionales para cards de aliados
 */
function setupPartnerCardEffects() {
    const partnerCards = document.querySelectorAll('.partner-card');
    
    partnerCards.forEach(card => {
        // Efecto de parallax sutil en hover
        card.addEventListener('mouseenter', (e) => {
            const logo = card.querySelector('.partner-logo');
            if (logo) {
                logo.style.transform = 'scale(1.05) translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', (e) => {
            const logo = card.querySelector('.partner-logo');
            if (logo) {
                logo.style.transform = 'scale(1) translateY(0)';
            }
        });
        
        // Efecto de inclinación 3D sutil
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', (e) => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

/**
 * Lazy loading inteligente para logos
 */
function setupLazyLoadingLogos() {
    const logoImages = document.querySelectorAll('.partner-logo, .community-logo');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Precargar imagen
                const tempImage = new Image();
                tempImage.onload = () => {
                    img.style.opacity = '1';
                    img.classList.add('loaded');
                };
                tempImage.onerror = () => {
                    console.warn(`Error cargando logo: ${img.src}`);
                    // Mostrar placeholder o imagen por defecto
                    img.style.opacity = '0.3';
                    img.alt = 'Logo no disponible';
                };
                
                if (img.dataset.src) {
                    tempImage.src = img.dataset.src;
                    img.src = img.dataset.src;
                } else {
                    tempImage.src = img.src;
                }
                
                imageObserver.unobserve(img);
            }
        });
    }, {
        threshold: 0.1
    });
    
    logoImages.forEach(img => {
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });
}

/**
 * Agregar efectos de hover mejorados para logos de comunidad
 */
function setupCommunityLogoEffects() {
    const communityLogos = document.querySelectorAll('.community-logo');
    
    communityLogos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            // Efecto de "levitación" para logos de comunidad
            logo.style.transform = 'scale(1.1) translateY(-5px)';
            logo.style.filter = 'grayscale(0%) opacity(1) drop-shadow(0 5px 15px rgba(247, 147, 26, 0.3))';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1) translateY(0)';
            logo.style.filter = 'grayscale(100%) opacity(0.7)';
        });
    });
}

/**
 * Función principal para inicializar todos los efectos de alianzas
 */
function initPartnershipsSection() {
    // Verificar que la sección existe
    const partnershipsSection = document.querySelector('.partnerships');
    if (!partnershipsSection) {
        console.log('Sección de alianzas no encontrada');
        return;
    }
    
    console.log('🤝 Inicializando efectos de alianzas...');
    
    try {
        initializePartnershipsEffects();
        setupPartnerCardEffects();
        setupLazyLoadingLogos();
        setupCommunityLogoEffects();
        
        console.log('✅ Efectos de alianzas inicializados correctamente');
    } catch (error) {
        console.error('❌ Error inicializando efectos de alianzas:', error);
    }
}

// Agregar al DOMContentLoaded existente en main.js
// document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    // Inicializar efectos de alianzas
//    initPartnershipsSection();
    
    // ... resto del código existente ...
//});