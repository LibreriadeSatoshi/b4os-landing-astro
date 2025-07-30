// public/js/main.js
// Script principal con debugging mejorado

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando B4OS...');
    console.log('DOM ready, starting initialization');
    
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav-menu-active');
            navToggle.classList.toggle('nav-toggle-active');
        });
        console.log('✅ Navigation toggle initialized');
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
    console.log('✅ Smooth scrolling initialized');
    
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
    console.log('✅ Header scroll effect initialized');
    
    // Verificar si estamos en la página con formulario
    const form = document.getElementById('registrationForm');
    if (!form) {
        console.log('ℹ️ No hay formulario en esta página, saltando inicialización');
        return;
    }
    
    console.log('📝 Formulario encontrado, inicializando...');
    
    // Verificar que las clases estén disponibles
    if (typeof window.LocationAPI === 'undefined') {
        console.error('❌ LocationAPI no está disponible');
        return;
    }
    
    if (typeof window.FormHandler === 'undefined') {
        console.error('❌ FormHandler no está disponible');
        return;
    }
    
    console.log('✅ Classes disponibles, inicializando formulario...');
    
    // Inicializar FormHandler
    try {
        const formHandler = new window.FormHandler();
        await formHandler.init();
        console.log('✅ FormHandler inicializado correctamente');
        
        // Test directo de la API
        console.log('🧪 Testing LocationAPI directamente...');
        const locationAPI = new window.LocationAPI();
        const countries = await locationAPI.loadCountries();
        console.log('🌍 Países cargados:', countries.length, countries);
        
        // Exponer funciones para debugging
        if (window.location.hostname === 'localhost') {
            window.debugFormHandler = formHandler;
            window.debugLocationAPI = locationAPI;
            window.clearLocationCache = () => locationAPI.clearCache();
            console.log('🔧 Debug functions available: debugFormHandler, debugLocationAPI, clearLocationCache()');
        }
        
    } catch (error) {
        console.error('❌ Error inicializando formulario:', error);
        console.error('Stack trace:', error.stack);
        
        // Intentar diagnóstico adicional
        console.log('🔍 Diagnóstico adicional:');
        console.log('- Window.LocationAPI exists:', typeof window.LocationAPI !== 'undefined');
        console.log('- Window.FormHandler exists:', typeof window.FormHandler !== 'undefined');
        console.log('- Form element exists:', !!form);
        console.log('- Country select exists:', !!document.getElementById('country'));
        console.log('- City select exists:', !!document.getElementById('city'));
    }
    
    console.log('%cBienvenido a B4OS! 🚀', 'color: #f7931a; font-size: 16px; font-weight: bold;');
    console.log('%cBitcoin 4 Open Source - Programa de formación técnica', 'color: #1a1a1a; font-size: 12px;');
});

// Función global para notificaciones (mejorada)
window.showNotification = function(message, type = 'info') {
    console.log(`📢 Notification [${type}]:`, message);
    
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

// Función para debugging manual
window.debugFormInit = async function() {
    console.log('🔧 Manual form initialization...');
    
    if (typeof window.FormHandler === 'undefined') {
        console.error('FormHandler not available');
        return;
    }
    
    try {
        const formHandler = new window.FormHandler();
        await formHandler.init();
        console.log('✅ Manual initialization successful');
        return formHandler;
    } catch (error) {
        console.error('❌ Manual initialization failed:', error);
        throw error;
    }
};