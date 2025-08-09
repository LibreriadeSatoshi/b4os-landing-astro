// src/scripts/form-handler.js
// Manejo del formulario con envío seguro a Netlify Function

window.FormHandler = class FormHandler {
    constructor() {
        this.locationAPI = new window.LocationAPI();
        this.form = null;
        this.isSubmitting = false;
    }

    /**
     * Inicializar el manejo del formulario
     */
    async init() {
        this.form = document.getElementById('registrationForm');
        
        if (!this.form) {
            console.log('Formulario no encontrado en esta página');
            return;
        }

        console.log('Inicializando formulario...');
        await this.setupLocationSelectors();
        this.setupFormValidation();
        this.setupFormSubmission();
        
        console.log('Form handler initialized');
    }

    /**
     * Configurar selectores de ubicación
     */
    async setupLocationSelectors() {
        const countrySelect = document.getElementById('country');
        const citySelect = document.getElementById('city');

        if (!countrySelect || !citySelect) {
            console.error('Location selectors not found');
            return;
        }

        // Cargar países desde API
        await this.locationAPI.populateCountrySelect(countrySelect);

        // Evento para cambio de país
        countrySelect.addEventListener('change', async (e) => {
            const countryCode = e.target.value;
            
            if (countryCode) {
                await this.locationAPI.populateCitySelect(citySelect, countryCode);
            } else {
                citySelect.innerHTML = '<option value="">Primero selecciona un país</option>';
                citySelect.disabled = true;
            }
            
            // Ocultar input de "otra ciudad" si existe
            this.hideOtherCityInput();
        });

        // Evento para cambio de ciudad
        citySelect.addEventListener('change', (e) => {
            this.locationAPI.handleOtherCity(citySelect);
        });
    }

    /**
     * Configurar validación del formulario
     */
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    /**
     * Configurar envío del formulario
     */
    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.isSubmitting) return;
            
            await this.handleSubmit();
        });
    }

    /**
     * Validar campo individual
     */
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        this.clearFieldError(field);

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    isValid = false;
                    message = 'Por favor ingresa un email válido';
                }
                break;
                
            case 'url':
                if (value && !this.isValidURL(value)) {
                    isValid = false;
                    message = 'Por favor ingresa una URL válida';
                }
                break;
        }

        if (field.required && !value) {
            isValid = false;
            message = 'Este campo es requerido';
        }

        if (!isValid) {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    /**
     * Validar URL
     */
    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Mostrar error en campo
     */
    showFieldError(field, message) {
        field.classList.add('field-error');
        
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: var(--error-color); font-size: var(--font-size-sm); margin-top: 4px;';
        
        field.parentElement.appendChild(errorDiv);
    }

    /**
     * Limpiar error de campo
     */
    clearFieldError(field) {
        field.classList.remove('field-error');
        const errorMessage = field.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    /**
     * Ocultar input de otra ciudad
     */
    hideOtherCityInput() {
        const otherContainer = document.getElementById('otherCityContainer');
        if (otherContainer) {
            otherContainer.style.display = 'none';
            const input = otherContainer.querySelector('input');
            if (input) {
                input.required = false;
                input.value = '';
            }
        }
    }

    /**
     * Validar formulario completo
     */
    validateForm() {
        const formData = new FormData(this.form);
        const errors = [];

        // Validar campos requeridos
        const requiredFields = [
            { name: 'name', label: 'Nombre completo' },
            { name: 'email', label: 'Email' },
            { name: 'country', label: 'País' },
            { name: 'city', label: 'Ciudad' },
            { name: 'experience', label: 'Años de experiencia' },
            { name: 'dev-language', label: 'Lenguaje de programación principal' },
            { name: 'how-heard', label: 'Cómo te enteraste de B4OS' },
            { name: 'technologies', label: 'Tecnologías principales' },
            { name: 'github', label: 'Perfil de GitHub' },
            { name: 'motivation', label: 'Motivación' }
        ];

        requiredFields.forEach(field => {
            const value = formData.get(field.name);
            if (!value || value.toString().trim() === '') {
                errors.push(`${field.label} es requerido`);
            }
        });

        // Validar email
        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            errors.push('Por favor ingresa un email válido');
        }

        // Validar ubicación
        const city = formData.get('city');
        const otherCity = formData.get('otherCity');
        
        if (city === 'other' && (!otherCity || otherCity.trim() === '')) {
            errors.push('Por favor especifica el nombre de tu ciudad');
        }

        // Validar términos
        if (!formData.get('terms')) {
            errors.push('Debes aceptar los términos y condiciones');
        }

        // Validar URL de GitHub
        const github = formData.get('github');
        if (github && !this.isValidURL(github)) {
            errors.push('Por favor ingresa una URL de GitHub válida');
        }

        // Validar motivación
        const motivation = formData.get('motivation');
        if (motivation && motivation.length < 20) {
            errors.push('La motivación debe tener al menos 20 caracteres');
        }

        // Validar how-heard
        const howHeard = formData.get('how-heard');
        if (howHeard && howHeard.length < 1) {
            errors.push('Indica cómo te enteraste de B4OS');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Obtener datos de ubicación formateados
     */
    getLocationData(formData) {
        const countryCode = formData.get('country');
        const city = formData.get('city');
        const otherCity = formData.get('otherCity');

        // Buscar nombre del país en los datos cargados
        const country = this.locationAPI.countries.find(c => c.code === countryCode);
        const countryName = country ? country.name : countryCode;
        const cityName = city === 'other' ? otherCity : city;

        return {
            country: {
                code: countryCode,
                name: countryName,
                region: country ? country.region : null,
                subregion: country ? country.subregion : null
            },
            city: cityName
        };
    }

    /**
     * Manejar envío del formulario
     */
    async handleSubmit() {
        this.isSubmitting = true;
        
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Validar formulario
            const validation = this.validateForm();
            
            if (!validation.isValid) {
                window.showNotification(validation.errors[0], 'error');
                return;
            }

            // Mostrar estado de carga
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            // Obtener datos del formulario
            const formData = new FormData(this.form);
            const locationData = this.getLocationData(formData);
            
            // Preparar datos para envío
            const submissionData = {
                name: formData.get('name'),
                email: formData.get('email'),
                location: locationData,
                experience: formData.get('experience'),
                devLanguage: formData.get('dev-language'),
                howHeard: formData.get('how-heard'),
                technologies: formData.get('technologies'),
                github: formData.get('github'),
                motivation: formData.get('motivation'),
                timestamp: new Date().toISOString(),
                source: 'b4os-website',
                userAgent: navigator.userAgent,
                referrer: document.referrer
            };

            console.log('📤 Enviando datos a Netlify Function:', submissionData);

            // Enviar a Netlify Function (o simular en desarrollo)
            const result = await this.submitToNetlifyFunction(submissionData);

            // Éxito - mensaje basado en el entorno
            const successMessage = this.isLocalDevelopment() 
                ? '✅ [DESARROLLO] Formulario validado correctamente! (Simulación)'
                : '¡Aplicación enviada exitosamente! Te contactaremos pronto.';
            
            window.showNotification(successMessage, 'success');
            
            this.resetForm();

        } catch (error) {
            console.error('❌ Error submitting form:', error);
            
            let errorMessage = 'Error al enviar la aplicación. Por favor intenta de nuevo.';
            
            // Mostrar mensaje más específico si es posible
            if (error.message) {
                errorMessage = error.message;
            }
            
            window.showNotification(errorMessage, 'error');
        } finally {
            this.isSubmitting = false;
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    /**
     * Detectar si estamos en desarrollo local
     */
    isLocalDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('.local');
    }

    /**
     * Enviar datos - modo desarrollo vs producción
     */
    async submitToNetlifyFunction(data) {
        // En desarrollo local, simular envío exitoso
        if (this.isLocalDevelopment()) {
            console.log('🔧 MODO DESARROLLO - Simulando envío:', data);
            
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simular respuesta exitosa
            const simulatedResponse = {
                success: true,
                message: '✅ [DESARROLLO] Aplicación simulada exitosamente',
                services: {
                    customerIO: true
                },
                timestamp: new Date().toISOString(),
                note: 'En desarrollo local - no se envían datos reales'
            };
            
            console.log('🔧 MODO DESARROLLO - Respuesta simulada:', simulatedResponse);
            return simulatedResponse;
        }

        // En producción, usar Netlify Function real
        try {
            const response = await fetch('/.netlify/functions/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                let errorMessage = `Server error: ${response.status}`;
                
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (jsonError) {
                    // Si no puede parsear JSON, usar mensaje genérico
                    console.warn('Could not parse error response as JSON');
                }
                
                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            console.log('✅ PRODUCCIÓN - Netlify Function response:', responseData);
            return responseData;
            
        } catch (error) {
            console.error('❌ PRODUCCIÓN - Netlify Function error:', error);
            throw error;
        }
    }

    /**
     * Resetear formulario
     */
    resetForm() {
        this.form.reset();
        
        // Resetear selectores de ubicación
        const countrySelect = document.getElementById('country');
        const citySelect = document.getElementById('city');
        
        if (citySelect) {
            citySelect.innerHTML = '<option value="">Primero selecciona un país</option>';
            citySelect.disabled = true;
        }
        
        this.hideOtherCityInput();
        
        // Limpiar errores
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const fieldErrors = this.form.querySelectorAll('.field-error');
        fieldErrors.forEach(field => field.classList.remove('field-error'));
    }

    /**
     * Método para limpiar caché (útil para desarrollo)
     */
    clearLocationCache() {
        this.locationAPI.clearCache();
        window.showNotification('Caché de ubicaciones limpiado', 'info');
    }
};