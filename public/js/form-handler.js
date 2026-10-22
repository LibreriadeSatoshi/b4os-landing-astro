// src/scripts/form-handler.js
// Manejo del formulario con envío seguro a Netlify Function

globalThis.FormHandler = class FormHandler {
  constructor() {
    this.locationAPI = new globalThis.LocationAPI();
    this.form = null;
    this.isSubmitting = false;
  }

  /**
   * Inicializar el manejo del formulario
   */
  async init() {
    this.form = document.getElementById("registrationForm");

    if (!this.form) {
      return;
    }

    await this.setupLocationSelectors();
    this.setupFormValidation();
    this.setupFormSubmission();
    this.setupHowHeardCheckboxes();
    this.setupGenderRadios();
  }

  /**
   * Configurar selectores de ubicación
   */
  async setupLocationSelectors() {
    const countrySelect = document.getElementById("country");
    const citySelect = document.getElementById("city");

    if (!countrySelect || !citySelect) {
      return;
    }

    // Cargar países desde API
    await this.locationAPI.populateCountrySelect(countrySelect);

    // Evento para cambio de país
    countrySelect.addEventListener("change", async (e) => {
      const countryCode = e.target.value;

      if (countryCode) {
        await this.locationAPI.populateCitySelect(citySelect, countryCode);
      } else {
        citySelect.innerHTML =
          '<option value="">Primero selecciona un país</option>';
        citySelect.disabled = true;
      }

      // Ocultar input de "otra ciudad" si existe
      this.hideOtherCityInput();
    });

    // Evento para cambio de ciudad
    citySelect.addEventListener("change", (e) => {
      this.locationAPI.handleOtherCity(citySelect);
    });
  }

  /**
   * Configurar validación del formulario
   */
  setupFormValidation() {
    const inputs = this.form.querySelectorAll("input, select, textarea");

    inputs.forEach((input) => {
      input.addEventListener("blur", async () => {
        await this.validateField(input);
      });

      input.addEventListener("input", () => {
        this.clearFieldError(input);
      });
    });
  }

  /**
   * Configurar envío del formulario
   */
  setupFormSubmission() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (this.isSubmitting) return;

      await this.handleSubmit();
    });
  }

  /**
   * Configurar radio buttons de how_heard
   */
  setupHowHeardCheckboxes() {
    const othersRadio = document.getElementById("how-heard-others");
    const othersInputContainer = document.getElementById(
      "others-input-container",
    );
    const othersTextInput = document.getElementById("how-heard-others-text");

    if (!othersRadio || !othersInputContainer || !othersTextInput) {
      return;
    }

    // Función para manejar el cambio de radio buttons
    const handleRadioChange = (e) => {
      if (e.target.value === "others") {
        othersInputContainer.style.display = "block";
        othersTextInput.required = true;
        othersTextInput.focus();
      } else {
        othersInputContainer.style.display = "none";
        othersTextInput.required = false;
        othersTextInput.value = "";
      }
    };

    const allRadioButtons = document.querySelectorAll(
      'input[name="how-heard"]',
    );
    allRadioButtons.forEach((radio) => {
      radio.addEventListener("change", handleRadioChange);
    });

    othersTextInput.addEventListener("input", () => {
      this.clearFieldError(othersTextInput);
    });
  }

  /**
   * Configurar radio buttons de gender y mostrar/ocultar input "self-describe"
   */
  setupGenderRadios() {
    const selfDescribeRadio = document.getElementById("gender-self_describe");
    const selfDescribeContainer = document.getElementById(
      "gender-self-describe-container",
    );
    const selfDescribeTextInput = document.getElementById(
      "gender-self-describe-text",
    );

    if (
      !selfDescribeRadio ||
      !selfDescribeContainer ||
      !selfDescribeTextInput
    ) {
      return;
    }

    const handleGenderChange = (e) => {
      if (e.target.value === "self_describe") {
        selfDescribeContainer.style.display = "block";
        selfDescribeTextInput.required = true;
        selfDescribeTextInput.focus();
      } else {
        selfDescribeContainer.style.display = "none";
        selfDescribeTextInput.required = false;
        selfDescribeTextInput.value = "";
      }
    };

    const genderRadios = document.querySelectorAll('input[name="gender"]');
    genderRadios.forEach((radio) => {
      radio.addEventListener("change", handleGenderChange);
    });

    selfDescribeTextInput.addEventListener("input", () => {
      this.clearFieldError(selfDescribeTextInput);
    });
  }

  /**
   * Validar campo individual
   */
  async validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = "";

    this.clearFieldError(field);

    // Validación especial para GitHub
    if (field.name === "github" && value) {
      const validation = await this.validateGitHubProfile(value);
      isValid = validation.isValid;
      message = validation.message || "";
    } else {
      const validationResult = this.validateFieldByType(field, value);
      isValid = validationResult.isValid;
      message = validationResult.message;
    }

    if (field.required && !value) {
      isValid = false;
      message = "Este campo es requerido";
    }

    if (!isValid && message) {
      this.showFieldError(field, message);
    }

    return isValid;
  }

  /**
   * Validar campo según su tipo
   */
  validateFieldByType(field, value) {
    let isValid = true;
    let message = "";

    if (field.type === "email") {
      const emailRegex = /^(?=([^\s@]+))\1@(?=([^\s@]+))\2\.(?=([^\s@]+))\3$/;
      if (value && !emailRegex.test(value)) {
        isValid = false;
        message = "Por favor ingresa un email válido";
      }
    } else if (field.type === "url") {
      if (value && !this.isValidURL(value)) {
        isValid = false;
        message = "Por favor ingresa una URL válida";
      }
    }

    return { isValid, message };
  }

  /**
   * Validar URL
   */
  isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (error) {
      console.warn("URL validation error:", error);
      return false;
    }
  }

  /**
   * Validar perfil en GitHub
   */
  async validateGitHubProfile(url) {
    try {
      // Extraer username de la URL
      const githubRegex =
        /^https:\/\/github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/;
      const match = url.match(githubRegex);

      if (!match) {
        return {
          isValid: false,
          message:
            "Formato incorrecto. Usa: <code>https://github.com/tu-usuario</code>",
        };
      }

      const username = match[1];

      // Validar que el perfil existe con GitHub API
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (response.status === 404) {
        return {
          isValid: false,
          message:
            'No pudimos encontrar este usuario de GitHub. Revisa el nombre o <a href="https://github.com" target="_blank" rel="noopener noreferrer">crea una cuenta en GitHub</a>.',
        };
      }

      if (!response.ok) {
        // Si hay error en la API, solo validamos el formato
        // console.warn('GitHub API error, validating format only');
        return { isValid: true };
      }

      return { isValid: true };
    } catch (error) {
      console.warn("GitHub profile validation error:", error);
      const basicFormat = /^https:\/\/github\.com\/[a-zA-Z0-9-]+$/;
      return {
        isValid: basicFormat.test(url),
        message: basicFormat.test(url)
          ? ""
          : "Formato de URL de GitHub inválido",
      };
    }
  }

  /**
   * Mostrar error en campo
   */
  showFieldError(field, message) {
    field.classList.add("field-error");

    const existingError = field.parentElement.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = message;
    errorDiv.style.cssText =
      "color: var(--error-color); font-size: var(--font-size-sm); margin-top: 4px;";

    field.parentElement.appendChild(errorDiv);
  }

  /**
   * Limpiar error de campo
   */
  clearFieldError(field) {
    field.classList.remove("field-error");
    const errorMessage = field.parentElement.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  /**
   * Ocultar input de otra ciudad
   */
  hideOtherCityInput() {
    const otherContainer = document.getElementById("otherCityContainer");
    if (otherContainer) {
      otherContainer.style.display = "none";
      const input = otherContainer.querySelector("input");
      if (input) {
        input.required = false;
        input.value = "";
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
      { name: "name", label: "Nombre completo" },
      { name: "email", label: "Email" },
      { name: "country", label: "País" },
      { name: "city", label: "Ciudad" },
      { name: "experience", label: "Años de experiencia" },
      { name: "dev-language", label: "Lenguaje de programación principal" },
      { name: "technologies", label: "Tecnologías principales" },
      { name: "github", label: "Perfil de GitHub" },
      { name: "motivation", label: "Motivación" },
    ];

    requiredFields.forEach((field) => {
      const value = formData.get(field.name);
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors.push(`${field.label} es requerido`);
      }
    });

    // Validar email
    const email = formData.get("email");
    const emailRegex = /^(?=([^\s@]+))\1@(?=([^\s@]+))\2\.(?=([^\s@]+))\3$/;
    if (email && !emailRegex.test(email)) {
      errors.push("Por favor ingresa un email válido");
    }

    // Validar ubicación
    const city = formData.get("city");
    const otherCity = formData.get("otherCity");

    if (city === "other" && (!otherCity || otherCity.trim() === "")) {
      errors.push("Por favor especifica el nombre de tu ciudad");
    }

    // Validar términos
    if (!formData.get("terms")) {
      errors.push("Debes aceptar los términos y condiciones");
    }

    // Validar URL de GitHub (validación básica aquí, la validación completa se hace en validateField)
    const github = formData.get("github");
    if (github && !this.isValidURL(github)) {
      errors.push("Por favor ingresa una URL de GitHub válida");
    }

    // Validar motivación
    const motivation = formData.get("motivation");
    if (motivation && motivation.length < 20) {
      errors.push("La motivación debe tener al menos 20 caracteres");
    }

    // Validar how-heard (radio buttons)
    const howHeardSelected = formData.get("how-heard");
    const howHeardOthers = formData.get("how-heard-others-text");

    if (!howHeardSelected) {
      errors.push("Selecciona una opción de cómo te enteraste de B4OS");
    } else if (
      howHeardSelected === "others" &&
      (!howHeardOthers || howHeardOthers.trim() === "")
    ) {
      errors.push('Si seleccionaste "Otros", especifica los medios');
    }

    // Validar gender: si eligió "self_describe", el texto es obligatorio
    const genderSelected = formData.get("gender");
    const genderSelfDescribe = formData.get("gender-self-describe-text");
    if (
      genderSelected === "self_describe" &&
      (!genderSelfDescribe || genderSelfDescribe.trim() === "")
    ) {
      errors.push('Si elegiste "Prefiero autodefinirme", escribe tu respuesta');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Obtener datos de ubicación formateados
   */
  getLocationData(formData) {
    const countryCode = formData.get("country");
    const city = formData.get("city");
    const otherCity = formData.get("otherCity");

    // Buscar nombre del país en los datos cargados
    const country = this.locationAPI.countries.find(
      (c) => c.code === countryCode,
    );
    const countryName = country ? country.name : countryCode;
    const cityName = city === "other" ? otherCity : city;

    return {
      country: {
        code: countryCode,
        name: countryName,
        region: country ? country.region : null,
        subregion: country ? country.subregion : null,
      },
      city: cityName,
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
        globalThis.showNotification(validation.errors[0], "error");
        return;
      }

      // Mostrar estado de carga
      submitButton.textContent = "Enviando...";
      submitButton.disabled = true;

      // Éxito - mensaje basado en el entorno
      const successMessage = this.isLocalDevelopment()
        ? "[DESARROLLO] Formulario validado correctamente (simulación)"
        : "Hemos recibido tu aplicación. Te escribiremos pronto.";

      globalThis.showNotification(successMessage, "success");

      this.resetForm();
    } catch (error) {
      let errorMessage =
        "Error al enviar la aplicación. Por favor intenta de nuevo.";

      // Mostrar mensaje más específico si es posible
      if (error.message) {
        errorMessage = error.message;
      }

      globalThis.showNotification(errorMessage, "error");
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
    return (
      globalThis.location.hostname === "localhost" ||
      globalThis.location.hostname === "127.0.0.1" ||
      globalThis.location.hostname.includes(".local")
    );
  }

  /**
   * Enviar datos - modo desarrollo vs producción
   */
  async submitToNetlifyFunction(data) {
    // En desarrollo local, simular envío exitoso
    if (this.isLocalDevelopment()) {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simular respuesta exitosa
      const simulatedResponse = {
        success: true,
        message: "[DESARROLLO] Aplicación simulada correctamente",
        services: {
          customerIO: true,
        },
        timestamp: new Date().toISOString(),
        note: "En desarrollo local - no se envían datos reales",
      };
      return simulatedResponse;
    }

    // En producción, usar Netlify Function real
    try {
      const response = await fetch("/.netlify/functions/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.warn("Failed to parse error response:", jsonError);
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Form submission error:", error);
      throw error;
    }
  }

  /**
   * Resetear formulario
   */
  resetForm() {
    this.form.reset();

    // Resetear selectores de ubicación
    const citySelect = document.getElementById("city");

    if (citySelect) {
      citySelect.innerHTML =
        '<option value="">Primero selecciona un país</option>';
      citySelect.disabled = true;
    }

    this.hideOtherCityInput();

    const genderSelfDescribeContainer = document.getElementById(
      "gender-self-describe-container",
    );
    const genderSelfDescribeInput = document.getElementById(
      "gender-self-describe-text",
    );
    if (genderSelfDescribeContainer)
      genderSelfDescribeContainer.style.display = "none";
    if (genderSelfDescribeInput) {
      genderSelfDescribeInput.required = false;
      genderSelfDescribeInput.value = "";
    }

    // Limpiar errores
    const errorMessages = this.form.querySelectorAll(".error-message");
    errorMessages.forEach((error) => error.remove());

    const fieldErrors = this.form.querySelectorAll(".field-error");
    fieldErrors.forEach((field) => field.classList.remove("field-error"));
  }

  /**
   * Método para limpiar caché (útil para desarrollo)
   */
  clearLocationCache() {
    this.locationAPI.clearCache();
    globalThis.showNotification("Caché de ubicaciones limpiado", "info");
  }
};
