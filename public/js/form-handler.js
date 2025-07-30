// public/js/form-handler.js
// Manejo del formulario - CORREGIDO problema de inicialización

window.FormHandler = class FormHandler {
    constructor() {
        console.log('🔧 FormHandler constructor called');
        this.locationAPI = null;
        this.form = null;
        this.isSubmitting = false;
    }

    /**
     * Inicializar el manejo del formulario
     */
    async init() {
        console.log('🔧 FormHandler.init() started');
        
        // Verificar que LocationAPI esté disponible
        if (typeof window.LocationAPI === 'undefined') {
            throw new Error('LocationAPI not available');
        }
        
        // Crear instancia de LocationAPI
        console.log('🔧 Creating LocationAPI instance...');
        this.locationAPI = new window.LocationAPI();
        
        // Buscar formulario
        this.form = document.getElementById('registrationForm');
        
        if (!this.form) {
            console.log('ℹ️ Formulario no encontrado en esta página');
            return;
        }

        console.log('✅ Formulario encontrado, configurando...');
        
        // Configurar componentes paso a paso
        try {
            console.log('🔧 Step 1: Setting up location selectors...');
            await this.setupLocationSelectors();
            console.log('✅ Location selectors configured');
            
            console.log('🔧 Step 2: Setting up form validation...');
            this.setupFormValidation();
            console.log('✅ Form validation configured');
            
            console.log('🔧 Step 3: Setting up form submission...');
            this.setupFormSubmission();
            console.log('✅ Form submission configured');
            
            console.log('✅ FormHandler initialized successfully');
        } catch (error) {
            console.error('❌ Error in FormHandler.init():', error);
            throw error;
        }
    }

    /**
     * Configurar selectores de ubicación - MÉTODO CORREGIDO
     */
    async setupLocationSelectors() {
        console.log('🔧 setupLocationSelectors() started');
        
        const countrySelect = document.getElementById('country');
        const citySelect = document.getElementById('city');

        console.log('🔍 Looking for selectors:', {
            countrySelect: !!countrySelect,
            citySelect: !!citySelect,
            countrySelectId: countrySelect?.id,
            citySelectId: citySelect?.id
        });

        if (!countrySelect || !citySelect) {
            console.error('❌ Location selectors not found:', {
                country: !!countrySelect,
                city: !!citySelect
            });
            throw new Error('Location selectors not found');
        }

        console.log('✅ Location selectors found');

        // AQUÍ ESTABA EL PROBLEMA: Cargar países ANTES de configurar eventos
        console.log('🌍 About to populate country select...');
        try {
            await this.locationAPI.populateCountrySelect(countrySelect);
            console.log('✅ Country select populated during initialization');
        } catch (error) {
            console.error('❌ Error populating country select during init:', error);
            // No lanzar error, continuar con eventos
        }

        // Configurar eventos DESPUÉS de cargar los países
        console.log('🔧 Setting up country change event...');
        countrySelect.addEventListener('change', async (e) => {
            console.log('🔄 Country changed to:', e.target.value);
            const countryCode = e.target.value;
            
            if (countryCode) {
                try {
                    console.log('🏙️ Loading cities for:', countryCode);
                    await this.locationAPI.populateCitySelect(citySelect, countryCode);
                    console.log('✅ Cities loaded for:', countryCode);
                } catch (error) {
                    console.error('❌ Error loading cities for', countryCode, ':', error);
                }
            } else {
                citySelect.innerHTML = '<option value="">Primero selecciona un país</option>';
                citySelect.disabled = true;
                console.log('🔄 Country cleared, city select reset');
            }
            
            // Ocultar input de "otra ciudad" si existe
            this.hideOtherCityInput();
        });

        console.log('🔧 Setting up city change event...');
        citySelect.addEventListener('change', (e) => {
            console.log('🔄 City changed to:', e.target.value);
            this.locationAPI.handleOtherCity(citySelect);
        });

        console.log('✅ Location selector events configured');
    }

    /**
     * Configurar validación del formulario
     */
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        console.log(`🔧 Setting up validation for ${inputs.length} inputs`);
        
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
            console.log('📝 Form submitted');
            
            if (this.isSubmitting) {
                console.log('⏳ Form already submitting, ignoring');
                return;
            }
            
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
            { name: 'technologies', label: 'Tecnologías principales' },
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
                technologies: formData.get('technologies'),
                github: formData.get('github'),
                motivation: formData.get('motivation'),
                timestamp: new Date().toISOString(),
                source: 'b4os-website'
            };

            console.log('📤 Form data prepared:', submissionData);

            // Simular envío (reemplazar con tu lógica real)
            await this.submitToServer(submissionData);

            // Éxito
            window.showNotification(
                '¡Aplicación enviada exitosamente! Te contactaremos pronto.',
                'success'
            );
            
            this.resetForm();

        } catch (error) {
            console.error('❌ Error submitting form:', error);
            window.showNotification(
                'Error al enviar la aplicación. Por favor intenta de nuevo.',
                'error'
            );
        } finally {
            this.isSubmitting = false;
            submitButton.textContent = originalText;
            submitButton.disabled = false;
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
     * Enviar datos al servidor
     */
    async submitToServer(data) {
        // Simular delay del servidor
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('📤 Datos que se enviarían al servidor:', data);
        
        // Ejemplo de implementación real:
        /*
        const response = await fetch('/api/applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        return await response.json();
        */
    }

    /**
     * Método para limpiar caché (útil para desarrollo)
     */
    clearLocationCache() {
        if (this.locationAPI) {
            this.locationAPI.clearCache();
            window.showNotification('Caché de ubicaciones limpiado', 'info');
        }
    }

    /**
     * NUEVO: Método para reinicializar formulario (útil para debugging)
     */
    async reinitialize() {
        console.log('🔄 Reinitializing form...');
        try {
            await this.setupLocationSelectors();
            console.log('✅ Form reinitialized successfully');
        } catch (error) {
            console.error('❌ Error reinitializing form:', error);
        }
    }
};