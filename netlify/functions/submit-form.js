// netlify/functions/submit-form.js
// Función serverless para manejar el formulario de forma segura

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

function buildResponse(statusCode, body) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: typeof body === 'string' ? body : JSON.stringify(body)
  };
}

function validateFormData(formData) {
  const requiredFields = ['name', 'email', 'location', 'experience', 'technologies', 'motivation'];
  const missingFields = requiredFields.filter(field => !formData[field]);

  if (missingFields.length > 0) {
    return { error: 'Missing required fields', missingFields };
  }

  const emailRegex = /^(?=([^\s@]+))\1@(?=([^\s@]+))\2\.(?=([^\s@]+))\3$/;
  if (!emailRegex.test(formData.email)) {
    return { error: 'Invalid email format' };
  }

  return null;
}

function buildCustomerData(formData) {
  return {
    id: formData.email,
    email: formData.email,
    name: formData.name,
    country_code: formData.location?.country?.code,
    country_name: formData.location?.country?.name,
    country_region: formData.location?.country?.region,
    country_subregion: formData.location?.country?.subregion,
    city: formData.location?.city,
    experience: formData.experience,
    dev_language: formData.devLanguage || '',
    gender: formData.gender?.selected || null,
    gender_self_describe: formData.gender?.self_describe_text || null,
    how_heard: formData.howHeard?.selected || '',
    how_heard_other_text: formData.howHeard?.others_text || null,
    technologies: formData.technologies,
    github: formData.github || '',
    motivation: formData.motivation,
    source: 'b4os-website',
    form_version: '2025-v2',
    application_timestamp: new Date().toISOString(),
    created_at: Math.floor(Date.now() / 1000),
    has_github: !!formData.github?.trim(),
    experience_level: getExperienceLevel(formData.experience),
    is_spanish_speaker: formData.location?.country?.code === 'ES',
    is_latam: isLatamCountry(formData.location?.country?.code),
    primary_technology: extractPrimaryTechnology(formData.technologies)
  };
}

function buildEventData(formData) {
  return {
    name: 'b4os_application_submitted',
    data: {
      form_experience: formData.experience,
      form_technologies: formData.technologies,
      form_country: formData.location?.country?.name,
      form_country_code: formData.location?.country?.code,
      form_city: formData.location?.city,
      form_github: formData.github || '',
      form_motivation_length: formData.motivation?.length || 0,
      form_has_github: !!formData.github?.trim(),
      form_dev_language: formData.devLanguage || '',
      form_how_heard: formData.howHeard?.selected || '',
      form_how_heard_other_text: formData.howHeard?.others_text || null,
      form_gender: formData.gender?.selected || null,
      form_gender_self_describe: formData.gender?.self_describe_text || null,
      event_timestamp: new Date().toISOString(),
      event_source: 'b4os-website',
      event_version: '2025-v2'
    }
  };
}

function getCustomerIOAuthHeader(siteId, apiKey) {
  return `Basic ${Buffer.from(siteId + ':' + apiKey).toString('base64')}`;
}

async function sendToCustomerIO(formData, siteId, apiKey) {
  const authHeader = getCustomerIOAuthHeader(siteId, apiKey);
  const encodedEmail = encodeURIComponent(formData.email);

  const customerData = buildCustomerData(formData);

  const customerIOResponse = await fetch(`https://track.customer.io/api/v1/customers/${encodedEmail}`, {
    method: 'PUT',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(customerData)
  });

  if (!customerIOResponse.ok) {
    const errorText = await customerIOResponse.text();
    console.error('❌ Customer.io API error:', {
      status: customerIOResponse.status,
      statusText: customerIOResponse.statusText,
      body: errorText,
      headers: Object.fromEntries(customerIOResponse.headers.entries())
    });
    return false;
  }

  console.log('✅ Customer.io: Usuario creado/actualizado');

  const eventResponse = await fetch(`https://track.customer.io/api/v1/customers/${encodedEmail}/events`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(buildEventData(formData))
  });

  if (eventResponse.ok) {
    console.log('✅ Customer.io: Evento enviado');
  }

  return true;
}

function logApplication(formData, customerIOSuccess) {
  console.log('📝 Nueva aplicación B4OS:', {
    email: formData.email,
    name: formData.name,
    country: formData.location?.country?.name,
    city: formData.location?.city,
    experience: formData.experience,
    devLanguage: formData.devLanguage,
    gender: formData.gender?.selected,
    genderSelfDescribe: formData.gender?.self_describe_text,
    howHeard: formData.howHeard?.selected,
    howHeardOtherText: formData.howHeard?.others_text,
    technologies: formData.technologies,
    customerIOStatus: customerIOSuccess ? 'success' : 'failed',
    timestamp: new Date().toISOString()
  });
}

