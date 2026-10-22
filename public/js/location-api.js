// public/js/location-api.js
// API robusta para países y ciudades - CORREGIDA

globalThis.LocationAPI = class LocationAPI {
  constructor() {
    this.config = {
      // Nueva API v2.1 de OpenDataSoft para ciudades
      CITIES_API_BASE: "https://public.opendatasoft.com/api/explore/v2.1",
      CITIES_DATASET: "geonames-all-cities-with-a-population-1000",

      // Configuración de caché
      CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 horas
      CACHE_PREFIX: "b4os_location_",
    };

    this.countries = [];
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
      globalThis.ErrorHandler.warn("Cache read", error);
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
        timestamp: Date.now(),
      };
      localStorage.setItem(
        this.config.CACHE_PREFIX + key,
        JSON.stringify(cacheData),
      );
    } catch (error) {
      globalThis.ErrorHandler.warn("Cache save", error);
    }
  }

  /**
   * Países de América, Europa y África (más España), con nombre en español.
   * Lista estática: la API de restcountries v3.1 está deprecada y el formulario
   * no puede depender de un servicio externo. Fuente: mledoze/countries.
   */
  async loadCountries() {
    if (this.countries.length) return this.countries;

    // Array format: [code, name, region, subregion]
    const rawData = [
      ["AX", "Alandia", "Europe", "Northern Europe"],
      ["AL", "Albania", "Europe", "Southeast Europe"],
      ["DE", "Alemania", "Europe", "Western Europe"],
      ["AD", "Andorra", "Europe", "Southern Europe"],
      ["AO", "Angola", "Africa", "Middle Africa"],
      ["AI", "Anguilla", "Americas", "Caribbean"],
      ["AG", "Antigua y Barbuda", "Americas", "Caribbean"],
      ["DZ", "Argelia", "Africa", "Northern Africa"],
      ["AR", "Argentina", "Americas", "South America"],
      ["AW", "Aruba", "Americas", "Caribbean"],
      ["AT", "Austria", "Europe", "Central Europe"],
      ["BS", "Bahamas", "Americas", "Caribbean"],
      ["BB", "Barbados", "Americas", "Caribbean"],
      ["BE", "Bélgica", "Europe", "Western Europe"],
      ["BZ", "Belice", "Americas", "Central America"],
      ["BJ", "Benín", "Africa", "Western Africa"],
      ["BM", "Bermudas", "Americas", "North America"],
      ["BY", "Bielorrusia", "Europe", "Eastern Europe"],
      ["BO", "Bolivia", "Americas", "South America"],
      ["BA", "Bosnia y Herzegovina", "Europe", "Southeast Europe"],
      ["BW", "Botswana", "Africa", "Southern Africa"],
      ["BR", "Brasil", "Americas", "South America"],
      ["BG", "Bulgaria", "Europe", "Southeast Europe"],
      ["BF", "Burkina Faso", "Africa", "Western Africa"],
      ["BI", "Burundi", "Africa", "Eastern Africa"],
      ["CV", "Cabo Verde", "Africa", "Western Africa"],
      ["CM", "Camerún", "Africa", "Middle Africa"],
      ["CA", "Canadá", "Americas", "North America"],
      ["BQ", "Caribe Neerlandés", "Americas", "Caribbean"],
      ["TD", "Chad", "Africa", "Middle Africa"],
      ["CZ", "Chequia", "Europe", "Central Europe"],
      ["CL", "Chile", "Americas", "South America"],
      ["CY", "Chipre", "Europe", "Southern Europe"],
      ["VA", "Ciudad del Vaticano", "Europe", "Southern Europe"],
      ["CO", "Colombia", "Americas", "South America"],
      ["KM", "Comoras", "Africa", "Eastern Africa"],
      ["CG", "Congo", "Africa", "Middle Africa"],
      ["CD", "Congo (Rep. Dem.)", "Africa", "Middle Africa"],
      ["CI", "Costa de Marfil", "Africa", "Western Africa"],
      ["CR", "Costa Rica", "Americas", "Central America"],
      ["HR", "Croacia", "Europe", "Southeast Europe"],
      ["CU", "Cuba", "Americas", "Caribbean"],
      ["CW", "Curazao", "Americas", "Caribbean"],
      ["DK", "Dinamarca", "Europe", "Northern Europe"],
      ["DJ", "Djibouti", "Africa", "Eastern Africa"],
      ["DM", "Dominica", "Americas", "Caribbean"],
      ["EC", "Ecuador", "Americas", "South America"],
      ["EG", "Egipto", "Africa", "Northern Africa"],
      ["SV", "El Salvador", "Americas", "Central America"],
      ["ER", "Eritrea", "Africa", "Eastern Africa"],
      ["SK", "Eslovaquia", "Europe", "Central Europe"],
      ["SI", "Eslovenia", "Europe", "Central Europe"],
      ["ES", "España", "Europe", "Southern Europe"],
      ["US", "Estados Unidos", "Americas", "North America"],
      ["EE", "Estonia", "Europe", "Northern Europe"],
      ["SZ", "Esuatini", "Africa", "Southern Africa"],
      ["ET", "Etiopía", "Africa", "Eastern Africa"],
      ["FI", "Finlandia", "Europe", "Northern Europe"],
      ["FR", "Francia", "Europe", "Western Europe"],
      ["GA", "Gabón", "Africa", "Middle Africa"],
      ["GM", "Gambia", "Africa", "Western Africa"],
      ["GH", "Ghana", "Africa", "Western Africa"],
      ["GI", "Gibraltar", "Europe", "Southern Europe"],
      ["GR", "Grecia", "Europe", "Southern Europe"],
      ["GD", "Grenada", "Americas", "Caribbean"],
      ["GL", "Groenlandia", "Americas", "North America"],
      ["GP", "Guadalupe", "Americas", "Caribbean"],
      ["GT", "Guatemala", "Americas", "Central America"],
      ["GF", "Guayana Francesa", "Americas", "South America"],
      ["GG", "Guernsey", "Europe", "Northern Europe"],
      ["GN", "Guinea", "Africa", "Western Africa"],
      ["GQ", "Guinea Ecuatorial", "Africa", "Middle Africa"],
      ["GW", "Guinea-Bisáu", "Africa", "Western Africa"],
      ["GY", "Guyana", "Americas", "South America"],
      ["HT", "Haití", "Americas", "Caribbean"],
      ["HN", "Honduras", "Americas", "Central America"],
      ["HU", "Hungría", "Europe", "Central Europe"],
      ["IE", "Irlanda", "Europe", "Northern Europe"],
      ["IM", "Isla de Man", "Europe", "Northern Europe"],
      ["IS", "Islandia", "Europe", "Northern Europe"],
      ["KY", "Islas Caimán", "Americas", "Caribbean"],
      ["FO", "Islas Faroe", "Europe", "Northern Europe"],
      ["FK", "Islas Malvinas", "Americas", "South America"],
      ["SJ", "Islas Svalbard y Jan Mayen", "Europe", "Northern Europe"],
      ["TC", "Islas Turks y Caicos", "Americas", "Caribbean"],
      ["UM", "Islas Ultramarinas Menores de Estados Unidos", "Americas", "North America"],
      ["VI", "Islas Vírgenes de los Estados Unidos", "Americas", "Caribbean"],
      ["VG", "Islas Vírgenes del Reino Unido", "Americas", "Caribbean"],
      ["IT", "Italia", "Europe", "Southern Europe"],
      ["JM", "Jamaica", "Americas", "Caribbean"],
      ["JE", "Jersey", "Europe", "Northern Europe"],
      ["KE", "Kenia", "Africa", "Eastern Africa"],
      ["XK", "Kosovo", "Europe", "Southeast Europe"],
      ["LS", "Lesotho", "Africa", "Southern Africa"],
      ["LV", "Letonia", "Europe", "Northern Europe"],
      ["LR", "Liberia", "Africa", "Western Africa"],
      ["LY", "Libia", "Africa", "Northern Africa"],
      ["LI", "Liechtenstein", "Europe", "Western Europe"],
      ["LT", "Lituania", "Europe", "Northern Europe"],
      ["LU", "Luxemburgo", "Europe", "Western Europe"],
      ["MK", "Macedonia del Norte", "Europe", "Southeast Europe"],
      ["MG", "Madagascar", "Africa", "Eastern Africa"],
      ["MW", "Malawi", "Africa", "Eastern Africa"],
      ["ML", "Mali", "Africa", "Western Africa"],
      ["MT", "Malta", "Europe", "Southern Europe"],
      ["MA", "Marruecos", "Africa", "Northern Africa"],
      ["MQ", "Martinica", "Americas", "Caribbean"],
      ["MU", "Mauricio", "Africa", "Eastern Africa"],
      ["MR", "Mauritania", "Africa", "Western Africa"],
      ["YT", "Mayotte", "Africa", "Eastern Africa"],
      ["MX", "México", "Americas", "North America"],
      ["MD", "Moldavia", "Europe", "Eastern Europe"],
      ["MC", "Mónaco", "Europe", "Western Europe"],
      ["ME", "Montenegro", "Europe", "Southeast Europe"],
      ["MS", "Montserrat", "Americas", "Caribbean"],
      ["MZ", "Mozambique", "Africa", "Eastern Africa"],
      ["NA", "Namibia", "Africa", "Southern Africa"],
      ["NI", "Nicaragua", "Americas", "Central America"],
      ["NE", "Níger", "Africa", "Western Africa"],
      ["NG", "Nigeria", "Africa", "Western Africa"],
      ["NO", "Noruega", "Europe", "Northern Europe"],
      ["NL", "Países Bajos", "Europe", "Western Europe"],
      ["PA", "Panamá", "Americas", "Central America"],
      ["PY", "Paraguay", "Americas", "South America"],
      ["PE", "Perú", "Americas", "South America"],
      ["PL", "Polonia", "Europe", "Central Europe"],
      ["PT", "Portugal", "Europe", "Southern Europe"],
      ["PR", "Puerto Rico", "Americas", "Caribbean"],
      ["GB", "Reino Unido", "Europe", "Northern Europe"],
      ["CF", "República Centroafricana", "Africa", "Middle Africa"],
      ["DO", "República Dominicana", "Americas", "Caribbean"],
      ["RE", "Reunión", "Africa", "Eastern Africa"],
      ["RW", "Ruanda", "Africa", "Eastern Africa"],
      ["RO", "Rumania", "Europe", "Southeast Europe"],
      ["RU", "Rusia", "Europe", "Eastern Europe"],
      ["EH", "Sahara Occidental", "Africa", "Northern Africa"],
      ["MF", "Saint Martin", "Americas", "Caribbean"],
      ["BL", "San Bartolomé", "Americas", "Caribbean"],
      ["KN", "San Cristóbal y Nieves", "Americas", "Caribbean"],
      ["SM", "San Marino", "Europe", "Southern Europe"],
      ["PM", "San Pedro y Miquelón", "Americas", "North America"],
      ["VC", "San Vicente y Granadinas", "Americas", "Caribbean"],
      ["SH", "Santa Elena, Ascensión y Tristán de Acuña", "Africa", "Western Africa"],
      ["LC", "Santa Lucía", "Americas", "Caribbean"],
      ["ST", "Santo Tomé y Príncipe", "Africa", "Middle Africa"],
      ["SN", "Senegal", "Africa", "Western Africa"],
      ["RS", "Serbia", "Europe", "Southeast Europe"],
      ["SC", "Seychelles", "Africa", "Eastern Africa"],
      ["SL", "Sierra Leone", "Africa", "Western Africa"],
      ["SX", "Sint Maarten", "Americas", "Caribbean"],
      ["SO", "Somalia", "Africa", "Eastern Africa"],
      ["ZA", "Sudáfrica", "Africa", "Southern Africa"],
      ["SD", "Sudán", "Africa", "Northern Africa"],
      ["SS", "Sudán del Sur", "Africa", "Middle Africa"],
      ["SE", "Suecia", "Europe", "Northern Europe"],
      ["CH", "Suiza", "Europe", "Western Europe"],
      ["SR", "Surinam", "Americas", "South America"],
      ["TZ", "Tanzania", "Africa", "Eastern Africa"],
      ["IO", "Territorio Británico del Océano Índico", "Africa", "Eastern Africa"],
      ["TG", "Togo", "Africa", "Western Africa"],
      ["TT", "Trinidad y Tobago", "Americas", "Caribbean"],
      ["TN", "Túnez", "Africa", "Northern Africa"],
      ["UA", "Ucrania", "Europe", "Eastern Europe"],
      ["UG", "Uganda", "Africa", "Eastern Africa"],
      ["UY", "Uruguay", "Americas", "South America"],
      ["VE", "Venezuela", "Americas", "South America"],
      ["ZM", "Zambia", "Africa", "Eastern Africa"],
      ["ZW", "Zimbabue", "Africa", "Eastern Africa"],
    ];

    this.countries = rawData.map(([code, name, region, subregion]) => ({
      code,
      name,
      region,
      subregion,
    }));
    return this.countries;
  }

  /**
   * Cargar ciudades para un país usando SOLO listas curadas
   */
  async loadCitiesForCountry(countryCode) {
    // Intentar caché primero SOLO si es reciente (versión 2.0)
    const cached = this.getFromCache(`cities_v2_${countryCode}`);
    if (cached) {
      return cached;
    }

    // USAR SOLO LISTAS CURADAS - NO API
    const cities = this.getCuratedCities(countryCode);

    if (cities.length > 0) {
      // Usar nuevo key de caché para evitar conflictos
      this.saveToCache(`cities_v2_${countryCode}`, cities);
      return cities;
    }

    // Si no hay lista para el país, devolver array vacío
    return [];
  }

  /**
   * Lista de ciudades curadas (SIN BARRIOS)
   */
  getCuratedCities(countryCode) {
    const curatedData = {
      AR: "Buenos Aires,Córdoba,Rosario,Mendoza,La Plata,Mar del Plata,Salta,Santa Fe,San Juan,Neuquén",
      BO: "La Paz,Santa Cruz de la Sierra,Cochabamba,Sucre,Oruro,Tarija,Potosí,El Alto",
      BR: "São Paulo,Rio de Janeiro,Brasília,Salvador,Belo Horizonte,Fortaleza,Manaus,Curitiba,Recife,Porto Alegre,Goiânia,Belém",
      CL: "Santiago,Valparaíso,Concepción,Antofagasta,Temuco,Rancagua,Talca,Arica,Iquique,Puerto Montt",
      CO: "Bogotá,Medellín,Cali,Barranquilla,Cartagena,Cúcuta,Bucaramanga,Pereira,Santa Marta,Manizales",
      CR: "San José,Cartago,Puntarenas,Heredia,Alajuela,Limón,Liberia",
      CU: "La Habana,Santiago de Cuba,Camagüey,Holguín,Santa Clara,Guantánamo,Bayamo",
      EC: "Quito,Guayaquil,Cuenca,Ambato,Machala,Santo Domingo,Portoviejo,Manta,Loja,Riobamba",
      SV: "San Salvador,Santa Ana,San Miguel,Soyapango,Mejicanos,Apopa",
      ES: "Madrid,Barcelona,Valencia,Sevilla,Zaragoza,Málaga,Murcia,Palma,Las Palmas,Bilbao,Alicante,Córdoba,Valladolid,Vigo,Gijón,Granada,Elche,Oviedo,Santander,Vitoria",
      GT: "Ciudad de Guatemala,Mixco,Villa Nueva,Petapa,Quetzaltenango,Villa Canales,Escuintla",
      HN: "Tegucigalpa,San Pedro Sula,Choloma,La Ceiba,El Progreso,Choluteca,Comayagua",
      MX: "Ciudad de México,Guadalajara,Monterrey,Puebla,Tijuana,León,Juárez,Torreón,Querétaro,Mérida,Mexicali,Aguascalientes,Culiacán,Hermosillo",
      NI: "Managua,León,Granada,Masaya,Estelí,Chinandega,Matagalpa",
      PA: "Ciudad de Panamá,San Miguelito,Tocumen,David,Arraiján,Las Cumbres,La Chorrera",
      PY: "Asunción,Ciudad del Este,San Lorenzo,Luque,Capiatá,Lambaré,Fernando de la Mora",
      PE: "Lima,Arequipa,Trujillo,Chiclayo,Huancayo,Cusco,Chimbote,Iquitos,Piura,Tacna,Ica,Sullana",
      DO: "Santo Domingo,Santiago,Los Alcarrizos,La Romana,San Pedro de Macorís,San Cristóbal,Puerto Plata",
      UY: "Montevideo,Salto,Paysandú,Las Piedras,Rivera,Maldonado,Tacuarembó",
      VE: "Caracas,Maracaibo,Valencia,Barquisimeto,Maracay,Ciudad Guayana,San Cristóbal,Maturín,Barcelona,Turmero",
      US: "New York,Los Angeles,Chicago,Houston,Phoenix,Philadelphia,San Antonio,San Diego,Dallas,San Jose",
      CA: "Toronto,Montreal,Vancouver,Calgary,Edmonton,Ottawa,Winnipeg,Quebec City",
      AO: "Luanda,Huambo,Lobito,Benguela,Kuito,Lubango,Malanje,Namibe,Soyo,Cabinda",
    };

    const citiesString = curatedData[countryCode];
    return citiesString ? citiesString.split(",") : [];
  }

  /**
   * Poblar selector de países
   */
  async populateCountrySelect(selectElement) {
    return this._populateSelect({
      selectElement,
      loader: () => this.loadCountries(),
      defaultText: "Selecciona tu país",
      loadingText: "Cargando países...",
      errorText: "Error cargando países",
      otherText: "Mi país no está en la lista",
      mapFn: (country) => ({ value: country.code, text: country.name }),
    });
  }

  /**
   * Poblar selector de ciudades
   */
  async populateCitySelect(selectElement, countryCode) {
    if (!selectElement) return;

    if (!countryCode) {
      selectElement.innerHTML = '<option value="">Primero selecciona un país</option>';
      selectElement.disabled = true;
      return;
    }

    return this._populateSelect({
      selectElement,
      loader: () => this.loadCitiesForCountry(countryCode),
      defaultText: "Selecciona tu ciudad",
      loadingText: "Cargando ciudades...",
      errorText: "Mi ciudad no está en la lista",
      otherText: "Mi ciudad no está en la lista",
      mapFn: (city) => ({ value: city, text: city }),
    });
  }

  /**
   * Helper unificado para poblar selectores
   */
  async _populateSelect({
    selectElement,
    loader,
    defaultText,
    loadingText,
    errorText,
    otherText,
    mapFn,
  }) {
    if (!selectElement) return;

    try {
      selectElement.innerHTML = `<option value="">${loadingText}</option>`;
      selectElement.disabled = true;

      const items = await loader();

      selectElement.innerHTML = "";

      // Opción predeterminada
      this._addOption(selectElement, "", defaultText);

      // Añadir items
      if (Array.isArray(items)) {
        items.forEach((item) => {
          const { value, text } = mapFn(item);
          this._addOption(selectElement, value, text);
        });
      }

      // Añadir opción "Otros"
      this._addOption(selectElement, "other", otherText);

      selectElement.disabled = false;
    } catch (error) {
      console.error(`Error populating select:`, error);
      selectElement.innerHTML = `<option value="other">${errorText}</option>`;
      selectElement.disabled = false;
    }
  }

  /**
   * Helper para añadir opción a un Select
   */
  _addOption(selectElement, value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    selectElement.appendChild(option);
  }

  /**
   * Manejar selección de "Otro país"
   */
  handleOtherCountry(countrySelect) {
    this._handleOtherInput(countrySelect, "Country");
  }

  /**
   * Manejar selección de "Otra ciudad"
   */
  handleOtherCity(citySelect) {
    this._handleOtherInput(citySelect, "City");
  }

  /**
   * Helper unificado para manejar inputs de "Otro"
   */
  _handleOtherInput(selectElement, type) {
    const isCountry = type === "Country";
    const containerId = isCountry ? "otherCountryContainer" : "otherCityContainer";
    const container = document.getElementById(containerId);
    const isOther = selectElement.value === "other";
    const containerDoesNotExist = !container;

    if (isOther) {
      if (containerDoesNotExist) {
        this._createOtherInput(selectElement, type);
      } else {
        container.style.display = "block";
        container.querySelector("input").required = true;
      }

      if (isCountry) {
        // Limpiar selector de ciudades y mostrar opción "Otra ciudad"
        const citySelect = document.querySelector('select[name="city"]');
        if (citySelect) {
          citySelect.innerHTML =
            '<option value="other">Mi ciudad no está en la lista</option>';
          citySelect.disabled = false;
        }
      }
    } else if (container) {
      container.style.display = "none";
      container.querySelector("input").required = false;
    }
  }

  /**
   * Helper unificado para crear inputs de "Otro"
   */
  _createOtherInput(selectElement, type) {
    const group = selectElement.parentElement;
    const isCountry = type === "Country";
    const id = isCountry ? "otherCountry" : "otherCity";
    const labelText = isCountry ? "Especifica tu país *" : "Especifica tu ciudad *";
    const placeholderText = isCountry ? "Nombre de tu país" : "Nombre de tu ciudad";

    const otherContainer = document.createElement("div");
    otherContainer.id = `${id}Container`;
    otherContainer.className = "form-group";
    otherContainer.style.marginTop = "10px";

    otherContainer.innerHTML = `
            <label for="${id}">${labelText}</label>
            <input type="text" id="${id}" name="${id}" 
                   placeholder="${placeholderText}" required>
        `;

    group.after(otherContainer);
  }

  /**
   * Limpiar caché (MEJORADO - incluyendo caché antiguo)
   */
  clearCache() {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.config.CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};
