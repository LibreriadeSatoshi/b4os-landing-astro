// src/scripts/main.js
// Script principal con integración de APIs

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando B4OS...');
    
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
    
    console.log('%cBienvenido a B4OS! 🚀', 'color: #f7931a; font-size: 16px; font-weight: bold;');
    console.log('%cBitcoin 4 Open Source - Programa de formación técnica', 'color: #1a1a1a; font-size: 12px;');
});

// Function to initialize form
async function initializeForm() {
    try {
        if (typeof window.FormHandler !== 'undefined') {
            const formHandler = new window.FormHandler();
            await formHandler.init();
            console.log('✅ Formulario inicializado con APIs');
            
            // Exponer función de limpieza de caché para desarrollo
            if (window.location.hostname === 'localhost') {
                window.clearLocationCache = () => formHandler.clearLocationCache();
                console.log('🔧 Función de desarrollo: clearLocationCache() disponible');
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