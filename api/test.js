// Simple test endpoint to verify Vercel deployment
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Test endpoint called:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });

    const response = {
      status: 'OK',
      message: 'Vercel serverless function is working',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasAtlasUri: !!process.env.ATLAS_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        vercelRegion: process.env.VERCEL_REGION || 'unknown',
        runtime: 'nodejs'
      }
    };

    console.log('Returning response:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}