// public/js/location-api.js
// API robusta para países y ciudades - CORREGIDA

window.LocationAPI = class LocationAPI {
    constructor() {
        this.config = {
            // API gratuita para todos los países
            COUNTRIES_API: 'https://restcountries.com/v3.1/all?fields=name,cca2,translations,region,subregion',
            
            // Nueva API v2.1 de OpenDataSoft para ciudades
            CITIES_API_BASE: 'https://public.opendatasoft.com/api/explore/v2.1',
            CITIES_DATASET: 'geonames-all-cities-with-a-population-1000',
            
            // Configuración de caché
            CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 horas
            CACHE_PREFIX: 'b4os_location_'
        };
        
        this.countries = [];
        this.targetRegions = ['Americas', 'Europe']; // América + Europa (España)
        this.targetSubregions = ['South America', 'Central America', 'Caribbean', 'Southern Europe', 'North America'];
    }

    /**
     * Obtiene datos del caché
     */
    getFromCache(key) {
        try {
            const cached = localStorage.getItem(this.config.CACHE_PREFIX + key);
            if (cached) {
                const data = JSON.parse(cached);
                if (Date.now() - data.timestamp < this.config.CACHE_DURATION) {
                    return data.value;
                }
                // Caché expirada, eliminar
                localStorage.removeItem(this.config.CACHE_PREFIX + key);
            }
        } catch (error) {
            console.warn('Error reading cache:', error);
        }
        return null;
    }

    /**
     * Guarda datos en caché
     */
    saveToCache(key, value) {
        try {
            const cacheData = {
                value,
                timestamp: Date.now()
            };
            localStorage.setItem(this.config.CACHE_PREFIX + key, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Error saving to cache:', error);
        }
    }

    /**
     * Cargar países desde la API
     */
    async loadCountries() {
        // Intentar obtener del caché primero
        const cached = this.getFromCache('countries');
        if (cached) {
            console.log('Países cargados desde caché');
            this.countries = cached;
            return cached;
        }

        try {
            console.log('Cargando países desde API...');
            const response = await fetch(this.config.COUNTRIES_API);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const allCountries = await response.json();
            
            // Filtrar países relevantes
            const filteredCountries = allCountries
                .filter(country => {
                    // Incluir países de América y España
                    return this.targetRegions.includes(country.region) ||
                           (country.cca2 === 'ES'); // Asegurar que España esté incluida
                })
                .map(country => ({
                    code: country.cca2,
                    name: this.getCountryName(country),
                    nameEnglish: country.name.common,
                    region: country.region,
                    subregion: country.subregion
                }))
                .filter(country => country.name) // Eliminar países sin nombre
                .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

            this.countries = filteredCountries;
            this.saveToCache('countries', filteredCountries);
            
            console.log(`Cargados ${filteredCountries.length} países desde API`);
            return filteredCountries;
            
        } catch (error) {
            console.error('Error loading countries from API:', error);
            
            // Fallback a lista básica de países prioritarios
            return this.getFallbackCountries();
        }
    }

    /**
     * Obtener nombre del país en español
     */
    getCountryName(country) {
        // Priorizar nombre en español
        if (country.translations?.spa?.common) {
            return country.translations.spa.common;
        }
        
        // Mapeo manual para países importantes
        const spanishNames = {
            'AR': 'Argentina', 'BO': 'Bolivia', 'BR': 'Brasil', 'CL': 'Chile',
            'CO': 'Colombia', 'CR': 'Costa Rica', 'CU': 'Cuba', 'EC': 'Ecuador',
            'SV': 'El Salvador', 'ES': 'España', 'GT': 'Guatemala', 'HN': 'Honduras',
            'MX': 'México', 'NI': 'Nicaragua', 'PA': 'Panamá', 'PY': 'Paraguay',
            'PE': 'Perú', 'DO': 'República Dominicana', 'UY': 'Uruguay', 'VE': 'Venezuela',
            'US': 'Estados Unidos', 'CA': 'Canadá'
        };
        
        return spanishNames[country.cca2] || country.name.common;
    }

    /**
     * Lista de fallback para países prioritarios
     */
    getFallbackCountries() {
        console.log('Usando lista de fallback para países');
        
        const fallbackList = [
            { code: 'AR', name: 'Argentina', region: 'Americas', subregion: 'South America' },
            { code: 'BO', name: 'Bolivia', region: 'Americas', subregion: 'South America' },
            { code: 'BR', name: 'Brasil', region: 'Americas', subregion: 'South America' },
            { code: 'CL', name: 'Chile', region: 'Americas', subregion: 'South America' },
            { code: 'CO', name: 'Colombia', region: 'Americas', subregion: 'South America' },
            { code: 'CR', name: 'Costa Rica', region: 'Americas', subregion: 'Central America' },
            { code: 'CU', name: 'Cuba', region: 'Americas', subregion: 'Caribbean' },
            { code: 'EC', name: 'Ecuador', region: 'Americas', subregion: 'South America' },
            { code: 'SV', name: 'El Salvador', region: 'Americas', subregion: 'Central America' },
            { code: 'ES', name: 'España', region: 'Europe', subregion: 'Southern Europe' },
            { code: 'GT', name: 'Guatemala', region: 'Americas', subregion: 'Central America' },
            { code: 'HN', name: 'Honduras', region: 'Americas', subregion: 'Central America' },
            { code: 'MX', name: 'México', region: 'Americas', subregion: 'North America' },
            { code: 'NI', name: 'Nicaragua', region: 'Americas', subregion: 'Central America' },
            { code: 'PA', name: 'Panamá', region: 'Americas', subregion: 'Central America' },
            { code: 'PY', name: 'Paraguay', region: 'Americas', subregion: 'South America' },
            { code: 'PE', name: 'Perú', region: 'Americas', subregion: 'South America' },
            { code: 'DO', name: 'República Dominicana', region: 'Americas', subregion: 'Caribbean' },
            { code: 'UY', name: 'Uruguay', region: 'Americas', subregion: 'South America' },
            { code: 'VE', name: 'Venezuela', region: 'Americas', subregion: 'South America' }
        ];
        
        this.countries = fallbackList;
        return fallbackList;
    }

    /**
     * Cargar ciudades para un país usando SOLO listas curadas
     */
    async loadCitiesForCountry(countryCode) {
        // Intentar caché primero SOLO si es reciente (versión 2.0)
        const cached = this.getFromCache(`cities_v2_${countryCode}`);
        if (cached) {
            console.log(`Ciudades para ${countryCode} cargadas desde caché curado`);
            return cached;
        }

        console.log(`Cargando ciudades curadas para ${countryCode}...`);
        
        // USAR SOLO LISTAS CURADAS - NO API
        const cities = this.getCuratedCities(countryCode);
        
        if (cities.length > 0) {
            // Usar nuevo key de caché para evitar conflictos
            this.saveToCache(`cities_v2_${countryCode}`, cities);
            console.log(`✅ ${cities.length} ciudades curadas cargadas para ${countryCode}`);
            return cities;
        }
        
        // Si no hay lista para el país, devolver array vacío
        console.log(`⚠️ No hay lista curada para ${countryCode}`);
        return [];
    }

    /**
     * Lista de ciudades curadas (SIN BARRIOS)
     */
    getCuratedCities(countryCode) {
        console.log(`📋 Usando ciudades curadas para ${countryCode}`);
        
        const curatedCities = {
            'AR': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan', 'Neuquén'],
            'BO': ['La Paz', 'Santa Cruz de la Sierra', 'Cochabamba', 'Sucre', 'Oruro', 'Tarija', 'Potosí', 'El Alto'],
            'BR': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Belo Horizonte', 'Fortaleza', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre', 'Goiânia', 'Belém'],
            'CL': ['Santiago', 'Valparaíso', 'Concepción', 'Antofagasta', 'Temuco', 'Rancagua', 'Talca', 'Arica', 'Iquique', 'Puerto Montt'],
            'CO': ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Manizales'],
            'CR': ['San José', 'Cartago', 'Puntarenas', 'Heredia', 'Alajuela', 'Limón', 'Liberia'],
            'CU': ['La Habana', 'Santiago de Cuba', 'Camagüey', 'Holguín', 'Santa Clara', 'Guantánamo', 'Bayamo'],
            'EC': ['Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Machala', 'Santo Domingo', 'Portoviejo', 'Manta', 'Loja', 'Riobamba'],
            'SV': ['San Salvador', 'Santa Ana', 'San Miguel', 'Soyapango', 'Mejicanos', 'Apopa'],
            'ES': ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'Granada', 'Elche', 'Oviedo', 'Santander', 'Vitoria'],
            'GT': ['Ciudad de Guatemala', 'Mixco', 'Villa Nueva', 'Petapa', 'Quetzaltenango', 'Villa Canales', 'Escuintla'],
            'HN': ['Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba', 'El Progreso', 'Choluteca', 'Comayagua'],
            'MX': ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Torreón', 'Querétaro', 'Mérida', 'Mexicali', 'Aguascalientes', 'Culiacán', 'Hermosillo'],
            'NI': ['Managua', 'León', 'Granada', 'Masaya', 'Estelí', 'Chinandega', 'Matagalpa'],
            'PA': ['Ciudad de Panamá', 'San Miguelito', 'Tocumen', 'David', 'Arraiján', 'Las Cumbres', 'La Chorrera'],
            'PY': ['Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Capiatá', 'Lambaré', 'Fernando de la Mora'],
            'PE': ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Huancayo', 'Cusco', 'Chimbote', 'Iquitos', 'Piura', 'Tacna', 'Ica', 'Sullana'],
            'DO': ['Santo Domingo', 'Santiago', 'Los Alcarrizos', 'La Romana', 'San Pedro de Macorís', 'San Cristóbal', 'Puerto Plata'],
            'UY': ['Montevideo', 'Salto', 'Paysandú', 'Las Piedras', 'Rivera', 'Maldonado', 'Tacuarembó'],
            'VE': ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Ciudad Guayana', 'San Cristóbal', 'Maturín', 'Barcelona', 'Turmero'],
            'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
            'CA': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City']
        };
        
        return curatedCities[countryCode] || [];
    }

    /**
     * Poblar selector de países - MÉTODO CORREGIDO
     */
    async populateCountrySelect(selectElement) {
        if (!selectElement) {
            console.error('❌ Country select element not found');
            return;
        }

        console.log('🔧 Populating country select...');

        try {
            // Mostrar estado de carga
            selectElement.innerHTML = '<option value="">Cargando países...</option>';
            selectElement.disabled = true;

            // Cargar países
            const countries = await this.loadCountries();
            
            console.log(`🌍 Countries loaded for select: ${countries.length} countries`);
            console.log('Sample countries:', countries.slice(0, 3));

            // Limpiar select y añadir opción predeterminada
            selectElement.innerHTML = '';
            
            // Opción predeterminada
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Selecciona tu país';
            selectElement.appendChild(defaultOption);
            
            // Añadir cada país
            let addedCount = 0;
            countries.forEach((country, index) => {
                try {
                    const option = document.createElement('option');
                    option.value = country.code;
                    option.textContent = country.name;
                    selectElement.appendChild(option);
                    addedCount++;
                    
                    // Log cada 10 países para debugging
                    if (index % 10 === 0) {
                        console.log(`Added ${index + 1}/${countries.length}: ${country.name} (${country.code})`);
                    }
                } catch (error) {
                    console.error(`Error adding country ${country.name}:`, error);
                }
            });

            // Habilitar select
            selectElement.disabled = false;
            
            console.log(`✅ Country select populated successfully with ${addedCount} countries`);
            console.log(`Final option count: ${selectElement.options.length}`);
            
            // Verificación adicional
            if (selectElement.options.length <= 1) {
                console.error('❌ PROBLEM: Select has no countries after population!');
                console.log('SelectElement:', selectElement);
                console.log('Countries array:', countries);
                
                // Intentar método alternativo
                console.log('🔄 Trying alternative population method...');
                this.populateCountrySelectAlternative(selectElement, countries);
            }
            
        } catch (error) {
            console.error('❌ Error populating country select:', error);
            selectElement.innerHTML = '<option value="">Error cargando países</option>';
            selectElement.disabled = false;
        }
    }

    /**
     * Método alternativo para poblar países (fallback)
     */
    populateCountrySelectAlternative(selectElement, countries) {
        console.log('🔄 Using alternative population method...');
        
        try {
            // Limpiar completamente
            while (selectElement.firstChild) {
                selectElement.removeChild(selectElement.firstChild);
            }
            
            // Método alternativo usando innerHTML
            let optionsHTML = '<option value="">Selecciona tu país</option>';
            
            countries.forEach(country => {
                optionsHTML += `<option value="${country.code}">${country.name}</option>`;
            });
            
            selectElement.innerHTML = optionsHTML;
            
            console.log(`✅ Alternative method: ${selectElement.options.length} options added`);
            
        } catch (error) {
            console.error('❌ Alternative method also failed:', error);
        }
    }

    /**
     * Poblar selector de ciudades
     */
    async populateCitySelect(selectElement, countryCode) {
        if (!selectElement) {
            console.error('City select element not found');
            return;
        }

        selectElement.innerHTML = '<option value="">Selecciona tu ciudad</option>';
        
        if (!countryCode) {
            selectElement.innerHTML = '<option value="">Primero selecciona un país</option>';
            selectElement.disabled = true;
            return;
        }

        try {
            selectElement.innerHTML = '<option value="">Cargando ciudades...</option>';
            selectElement.disabled = true;

            const cities = await this.loadCitiesForCountry(countryCode);
            
            selectElement.innerHTML = '<option value="">Selecciona tu ciudad</option>';
            
            if (cities.length > 0) {
                cities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    selectElement.appendChild(option);
                });
                console.log(`✅ Populated ${cities.length} cities for ${countryCode}`);
            } else {
                console.log(`⚠️ No cities found for ${countryCode}`);
            }
            
            // Siempre añadir opción "Otra"
            const otherOption = document.createElement('option');
            otherOption.value = 'other';
            otherOption.textContent = 'Mi ciudad no está en la lista';
            selectElement.appendChild(otherOption);
            
            selectElement.disabled = false;
            
        } catch (error) {
            console.error('Error populating cities:', error);
            selectElement.innerHTML = '<option value="other">Mi ciudad no está en la lista</option>';
            selectElement.disabled = false;
        }
    }

    /**
     * Manejar selección de "Otra ciudad"
     */
    handleOtherCity(citySelect) {
        const otherCityContainer = document.getElementById('otherCityContainer');
        
        if (citySelect.value === 'other') {
            if (!otherCityContainer) {
                this.createOtherCityInput(citySelect);
            } else {
                otherCityContainer.style.display = 'block';
                otherCityContainer.querySelector('input').required = true;
            }
        } else {
            if (otherCityContainer) {
                otherCityContainer.style.display = 'none';
                otherCityContainer.querySelector('input').required = false;
            }
        }
    }

    /**
     * Crear input para "otra ciudad"
     */
    createOtherCityInput(citySelect) {
        const cityGroup = citySelect.parentElement;
        
        const otherContainer = document.createElement('div');
        otherContainer.id = 'otherCityContainer';
        otherContainer.className = 'form-group';
        otherContainer.style.marginTop = '10px';
        
        otherContainer.innerHTML = `
            <label for="otherCity">Especifica tu ciudad *</label>
            <input type="text" id="otherCity" name="otherCity" 
                   placeholder="Nombre de tu ciudad" required>
        `;
        
        cityGroup.insertAdjacentElement('afterend', otherContainer);
        console.log('✅ Created other city input');
    }

    /**
     * Limpiar caché (MEJORADO - incluyendo caché antiguo)
     */
    clearCache() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.config.CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        console.log('🗑️ Cache cleared (incluyendo caché antiguo de API)');
    }
};