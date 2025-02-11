import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { SiweMessage } from 'siwe';

// Mock siwe library
jest.mock('siwe', () => ({
  SiweMessage: jest.fn(),
  generateNonce: jest.fn()
}));

describe('AuthService', () => {
  let service: AuthService;
  
  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('generateNonce', () => {
    const mockNonce = 'mock-nonce-123';

    beforeEach(() => {
      (require('siwe').generateNonce as jest.Mock).mockReturnValue(mockNonce);
    });

    it('should successfully generate a nonce', async () => {
      const result = await service.generateNonce();
      expect(result).toBe(mockNonce);
      expect(require('siwe').generateNonce).toHaveBeenCalled();
    });

    it('should handle generateNonce errors', async () => {
      (require('siwe').generateNonce as jest.Mock).mockImplementation(() => {
        throw new Error('Failed to generate nonce');
      });

      await expect(service.generateNonce()).rejects.toThrow('Failed to generate nonce');
    });
  });

  describe('verifySiweMessage', () => {
    const mockAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const mockDomain = 'example.com';
    const mockUri = 'https://example.com';
    const mockVersion = '1';
    const mockChainId = 1;
    const mockNonce = 'test-nonce-123';
    const mockIssuedAt = '2024-02-09T12:00:00.000Z';
    const mockSignature = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b';
    
    const mockPreparedMessage = `${mockDomain} wants you to sign in with your Ethereum account:
${mockAddress}

Sign in with Ethereum to the app.

URI: ${mockUri}
Version: ${mockVersion}
Chain ID: ${mockChainId}
Nonce: ${mockNonce}
Issued At: ${mockIssuedAt}`;

    const mockVerifiedMessage = {
      address: mockAddress,
      chainId: mockChainId,
      domain: mockDomain,
      uri: mockUri,
      version: mockVersion,
      nonce: mockNonce,
      issuedAt: mockIssuedAt
    };

    beforeEach(() => {
      (SiweMessage as jest.Mock).mockImplementation(() => ({
        verify: jest.fn().mockResolvedValue({ 
          success: true,
          data: mockVerifiedMessage
        })
      }));
    });

    it('should successfully verify a valid SIWE message', async () => {
      const result = await service.verifySiweMessage(
        mockPreparedMessage,
        mockSignature,
        mockNonce
      );

      expect(result).toEqual(mockVerifiedMessage);
      expect(SiweMessage).toHaveBeenCalledWith(mockPreparedMessage);
    });

    it('should handle invalid signature', async () => {
      (SiweMessage as jest.Mock).mockImplementation(() => ({
        verify: jest.fn().mockResolvedValue({ 
          success: false,
          error: {
            type: 'Invalid signature.',
            expected: mockAddress,
            received: 'Invalid signature provided'
          }
        })
      }));

      await expect(
        service.verifySiweMessage(mockPreparedMessage, 'invalid-signature', mockNonce)
      ).rejects.toHaveProperty('type', 'Invalid signature.');
    });

    it('should handle invalid nonce', async () => {
      (SiweMessage as jest.Mock).mockImplementation(() => ({
        verify: jest.fn().mockResolvedValue({ 
          success: false,
          error: {
            type: 'Nonce does not match provided nonce for verification.',
            expected: mockNonce,
            received: 'invalid-nonce'
          }
        })
      }));

      await expect(
        service.verifySiweMessage(mockPreparedMessage, mockSignature, 'invalid-nonce')
      ).rejects.toHaveProperty('type', 'Nonce does not match provided nonce for verification.');
    });

    it('should handle expired message', async () => {
      (SiweMessage as jest.Mock).mockImplementation(() => ({
        verify: jest.fn().mockResolvedValue({ 
          success: false,
          error: {
            type: 'Expired message.',
            expected: 'current time',
            received: 'expired time'
          }
        })
      }));

      await expect(
        service.verifySiweMessage(mockPreparedMessage, mockSignature, mockNonce)
      ).rejects.toHaveProperty('type', 'Expired message.');
    });

    it('should handle not yet valid message', async () => {
      (SiweMessage as jest.Mock).mockImplementation(() => ({
        verify: jest.fn().mockResolvedValue({ 
          success: false,
          error: {
            type: 'Message is not valid yet.',
            expected: 'future time',
            received: 'current time'
          }
        })
      }));

      await expect(
        service.verifySiweMessage(mockPreparedMessage, mockSignature, mockNonce)
      ).rejects.toHaveProperty('type', 'Message is not valid yet.');
    });

    it('should handle malformed message', async () => {
      (SiweMessage as jest.Mock).mockImplementation(() => ({
        verify: jest.fn().mockResolvedValue({ 
          success: false,
          error: {
            type: 'Unable to parse the message.',
            expected: 'valid SIWE message',
            received: 'invalid message format'
          }
        })
      }));

      await expect(
        service.verifySiweMessage('invalid-message', mockSignature, mockNonce)
      ).rejects.toHaveProperty('type', 'Unable to parse the message.');
    });

    it('should handle invalid message version', async () => {
      (SiweMessage as jest.Mock).mockImplementation(() => ({
        verify: jest.fn().mockResolvedValue({ 
          success: false,
          error: {
            type: 'Invalid message version.',
            expected: '1',
            received: '2'
          }
        })
      }));

      await expect(
        service.verifySiweMessage(mockPreparedMessage, mockSignature, mockNonce)
      ).rejects.toHaveProperty('type', 'Invalid message version.');
    });

    it('should handle SiweMessage instantiation errors', async () => {
      (SiweMessage as jest.Mock).mockImplementation(() => {
        throw new Error('Failed to create SIWE message');
      });

      await expect(
        service.verifySiweMessage(mockPreparedMessage, mockSignature, mockNonce)
      ).rejects.toThrow('Failed to create SIWE message');
    });

    // Testing message format variations
    it('should handle messages with extra whitespace', async () => {
      const messageWithExtraSpace = `${mockPreparedMessage}    \n    `;
      
      const result = await service.verifySiweMessage(
        messageWithExtraSpace,
        mockSignature,
        mockNonce
      );

      expect(result).toEqual(mockVerifiedMessage);
    });

    it('should handle unicode characters in message', async () => {
      const unicodeMessage = mockPreparedMessage.replace(
        'Sign in with Ethereum to the app',
        'Sign in with Ethereum to the app 🚀 测试 тест'
      );
      
      const result = await service.verifySiweMessage(
        unicodeMessage,
        mockSignature,
        mockNonce
      );

      expect(result).toEqual(mockVerifiedMessage);
    });
  });
});