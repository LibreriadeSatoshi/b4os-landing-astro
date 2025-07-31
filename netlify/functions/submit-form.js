// netlify/functions/submit-form.js
// Función serverless para manejar el formulario de forma segura

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parsear datos del formulario
    const formData = JSON.parse(event.body);
    
    // Validar datos requeridos
    const requiredFields = ['name', 'email', 'location', 'experience', 'technologies', 'motivation'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          missingFields 
        })
      };
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
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

    // Enviar a Customer.io si está configurado
    if (customerIOSiteId && customerIOApiKey) {
      try {
        // Preparar datos para Customer.io - CAMPOS SEPARADOS
        const customerData = {
          id: formData.email, // Usar email como ID único
          email: formData.email,
          attributes: {
            // Información personal
            name: formData.name,
            
            // Ubicación - campos separados
            country_code: formData.location?.country?.code,
            country_name: formData.location?.country?.name,
            country_region: formData.location?.country?.region,
            country_subregion: formData.location?.country?.subregion,
            city: formData.location?.city,
            
            // Experiencia profesional
            experience: formData.experience,
            technologies: formData.technologies,
            github: formData.github || '',
            motivation: formData.motivation,
            
            // Metadatos del formulario
            source: 'b4os-website',
            form_version: '2025-v1',
            application_timestamp: new Date().toISOString(),
            created_at: Math.floor(Date.now() / 1000),
            
            // Campos adicionales para segmentación
            has_github: !!(formData.github && formData.github.trim()),
            experience_level: getExperienceLevel(formData.experience),
            is_spanish_speaker: formData.location?.country?.code === 'ES',
            is_latam: isLatamCountry(formData.location?.country?.code),
            primary_technology: extractPrimaryTechnology(formData.technologies)
          }
        };

        // API de Customer.io para tracking
        const customerIOResponse = await fetch(`https://track.customer.io/api/v1/customers/${encodeURIComponent(formData.email)}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Basic ${Buffer.from(customerIOSiteId + ':' + customerIOApiKey).toString('base64')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(customerData)
        });

        if (customerIOResponse.ok) {
          customerIOSuccess = true;
          console.log('✅ Customer.io: Usuario creado/actualizado');

          // Opcional: Enviar evento de aplicación con datos estructurados
          const eventResponse = await fetch(`https://track.customer.io/api/v1/customers/${encodeURIComponent(formData.email)}/events`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${Buffer.from(customerIOSiteId + ':' + customerIOApiKey).toString('base64')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: 'b4os_application_submitted',
              data: {
                // Datos del evento como campos separados
                form_experience: formData.experience,
                form_technologies: formData.technologies,
                form_country: formData.location?.country?.name,
                form_country_code: formData.location?.country?.code,
                form_city: formData.location?.city,
                form_github: formData.github || '',
                form_motivation_length: formData.motivation?.length || 0,
                form_has_github: !!(formData.github && formData.github.trim()),
                
                // Metadatos del evento
                event_timestamp: new Date().toISOString(),
                event_source: 'b4os-website',
                event_version: '2025-v1'
              }
            })
          });

          if (eventResponse.ok) {
            console.log('✅ Customer.io: Evento enviado');
          }

        } else {
          const errorText = await customerIOResponse.text();
          console.error('❌ Customer.io API error:', {
            status: customerIOResponse.status,
            statusText: customerIOResponse.statusText,
            body: errorText,
            headers: Object.fromEntries(customerIOResponse.headers.entries())
          });
        }

      } catch (customerIOError) {
        console.error('❌ Customer.io request failed:', customerIOError);
      }
    } else {
      console.log('⚠️ Customer.io no configurado - variables de entorno faltantes');
    }

    // Aquí puedes añadir otros servicios:
    // - Email notifications
    // - Slack notifications  
    // - Database storage
    // - etc.

    // Log de la aplicación (para debugging)
    console.log('📝 Nueva aplicación B4OS:', {
      email: formData.email,
      name: formData.name,
      country: formData.location?.country?.name,
      city: formData.location?.city,
      experience: formData.experience,
      customerIOStatus: customerIOSuccess ? 'success' : 'failed',
      timestamp: new Date().toISOString()
    });

    // Respuesta exitosa
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Aplicación enviada exitosamente',
        services: {
          customerIO: customerIOSuccess
        },
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Error processing form:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Error processing your application. Please try again.',
        timestamp: new Date().toISOString()
      })
    };
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