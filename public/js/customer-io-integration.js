// src/scripts/customer-io-integration.js
// Integración completa con Customer.io

window.CustomerIOIntegration = class CustomerIOIntegration {
    constructor(siteId, apiKey) {
        this.siteId = siteId;
        this.apiKey = apiKey;
        this.initialized = false;
    }

    /**
     * Inicializar Customer.io snippet
     */
    init() {
        if (this.initialized) return;

        // Verificar que tenemos las credenciales
        if (!this.siteId) {
            console.error('Customer.io Site ID no configurado');
            return;
        }

        try {
            // Inicializar el objeto _cio
            window._cio = window._cio || [];
            
            // Función helper para el tracking
            const a = function(f) {
                return function() {
                    window._cio.push([f].concat(Array.prototype.slice.call(arguments, 0)));
                };
            };
            
            // Métodos disponibles
            const b = ['load', 'identify', 'sidentify', 'track', 'page'];
            for (let c = 0; c < b.length; c++) {
                window._cio[b[c]] = a(b[c]);
            }
            
            // Cargar el script de tracking
            const script = document.createElement('script');
            const firstScript = document.getElementsByTagName('script')[0];
            
            script.async = true;
            script.id = 'cio-tracker';
            script.setAttribute('data-site-id', this.siteId);
            script.src = 'https://assets.customer.io/assets/track.js';
            
            firstScript.parentNode.insertBefore(script, firstScript);
            
            this.initialized = true;
            console.log('✅ Customer.io tracking inicializado');
            
            // Identificar página actual
            this.trackPageView();
            
        } catch (error) {
            console.error('Error inicializando Customer.io:', error);
        }
    }

    /**
     * Identificar un usuario
     */
    identify(userId, attributes = {}) {
        if (!this.initialized || !window._cio) {
            console.warn('Customer.io no inicializado');
            return;
        }

        try {
            console.log('🔥 IDENTIFICANDO USUARIO:', userId, attributes);
            
            window._cio.identify({
                id: userId,
                ...attributes
            });
            console.log('✅ Usuario identificado en Customer.io:', userId);
        } catch (error) {
            console.error('Error identificando usuario:', error);
        }
    }

    /**
     * Trackear un evento
     */
    track(eventName, eventData = {}) {
        if (!this.initialized || !window._cio) {
            console.warn('Customer.io no inicializado');
            return;
        }

        try {
            console.log('🔥 TRACKEANDO EVENTO:', eventName, eventData);
            
            window._cio.track(eventName, eventData);
            console.log('✅ Evento trackeado:', eventName, eventData);
        } catch (error) {
            console.error('Error trackeando evento:', error);
        }
    }

    /**
     * Trackear vista de página
     */
    trackPageView() {
        if (!this.initialized || !window._cio) return;

        try {
            window._cio.page();
            console.log('📄 Page view trackeada');
        } catch (error) {
            console.error('Error trackeando page view:', error);
        }
    }

    /**
     * Procesar envío de formulario para Customer.io
     */
    handleFormSubmission(formData, locationData) {
        if (!this.initialized) {
            console.warn('Customer.io no inicializado - enviando datos directamente');
            return this.sendDirectToCustomerIO(formData, locationData);
        }

        try {
            const email = formData.get('email');
            const userId = email; // Usar email como ID

            // Determinar residencia
            const residencia = this.determineResidencia(locationData);

            // 1. IDENTIFICAR USUARIO CON TODOS SUS ATRIBUTOS
            const userAttributes = {
                email: email,
                name: formData.get('name'),
                country: locationData.country.name,
                country_code: locationData.country.code,
                city: locationData.city,
                experience: formData.get('experience'),
                dev_language: formData.get('dev-language') || '',
                how_heard: formData.get('how-heard') || '',
                technologies: formData.get('technologies'),
                github: formData.get('github') || '',
                motivation: formData.get('motivation'),
                
                // Datos de residencia
                residencia_type: residencia.type,
                residencia_name: residencia.name,
                
                // Metadatos
                created_at: Math.floor(Date.now() / 1000),
                source: 'b4os-website',
                form_type: 'registration',
                program_year: '2025'
            };

            console.log('🚀 IDENTIFICANDO CON TODOS LOS DATOS:', userAttributes);
            this.identify(userId, userAttributes);

            // 2. TRACKEAR EVENTO CON DATOS COMPLETOS
            const eventData = {
                form_name: 'registrationForm',
                source: 'landing_page',
                
                // Datos personales EN EL EVENTO TAMBIÉN
                user_name: formData.get('name'),
                user_email: email,
                
                // Datos de ubicación
                country: locationData.country.name,
                country_code: locationData.country.code,
                city: locationData.city,
                
                // Datos profesionales EN EL EVENTO
                experience_level: formData.get('experience'),
                dev_language: formData.get('dev-language') || '',
                how_heard: formData.get('how-heard') || '', 
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
            };

            console.log('🚀 TRACKEANDO CON TODOS LOS DATOS:', eventData);
            this.track('registration_completed', eventData);

            console.log('✅ Formulario procesado con Customer.io JavaScript');
            return Promise.resolve({ success: true });

        } catch (error) {
            console.error('Error procesando formulario con Customer.io:', error);
            // Fallback a envío directo
            return this.sendDirectToCustomerIO(formData, locationData);
        }
    }

    /**
     * Determinar residencia (copiado del form-handler)
     */
    determineResidencia(locationData) {
        const countryCode = locationData.country.code;
        const region = locationData.country.region;
        const subregion = locationData.country.subregion;
        /* Por ahora no usamos subregión, pero se puede extender más adelante */
        /*if (countryCode === 'ES') {
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
        */
        // Simplificación para el ejemplo
        return {
            type: 'residencia_sudamerica', 
            name: 'Sudamérica'
        };
    }

    /**
     * Envío directo usando Track API (fallback)
     */
    async sendDirectToCustomerIO(formData, locationData) {
        if (!this.apiKey) {
            throw new Error('API Key no configurada para envío directo');
        }

        const email = formData.get('email');
        const auth = btoa(`${this.siteId}:${this.apiKey}`);
        const residencia = this.determineResidencia(locationData);

        try {
            // 1. Crear/actualizar persona
            const personData = {
                email: email,
                name: formData.get('name'),
                country: locationData.country.name,
                country_code: locationData.country.code,
                city: locationData.city,
                experience: formData.get('experience'),
                dev_language: formData.get('dev-language') || '',
                how_heard: formData.get('how-heard') || '', 
                technologies: formData.get('technologies'),
                github: formData.get('github') || '',
                motivation: formData.get('motivation'),
                residencia_type: residencia.type,
                residencia_name: residencia.name,
                created_at: Math.floor(Date.now() / 1000),
                source: 'b4os-website'
            };

            const personResponse = await fetch(`https://track.customer.io/api/v1/customers/${email}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(personData)
            });

            if (!personResponse.ok) {
                throw new Error(`Error creando persona: ${personResponse.status}`);
            }

            // 2. Enviar evento
            const eventData = {
                name: 'registration_completed',
                data: {
                    source: 'landing_page',
                    country: locationData.country.name,
                    city: locationData.city,
                    experience_level: formData.get('experience'),
                    dev_language: formData.get('dev-language') || '',
                    how_heard: formData.get('how-heard') || '',
                    technologies: formData.get('technologies'),
                    github_url: formData.get('github') || '',
                    motivation: formData.get('motivation'),
                    has_github: !!(formData.get('github')),
                    residencia_type: residencia.type
                }
            };

            const eventResponse = await fetch(`https://track.customer.io/api/v1/customers/${email}/events`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

            if (!eventResponse.ok) {
                throw new Error(`Error enviando evento: ${eventResponse.status}`);
            }

            console.log('✅ Datos enviados directamente a Customer.io');
            return { success: true };

        } catch (error) {
            console.error('Error con envío directo a Customer.io:', error);
            throw error;
        }
    }
};