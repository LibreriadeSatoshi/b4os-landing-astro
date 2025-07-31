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

    console.log('Customer.io config:', {
      siteIdExists: !!customerIOSiteId,
      apiKeyExists: !!customerIOApiKey
    });

    let customerIOSuccess = false;

    // Enviar a Customer.io si está configurado
    if (customerIOSiteId && customerIOApiKey) {
      try {
        // Preparar datos para Customer.io
        const customerData = {
          id: formData.email, // Usar email como ID único
          email: formData.email,
          attributes: {
            name: formData.name,
            country_code: formData.location?.country?.code,
            country_name: formData.location?.country?.name,
            city: formData.location?.city,
            experience: formData.experience,
            technologies: formData.technologies,
            github: formData.github,
            motivation: formData.motivation,
            source: 'b4os-website',
            created_at: Math.floor(Date.now() / 1000),
            b4os_application_date: new Date().toISOString(),
            form_version: '2025-v1'
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

          // Opcional: Enviar evento de aplicación
          const eventResponse = await fetch(`https://track.customer.io/api/v1/customers/${encodeURIComponent(formData.email)}/events`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${Buffer.from(customerIOSiteId + ':' + customerIOApiKey).toString('base64')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: 'b4os_application_submitted',
              data: {
                experience: formData.experience,
                technologies: formData.technologies,
                country: formData.location?.country?.name,
                city: formData.location?.city,
                timestamp: new Date().toISOString()
              }
            })
          });

          if (eventResponse.ok) {
            console.log('✅ Customer.io: Evento enviado');
          }

        } else {
          const errorText = await customerIOResponse.text();
          console.error('❌ Customer.io error:', customerIOResponse.status, errorText);
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