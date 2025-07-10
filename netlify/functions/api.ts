import { Handler } from '@netlify/functions';

// In-memory storage for demo purposes
// In production, you'd want to use a database or external storage
let storage = new Map();

export const handler: Handler = async (event, context) => {
  const { httpMethod, path, body } = event;
  
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Extract the API endpoint from the path
    const apiPath = path.replace('/.netlify/functions/api', '');
    
    // Basic health check endpoint
    if (apiPath === '/health' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }),
      };
    }

    // Handle storage operations
    if (apiPath.startsWith('/storage')) {
      const key = apiPath.replace('/storage/', '') || 'default';
      
      switch (httpMethod) {
        case 'GET':
          const data = storage.get(key) || null;
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ data }),
          };
          
        case 'POST':
        case 'PUT':
          const newData = JSON.parse(body || '{}');
          storage.set(key, newData);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: newData }),
          };
          
        case 'DELETE':
          storage.delete(key);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true }),
          };
      }
    }

    // Default 404 response
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' }),
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