export const handler = async (event) => {
  // Manejar preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return buildResponse(200, '');
  }

  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return buildResponse(405, { error: 'Method Not Allowed' });
  }

  try {
    const formData = JSON.parse(event.body);

    // Validar datos requeridos y email
    const validationError = validateFormData(formData);
    if (validationError) {
      return buildResponse(400, validationError);
    }

    // Validar perfil de GitHub si se proporciona
    if (formData.github) {
      const githubValidation = await validateGitHubProfile(formData.github);
      if (!githubValidation.isValid) {
        return buildResponse(400, { error: githubValidation.message });
      }
    }

    // Obtener claves de Customer.io desde variables de entorno
    const customerIOSiteId = process.env.CUSTOMERIO_SITE_ID;
    const customerIOApiKey = process.env.CUSTOMERIO_TRACK_API_KEY;

    console.log('🔍 Customer.io config check:', {
      siteIdExists: !!customerIOSiteId,
      apiKeyExists: !!customerIOApiKey,
      siteIdLength: customerIOSiteId?.length || 0,
      apiKeyLength: customerIOApiKey?.length || 0
    });

    let customerIOSuccess = false;

    if (customerIOSiteId && customerIOApiKey) {
      try {
        customerIOSuccess = await sendToCustomerIO(formData, customerIOSiteId, customerIOApiKey);
      } catch (customerIOError) {
        console.error('❌ Customer.io request failed:', customerIOError);
      }
    } else {
      console.log('⚠️ Customer.io no configurado - variables de entorno faltantes');
    }

    logApplication(formData, customerIOSuccess);

    return buildResponse(200, {
      success: true,
      message: 'Aplicación enviada exitosamente',
      services: { customerIO: customerIOSuccess },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error processing form:', error);

    return buildResponse(500, {
      error: 'Internal server error',
      message: 'Error processing your application. Please try again.',
      timestamp: new Date().toISOString()
    });
  }
};

// Helper functions para procesar datos
function getExperienceLevel(experience) {
  if (!experience) return 'unknown';

  if (experience.includes('2-5')) return 'junior-mid';
  if (experience.includes('5-10')) return 'senior';
  if (experience.includes('10+')) return 'expert';

  return experience;
}

function isLatamCountry(countryCode) {
  const latamCountries = [
    'AR', 'BO', 'BR', 'CL', 'CO', 'CR', 'CU', 'EC', 'SV',
    'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'DO', 'UY', 'VE'
  ];
  return latamCountries.includes(countryCode);
}

function extractPrimaryTechnology(technologies) {
  if (!technologies) return 'unknown';

  const tech = technologies.toLowerCase();

  // Detectar tecnología principal basada en palabras clave
  if (tech.includes('javascript') || tech.includes('js') || tech.includes('node')) return 'javascript';
  if (tech.includes('python')) return 'python';
  if (tech.includes('rust')) return 'rust';
  if (tech.includes('c++') || tech.includes('cpp')) return 'cpp';
  if (tech.includes('go') || tech.includes('golang')) return 'go';
  if (tech.includes('java')) return 'java';
  if (tech.includes('typescript') || tech.includes('ts')) return 'typescript';
  if (tech.includes('react')) return 'react';
  if (tech.includes('vue')) return 'vue';
  if (tech.includes('angular')) return 'angular';

  // Si no detecta nada específico, tomar la primera palabra
  const words = technologies.split(/[,\s]+/);
  return words[0]?.toLowerCase() || 'other';
}

// Validar perfil de GitHub
async function validateGitHubProfile(url) {
  try {
    // Extraer username de la URL
    const githubRegex = /^https:\/\/github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/;
    const match = url.match(githubRegex);

    if (!match) {
      return {
        isValid: false,
        message: 'La URL debe tener el formato https://github.com/username'
      };
    }

    const username = match[1];

    // Validar que el perfil existe usando GitHub API
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'B4OS-Application-Form'
      }
    });

    if (response.status === 404) {
      return {
        isValid: false,
        message: 'No pudimos encontrar este usuario de GitHub. Revisa el nombre o <a href="https://github.com" target="_blank" rel="noopener noreferrer">crea una cuenta en GitHub</a>.'
      };
    }

    if (!response.ok) {
      console.warn('GitHub API error, validating format only:', response.status);
      return { isValid: true }; // En caso de error de API, permitir el formato válido
    }

    return { isValid: true };

  } catch (error) {
    console.warn('Error validating GitHub profile:', error);
    // En caso de error, solo validamos el formato básico
    const basicFormat = /^https:\/\/github\.com\/[a-zA-Z0-9-]+$/;
    return {
      isValid: basicFormat.test(url),
      message: basicFormat.test(url) ? '' : 'Formato de URL de GitHub inválido'
    };
  }
}
