// src/scripts/form-handler.js
// Manejo del formulario con Customer.io integrado

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
            
            // Enviar a Customer.io
            await this.submitToCustomerIO(formData, locationData);

            // Éxito
            window.showNotification(
                '¡Aplicación enviada exitosamente! Te contactaremos pronto.',
                'success'
            );
            
            this.resetForm();

        } catch (error) {
            console.error('Error submitting form:', error);
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
     * Enviar datos a Customer.io
     */
    async submitToCustomerIO(formData, locationData) {
        // Verificar si Customer.io está disponible
        if (window.customerIO) {
            console.log('📤 Enviando a Customer.io vía JavaScript');
            return await window.customerIO.handleFormSubmission(formData, locationData);
        }
        
        // Fallback: envío directo a Customer.io Track API
        console.log('📤 Enviando a Customer.io vía API directa');
        return await this.submitDirectToCustomerIO(formData, locationData);
    }

    /**
     * Determinar residencia basada en la ubicación del usuario
     */
    determineResidencia(locationData) {
        const countryCode = locationData.country.code;
        const region = locationData.country.region;
        const subregion = locationData.country.subregion;
        
        // Lógica simple por ahora - puede expandirse más adelante
        if (countryCode === 'ES') {
            return {
                type: 'residencia_europa',
                name: 'Europa'
            };
        } else if (region === 'Americas' && subregion === 'South America') {
            return {
                type: 'residencia_sudamerica', 
                name: 'Sudamérica'
            };
        } else if (['CR', 'SV', 'GT', 'HN', 'NI', 'PA', 'CU', 'DO'].includes(countryCode)) {
            return {
                type: 'residencia_centroamerica_caribe',
                name: 'Centroamérica & Caribe'
            };
        } else if (countryCode === 'MX') {
            return {
                type: 'residencia_mexico',
                name: 'México'
            };
        } else {
            return {
                type: 'residencia_general',
                name: 'General'
            };
        }
    }

    /**
     * Debug: mostrar todos los datos que se van a enviar
     */
    debugFormData(formData, locationData, residencia) {
        console.group('🔍 DEBUG: Datos del formulario');
        
        console.log('📋 FormData raw:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: "${value}"`);
        }
        
        console.log('🌍 LocationData:', locationData);
        console.log('🏠 Residencia:', residencia);
        
        // Datos que se enviarán a Customer.io
        const personData = {
            email: formData.get('email'),
            name: formData.get('name'),
            country: locationData.country.name,
            country_code: locationData.country.code,
            city: locationData.city,
            experience: formData.get('experience'),
            technologies: formData.get('technologies'),
            github: formData.get('github') || '',
            motivation: formData.get('motivation'),
            residencia_type: residencia.type,
            residencia_name: residencia.name,
            created_at: Math.floor(Date.now() / 1000),
            source: 'b4os-website',
            form_type: 'registration',
            program_year: '2025'
        };
        
        console.log('👤 Person data que se enviará:', personData);
        
        const eventData = {
            name: 'registration_completed',
            data: {
                form_name: 'registrationForm',
                source: 'landing_page',
                
                // Datos personales
                user_name: formData.get('name'),
                user_email: formData.get('email'),
                
                // Datos de ubicación
                country: locationData.country.name,
                country_code: locationData.country.code,
                city: locationData.city,
                
                // Datos profesionales
                experience_level: formData.get('experience'),
                technologies: formData.get('technologies'),
                github_url: formData.get('github') || '',
                motivation: formData.get('motivation'),
                has_github: !!(formData.get('github')),
                
                // Datos de residencia
                residencia_type: residencia.type,
                residencia_name: residencia.name,
                assigned_program: residencia.type,
                
                // Metadatos
                timestamp: new Date().toISOString(),
                program_year: '2025'
            }
        };
        
        console.log('📧 Event data que se enviará:', eventData);
        console.groupEnd();
    }

    /**
     * Envío directo a Customer.io Track API (fallback)
     */
    async submitDirectToCustomerIO(formData, locationData) {
        const config = window.CUSTOMERIO_CONFIG;
        
        if (!config || !config.siteId) {
            throw new Error('Customer.io no configurado correctamente');
        }

        const email = formData.get('email');
        const residencia = this.determineResidencia(locationData);
        
        // 🔍 DEBUG: Mostrar todos los datos
        this.debugFormData(formData, locationData, residencia);
        
        // Si no hay API key, simular envío exitoso (solo para desarrollo)
        if (!config.apiKey) {
            console.warn('⚠️ API Key no configurada - simulando envío exitoso');
            return { success: true };
        }

        const auth = btoa(`${config.siteId}:${config.apiKey}`);

        try {
            // 1. Crear/actualizar persona CON TODOS LOS DATOS
            const personData = {
                email: email,
                name: formData.get('name'),
                country: locationData.country.name,
                country_code: locationData.country.code,
                city: locationData.city,
                experience: formData.get('experience'),
                technologies: formData.get('technologies'),
                github: formData.get('github') || '',
                motivation: formData.get('motivation'),
                residencia_type: residencia.type,
                residencia_name: residencia.name,
                created_at: Math.floor(Date.now() / 1000),
                source: 'b4os-website',
                form_type: 'registration',
                program_year: '2025'
            };

            console.log('🚀 Enviando person data:', JSON.stringify(personData, null, 2));

            const personResponse = await fetch(`https://track.customer.io/api/v1/customers/${encodeURIComponent(email)}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(personData)
            });

            if (!personResponse.ok) {
                const errorText = await personResponse.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`Error creando persona (${personResponse.status}): ${errorText}`);
            }

            console.log('✅ Persona creada con residencia:', residencia.type);

            // 2. Enviar evento CON TODOS LOS DATOS
            const eventData = {
                name: 'registration_completed',
                data: {
                    form_name: 'registrationForm',
                    source: 'landing_page',
                    
                    // Datos personales
                    user_name: formData.get('name'),
                    user_email: email,
                    
                    // Datos de ubicación
                    country: locationData.country.name,
                    country_code: locationData.country.code,
                    city: locationData.city,
                    
                    // Datos profesionales
                    experience_level: formData.get('experience'),
                    technologies: formData.get('technologies'),
                    github_url: formData.get('github') || '',
                    motivation: formData.get('motivation'),
                    has_github: !!(formData.get('github')),
                    
                    // Datos de residencia
                    residencia_type: residencia.type,
                    residencia_name: residencia.name,
                    assigned_program: residencia.type,
                    
                    // Metadatos
                    timestamp: new Date().toISOString(),
                    program_year: '2025'
                }
            };

            console.log('🚀 Enviando event data:', JSON.stringify(eventData, null, 2));

            const eventResponse = await fetch(`https://track.customer.io/api/v1/customers/${encodeURIComponent(email)}/events`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

            if (!eventResponse.ok) {
                const errorText = await eventResponse.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`Error enviando evento (${eventResponse.status}): ${errorText}`);
            }

            console.log('✅ Evento enviado con todos los datos');
            return { success: true };

        } catch (error) {
            console.error('❌ Error con Customer.io API:', error);
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