import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateItinerary } from './gemini';
import { GoogleGenAI } from '@google/genai';

vi.mock('@google/genai', () => {
  const generateContentMock = vi.fn();
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: generateContentMock,
      },
    })),
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      INTEGER: 'INTEGER',
      ARRAY: 'ARRAY',
    },
    Schema: vi.fn(),
  };
});

describe('generateItinerary', () => {
  const mockRequest = {
    origin: 'New York',
    destination: 'London',
    duration: 3,
    travelers: 2,
    budgetMin: 1000,
    budgetMax: 5000,
    interests: ['Culture'],
    constraints: 'None',
  };

  const mockItinerary = {
    tripTitle: 'London Explorer',
    summary: 'A 3-day trip to London.',
    transportation: { local: 'Tube' },
    hotels: [],
    restaurants: [],
    days: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('generates an itinerary successfully', async () => {
    const mockResponse = {
      text: JSON.stringify(mockItinerary),
    };
    const { GoogleGenAI: MockedAI } = await import('@google/genai');
    const aiInstance = new MockedAI({ apiKey: 'test' });
    (aiInstance.models.generateContent as any).mockResolvedValue(mockResponse);

    const result = await generateItinerary(mockRequest);
    expect(result).toEqual(mockItinerary);
    expect(aiInstance.models.generateContent).toHaveBeenCalled();
  });

  it('throws an error when response is empty', async () => {
    const mockResponse = {
      text: '',
    };
    const { GoogleGenAI: MockedAI } = await import('@google/genai');
    const aiInstance = new MockedAI({ apiKey: 'test' });
    (aiInstance.models.generateContent as any).mockResolvedValue(mockResponse);

    await expect(generateItinerary(mockRequest)).rejects.toThrow('Received empty response from the AI model.');
  });

  it('throws an error when API fails', async () => {
    const { GoogleGenAI: MockedAI } = await import('@google/genai');
    const aiInstance = new MockedAI({ apiKey: 'test' });
    (aiInstance.models.generateContent as any).mockRejectedValue(new Error('API Error'));

    await expect(generateItinerary(mockRequest)).rejects.toThrow('API Error');
  });
});
