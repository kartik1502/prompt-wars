import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import fetch from 'node-fetch';

// Set env vars before importing app
process.env.PROXY_HEADER = 'test-proxy-header';
process.env.GOOGLE_CLOUD_PROJECT = 'test-project';
process.env.GOOGLE_CLOUD_LOCATION = 'us-central1';
process.env.NODE_ENV = 'test';

const { app, server } = await import('./server.js');

vi.mock('node-fetch');
vi.mock('@google-cloud/firestore', () => {
  return {
    Firestore: vi.fn().mockImplementation(() => ({
      collection: vi.fn().mockReturnThis(),
      doc: vi.fn().mockImplementation(() => ({
        id: 'mock-doc-id',
        set: vi.fn().mockResolvedValue(true),
      })),
    })),
  };
});

describe('Backend Integration & Edge Cases', () => {
  const mockProxyHeader = 'test-proxy-header';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  describe('Itinerary Persistence', () => {
    it('successfully saves an itinerary to Firestore', async () => {
      const response = await request(app)
        .post('/api/save-itinerary')
        .send({ 
          itinerary: { tripTitle: 'Test Trip' },
          metadata: { userId: 'user123' }
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('mock-doc-id');
    });

    it('returns 400 if itinerary data is missing', async () => {
      const response = await request(app)
        .post('/api/save-itinerary')
        .send({ metadata: {} });

      expect(response.status).toBe(400);
    });
  });

  describe('Proxy Edge Cases', () => {
    it('handles upstream API failures gracefully', async () => {
      fetch.mockResolvedValue({
        status: 502,
        json: vi.fn().mockResolvedValue({ error: 'Bad Gateway' }),
      });

      const response = await request(app)
        .post('/api-proxy')
        .set('x-app-proxy', mockProxyHeader)
        .send({ 
          originalUrl: 'https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-pro:generateContent',
          method: 'POST'
        });

      expect(response.status).toBe(502);
    });

    it('handles non-JSON responses from upstream', async () => {
      fetch.mockResolvedValue({
        status: 200,
        json: vi.fn().mockRejectedValue(new Error('Unexpected token < in JSON')),
      });

      const response = await request(app)
        .post('/api-proxy')
        .set('x-app-proxy', mockProxyHeader)
        .send({ 
          originalUrl: 'https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-pro:generateContent'
        });

      expect(response.status).toBe(500);
      expect(response.body.error.message).toContain('Unexpected token');
    });
  });
});
