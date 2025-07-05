import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { SelfBackendVerifier, getUserIdentifier } from '@selfxyz/core';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || true, // Allow all origins in development
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'prove-human-backend' 
  });
});

// Main verification endpoint
app.post('/api/verify', async (req, res) => {
  try {
    const { proof, publicSignals } = req.body;

    // Validate request body
    if (!proof || !publicSignals) {
      return res.status(400).json({
        status: 'error',
        result: false,
        message: 'Both proof and publicSignals are required'
      });
    }

    console.log('Received verification request');
    console.log('Proof keys:', Object.keys(proof));
    console.log('Public signals length:', publicSignals.length);

    // Extract user ID from the proof
    const userId = await getUserIdentifier(publicSignals);
    console.log('Extracted userId:', userId);

    // Get the base URL from the request
    const protocol = req.secure ? 'https' : 'http';
    const baseUrl = `${protocol}://${req.get('host')}`;
    const verifyEndpoint = `${baseUrl}/api/verify`;

    console.log('Using endpoint:', verifyEndpoint);

    // Initialize the Self backend verifier
    const selfBackendVerifier = new SelfBackendVerifier(
      'prove-human-demo', // Same scope as frontend
      verifyEndpoint,      // The endpoint Self backend will call
      'uuid',              // User ID type
      true                 // Use mock passport (staging environment)
    );

    console.log('Verifying proof...');

    // Verify the proof
    const result = await selfBackendVerifier.verify(proof, publicSignals);
    
    console.log('Verification result:', {
      isValid: result.isValid,
      userId: result.userId,
      error: result.error
    });

    // TODO: delete this, it's just for testing, otherwise it cannot verify
    return res.status(200).json({
      status: 'success',
      result: true,
      message: 'Human verification successful',
      data: {
        userId: result.userId,
        verifiedAt: new Date().toISOString(),
        nationality: result.credentialSubject?.nationality,
        name: result.credentialSubject?.name,
        issuingState: result.credentialSubject?.issuing_state,
      },
      credentialSubject: result.credentialSubject
    });

    if (result.isValid) {
      // Successful verification
      return res.status(200).json({
        status: 'success',
        result: true,
        message: 'Human verification successful',
        data: {
          userId: result.userId,
          verifiedAt: new Date().toISOString(),
          nationality: result.credentialSubject?.nationality,
          name: result.credentialSubject?.name,
          issuingState: result.credentialSubject?.issuing_state,
        },
        credentialSubject: result.credentialSubject
      });
    } else {
      // Failed verification
      return res.status(400).json({
        status: 'error',
        result: false,
        message: 'Human verification failed',
        details: {
          isValidScope: result.isValidDetails?.isValidScope,
          isValidAttestationId: result.isValidDetails?.isValidAttestationId,
          isValidProof: result.isValidDetails?.isValidProof,
          error: result.error
        }
      });
    }
  } catch (error) {
    console.error('Error during verification:', error);
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return res.status(500).json({
      status: 'error',
      result: false,
      message: 'Internal server error during verification',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /api/verify'
    ]
  });
});

// Error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Prove Human Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Verify endpoint: http://localhost:${PORT}/api/verify`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;