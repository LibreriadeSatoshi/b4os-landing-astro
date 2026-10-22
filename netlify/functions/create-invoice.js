// Serverless function to create an invoice in BTCPay Server
// Greenfield API: POST /api/v1/stores/{storeId}/invoices (https://docs.btcpayserver.org/Greenfield/Invoices)
// Returns the checkoutLink to redirect the user directly to the payment

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { amount, fundName, donorName, donorEmail, taxDeductible } = JSON.parse(event.body);

    // Validations
    if (!amount || Number(amount) <= 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid amount' }) };
    }

    if (!fundName) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Fund not specified' }) };
    }

    const { BTCPAY_URL, BTCPAY_API_KEY, BTCPAY_STORE_ID } = process.env;

    if (!BTCPAY_URL || !BTCPAY_API_KEY || !BTCPAY_STORE_ID) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Incomplete configuration' }) };
    }

    // Item description
    let itemDesc = fundName;
    if (taxDeductible === 'yes' && donorName && donorEmail) {
      itemDesc += ` — ${donorName} <${donorEmail}>`;
    }

    const fundLabel = fundName.replace(/^(Donate to|Donar al|Doar ao)\s+/i, '').trim() || fundName;
    const orderId = `Donate to ${fundLabel}`.slice(0, 100);

    const redirectURL = process.env.BTCPAY_REDIRECT_URL || 'https://b4os.dev/#donantes';
    const payload = {
      amount: String(amount),
      currency: 'USD',
      metadata: {
        itemDesc,
        orderId
      },
      checkout: {
        redirectURL
      }
    };

    // Call to the BTCPay Server API
    const res = await fetch(`${BTCPAY_URL}/api/v1/stores/${BTCPAY_STORE_ID}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${BTCPAY_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      return { statusCode: res.status, headers, body: JSON.stringify({ error: 'Error creating invoice' }) };
    }

    const invoice = await res.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ checkoutLink: invoice.checkoutLink })
    };

  } catch {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
