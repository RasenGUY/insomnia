import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { SiweMessage, SiweError, SiweErrorType } from 'siwe';
import { VerifySiweDto } from '../dto/verify-siwe.dto';
import { ResponseTransformer } from 'common/transformers/response.transformer';
import { RegistrationService } from '../services/registration.service';

// Mock the SiweMessage class
jest.mock('siwe', () => ({
  SiweMessage: jest.fn(),
  SiweError: jest.fn(),
  SiweErrorType: {
    INVALID_SIGNATURE: 'Invalid signature.',
    NONCE_MISMATCH: 'Nonce does not match provided nonce for verification.',
    EXPIRED_MESSAGE: 'Expired message.',
  },
}));

// Mock ResponseTransformer
jest.mock('common/transformers/response.transformer', () => ({
ResponseTransformer: {
    success: jest.fn().mockImplementation((message, data, meta) => ({
    status: 'success',
    message,
    data,
    meta,
    timestamp: expect.any(Date),
    })),
}
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock session object
  const mockSession: Record<string, any> = {};

  // Mock AuthService
  const mockAuthService = {
    generateNonce: jest.fn(),
    verifySiweMessage: jest.fn(),
  };
  
  const mockRegistrationService = {
    registerWallet: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: RegistrationService,
          useValue: mockRegistrationService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    // Reset session before each test
    Object.keys(mockSession).forEach(key => delete mockSession[key]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getNonce', () => {
    const mockNonce = 'testNonce123';

    it('should successfully generate and store nonce in session', async () => {
      mockAuthService.generateNonce.mockResolvedValue(mockNonce);
      const expectedResponse = ResponseTransformer.success("Nonce generated successfully",{ nonce: mockNonce });

      const result = await controller.getNonce(mockSession);

      expect(mockAuthService.generateNonce).toHaveBeenCalled();
      expect(mockSession.nonce).toBe(mockNonce);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle service errors when generating nonce', async () => {
      const error = new Error('Failed to generate nonce');
      mockAuthService.generateNonce.mockRejectedValue(error);

      await expect(controller.getNonce(mockSession)).rejects.toThrow(error);
      expect(mockSession.nonce).toBeUndefined();
    });

    it('should generate unique nonce for each call', async () => {
      const firstNonce = 'nonce1';
      const secondNonce = 'nonce2';
      
      mockAuthService.generateNonce
        .mockResolvedValueOnce(firstNonce)
        .mockResolvedValueOnce(secondNonce);

      await controller.getNonce(mockSession);
      const firstStoredNonce = mockSession.nonce;
      
      await controller.getNonce(mockSession);
      const secondStoredNonce = mockSession.nonce;

      expect(firstStoredNonce).not.toBe(secondStoredNonce);
    });
  });

  describe('verify', () => {
    const createMockVerifySiweDto = (message: string, signature: string): VerifySiweDto => {
      const dto = new VerifySiweDto();
      dto.message = message;
      dto.signature = signature;
      dto.parseSiweMessage = jest.fn().mockReturnValue(new SiweMessage(message));
      return dto;
    };

    const mockVerifySiweDto = createMockVerifySiweDto(
      'Example SIWE message',
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1b'
    );

    const mockVerifiedMessage = {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    chainId: 1,
    domain: 'example.com',
    issuedAt: '2024-02-10T12:00:00.000Z',
    expirationTime: '2024-02-11T12:00:00.000Z',
    resources: ['https://example.com/resource1'],
    };
    
    beforeEach(() => {
      mockSession.nonce = 'validNonce123';
    });

    it('should successfully verify SIWE message and update session', async () => {
    mockAuthService.verifySiweMessage.mockResolvedValue(mockVerifiedMessage);
    
    // Create an object with only the properties that the controller actually sends
    const expectedVerifiedData = {
        address: mockVerifiedMessage.address,
        chainId: mockVerifiedMessage.chainId,
        domain: mockVerifiedMessage.domain,
        issuedAt: mockVerifiedMessage.issuedAt,
    };
    
    // Set up the expected response that matches what ResponseTransformer.success would return
    const expectedResponse = {
        data: expectedVerifiedData,
        timestamp: expect.any(Date),
        message: "Siwe verification success",
        meta: undefined,
        status: "success",
    };
    
    // Mock the ResponseTransformer.success to return our expected response
    // Use jest.spyOn to create a mock that can be reset and manipulated
    jest.spyOn(ResponseTransformer, 'success').mockReturnValueOnce(expectedResponse);

    const result = await controller.verify(mockVerifySiweDto, mockSession);

    expect(mockAuthService.verifySiweMessage).toHaveBeenCalledWith(
        mockVerifySiweDto.message,
        mockVerifySiweDto.signature,
        'validNonce123'
    );
    expect(ResponseTransformer.success).toHaveBeenCalledWith(
        "Siwe verification success",
        expectedVerifiedData
    );
    expect(result).toEqual(expectedResponse);
    expect(mockSession.siwe).toBe(mockVerifiedMessage);
    expect(mockSession.nonce).toBeNull();
    });

    it('should throw UnauthorizedException when no nonce in session', async () => {
      delete mockSession.nonce;

      await expect(controller.verify(mockVerifySiweDto, mockSession))
        .rejects
        .toThrow(new UnauthorizedException('No nonce found in session'));
      
      expect(mockAuthService.verifySiweMessage).not.toHaveBeenCalled();
      expect(mockSession.siwe).toBeUndefined();
    });

    it('should handle invalid signature error', async () => {
      const siweError = new SiweError(SiweErrorType.INVALID_SIGNATURE);
      siweError.type = SiweErrorType.INVALID_SIGNATURE;
      mockAuthService.verifySiweMessage.mockRejectedValue(siweError);

      await expect(controller.verify(mockVerifySiweDto, mockSession))
        .rejects
        .toThrow(new UnauthorizedException('Invalid signature'));
      
      expect(mockSession.siwe).toBeNull();
      expect(mockSession.nonce).toBeNull();
    });

    it('should handle nonce mismatch error', async () => {
      const siweError = new SiweError(SiweErrorType.NONCE_MISMATCH);
      mockAuthService.verifySiweMessage.mockRejectedValue(siweError);

      await expect(controller.verify(mockVerifySiweDto, mockSession))
        .rejects
        .toThrow(new UnauthorizedException('Invalid nonce'));
      
      expect(mockSession.siwe).toBeNull();
      expect(mockSession.nonce).toBeNull();
    });

    it('should handle expired message error', async () => {
      const siweError = new SiweError(SiweErrorType.EXPIRED_MESSAGE);
      siweError.type = SiweErrorType.EXPIRED_MESSAGE;
      mockAuthService.verifySiweMessage.mockRejectedValue(siweError);

      await expect(controller.verify(mockVerifySiweDto, mockSession))
        .rejects
        .toThrow(new UnauthorizedException('Message has expired'));
      
      expect(mockSession.siwe).toBeNull();
      expect(mockSession.nonce).toBeNull();
    });

    it('should handle malformed SIWE message', async () => {
      const malformedDto = createMockVerifySiweDto(
        'Invalid SIWE message format',
        mockVerifySiweDto.signature
      );

      const error = new Error('Invalid message format');
      mockAuthService.verifySiweMessage.mockRejectedValue(error);

      await expect(controller.verify(malformedDto, mockSession))
        .rejects
        .toThrow(error);
      
      expect(mockSession.siwe).toBeNull();
      expect(mockSession.nonce).toBeNull();
    });

    it('should handle malformed signature', async () => {
      const malformedDto = createMockVerifySiweDto(
        mockVerifySiweDto.message,
        'invalid-signature'
      );

      const error = new Error('Invalid signature format');
      mockAuthService.verifySiweMessage.mockRejectedValue(error);

      await expect(controller.verify(malformedDto, mockSession))
        .rejects
        .toThrow(error);
      
      expect(mockSession.siwe).toBeNull();
      expect(mockSession.nonce).toBeNull();
    });

    it('should handle service timeout errors', async () => {
      mockAuthService.verifySiweMessage.mockRejectedValue(new Error('Service timeout'));

      await expect(controller.verify(mockVerifySiweDto, mockSession))
        .rejects
        .toThrow('Service timeout');
      
      expect(mockSession.siwe).toBeNull();
      expect(mockSession.nonce).toBeNull();
    });

    // Edge Cases
    it('should handle multiple verify attempts with same nonce', async () => {
      mockAuthService.verifySiweMessage.mockResolvedValue(mockVerifiedMessage);
      
      // First attempt should succeed
      await controller.verify(mockVerifySiweDto, mockSession);
      
      // Second attempt should fail due to nonce being cleared
      await expect(controller.verify(mockVerifySiweDto, mockSession))
        .rejects
        .toThrow(new UnauthorizedException('No nonce found in session'));
    });

    it('should handle empty message and signature', async () => {
      const emptyDto = createMockVerifySiweDto('', '');

      const error = new Error('Empty message or signature');
      mockAuthService.verifySiweMessage.mockRejectedValue(error);

      await expect(controller.verify(emptyDto, mockSession))
        .rejects
        .toThrow(error);
      
      expect(mockSession.siwe).toBeNull();
      expect(mockSession.nonce).toBeNull();
    });

    it('should handle undefined session object', async () => {
      // Create a session-like object with undefined nonce
      const nullSession = { nonce: undefined };
      
      await expect(controller.verify(mockVerifySiweDto, nullSession))
        .rejects
        .toThrow(new UnauthorizedException('No nonce found in session'));
      
      expect(mockAuthService.verifySiweMessage).not.toHaveBeenCalled();
    });
  });
});