import { Test, TestingModule } from '@nestjs/testing';
import { ResolverController } from '../resolver.controller';
import { ResolverService } from '../resolver.service';
import { Profile, Wallet } from '@prisma/client';
import { ResponseTransformer } from 'common/transformers/response.transformer';
import { UsernameParamDto } from '../dtos/username-param.dto';
import { WalletAddressParamDto } from '../dtos/wallet-address-param.dto';

describe('ResolverController', () => {
  let controller: ResolverController;
  let resolverService: ResolverService;

  // Mock ResolverService
  const mockResolverService = {
    resolveUsername: jest.fn(),
    resolveWallet: jest.fn(),
  };
  // Mock date for consistent testing
  const mockDate = new Date('2024-02-10T12:00:00Z');
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResolverController],
      providers: [
        {
          provide: ResolverService,
          useValue: mockResolverService,
        },
      ],
    }).compile();

    controller = module.get<ResolverController>(ResolverController);
    resolverService = module.get<ResolverService>(ResolverService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('resolve (/:username)', () => {
    const mockUsername = 'testuser123';
    
    const mockWallet: Wallet = {
      id: 'wallet-123',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      profileId: 'profile-123',
      isDefault: true,
      label: 'POLYGON',
      createdAt: mockDate,
      updatedAt: mockDate,
    };
    const mockProfile: Profile & { wallets: Wallet[] } = {
      id: 'profile-123',
      username: mockUsername,
      createdAt: mockDate,
      updatedAt: mockDate,
      wallets: [mockWallet],
    };

    it('should successfully resolve username and return transformed response', async () => {
      mockResolverService.resolveUsername.mockResolvedValue(mockProfile);
      const expectedResponse = ResponseTransformer.success(mockProfile);

      const dto = { username: mockUsername } as UsernameParamDto;
      const result = await controller.resolve(dto);

      expect(mockResolverService.resolveUsername).toHaveBeenCalledWith(mockUsername);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle profile not found', async () => {
      const notFoundError = {
        code: 'P2025',
        clientVersion: '2.24.1',
        meta: undefined,
        message: 'Record not found',
      };

      mockResolverService.resolveUsername.mockRejectedValue(notFoundError);

      await expect(controller.resolve({ username: 'nonexistent' } as UsernameParamDto)).rejects.toMatchObject({
        code: 'P2025',
        message: 'Record not found',
      });
    });

    it('should handle empty username parameter', async () => {
      const notFoundError = {
        code: 'P2025',
        clientVersion: '2.24.1',
        meta: undefined,
        message: 'Record not found',
      };

      mockResolverService.resolveUsername.mockRejectedValue(notFoundError);

      await expect(controller.resolve({ username: '' } as UsernameParamDto)).rejects.toMatchObject({
        code: 'P2025',
        message: 'Record not found',
      });
    });

    it('should handle special characters in username', async () => {
      const invalidUsernameError = {
        code: 'P2006',
        clientVersion: '2.24.1',
        meta: { target: ['username'] },
        message: 'Invalid data provided',
      };

      mockResolverService.resolveUsername.mockRejectedValue(invalidUsernameError);

      await expect(controller.resolve({ username: 'test@user#123' } as UsernameParamDto)).rejects.toMatchObject({
        code: 'P2006',
        meta: { target: ['username'] },
      });
    });

    it('should handle database connection errors', async () => {
      mockResolverService.resolveUsername.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.resolve({ username: mockUsername } as UsernameParamDto)).rejects.toThrow('Database connection failed');
    });

    it('should handle service timeout errors', async () => {
      mockResolverService.resolveUsername.mockRejectedValue(new Error('Service timeout'));

      await expect(controller.resolve({ username: mockUsername } as UsernameParamDto)).rejects.toThrow('Service timeout');
    });
  });

  describe('reverse (/reverse/:walletAddress)', () => {
    const mockWalletAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const mockDate = new Date();

    const mockWallet: Wallet = {
      id: 'wallet-123',
      address: mockWalletAddress,
      profileId: 'profile-123',
      isDefault: true,
      label: 'POLYGON',
      createdAt: mockDate,
      updatedAt: mockDate,
    };
    const mockProfile: Profile & { wallets: Wallet[] } = {
      id: 'profile-123',
      username: 'testuser123',
      createdAt: mockDate,
      updatedAt: mockDate,
      wallets: [mockWallet],
    };

    it('should successfully resolve wallet address and return transformed response', async () => {
      mockResolverService.resolveWallet.mockResolvedValue(mockProfile);
      const expectedResponse = ResponseTransformer.success(mockProfile);

      const dto = { walletAddress: mockWalletAddress } as WalletAddressParamDto;
      const result = await controller.reverse(dto);

      expect(mockResolverService.resolveWallet).toHaveBeenCalledWith(mockWalletAddress);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle wallet address not found', async () => {
      const notFoundError = {
        code: 'P2025',
        clientVersion: '2.24.1',
        meta: undefined,
        message: 'Record not found',
      };

      mockResolverService.resolveWallet.mockRejectedValue(notFoundError);

      await expect(controller.reverse({ walletAddress: '0x1234567890' } as WalletAddressParamDto)).rejects.toMatchObject({
        code: 'P2025',
        message: 'Record not found',
      });
    });

    it('should handle invalid wallet address format', async () => {
      const invalidAddressError = {
        code: 'P2006',
        clientVersion: '2.24.1',
        meta: { target: ['address'] },
        message: 'Invalid data provided',
      };

      mockResolverService.resolveWallet.mockRejectedValue(invalidAddressError);

      await expect(controller.reverse({ walletAddress: 'invalid-address' } as WalletAddressParamDto)).rejects.toMatchObject({
        code: 'P2006',
        meta: { target: ['address'] },
      });
    });

    it('should handle empty wallet address parameter', async () => {
      const invalidAddressError = {
        code: 'P2006',
        clientVersion: '2.24.1',
        meta: { target: ['address'] },
        message: 'Invalid data provided',
      };

      mockResolverService.resolveWallet.mockRejectedValue(invalidAddressError);

      await expect(controller.reverse({ walletAddress: '' } as WalletAddressParamDto)).rejects.toMatchObject({
        code: 'P2006',
        meta: { target: ['address'] },
      });
    });

    it('should handle database connection errors', async () => {
      mockResolverService.resolveWallet.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.reverse({ walletAddress: mockWalletAddress } as WalletAddressParamDto)).rejects.toThrow('Database connection failed');
    });

    it('should handle service timeout errors', async () => {
      mockResolverService.resolveWallet.mockRejectedValue(new Error('Service timeout'));

      await expect(controller.reverse({ walletAddress: mockWalletAddress } as WalletAddressParamDto)).rejects.toThrow('Service timeout');
    });

    it('should handle case-sensitive wallet addresses', async () => {
      const lowerCaseAddress = mockWalletAddress.toLowerCase();
      mockResolverService.resolveWallet.mockResolvedValue(mockProfile);
      const expectedResponse = ResponseTransformer.success(mockProfile);

      const result = await controller.reverse({ walletAddress: lowerCaseAddress } as WalletAddressParamDto);

      expect(mockResolverService.resolveWallet).toHaveBeenCalledWith(lowerCaseAddress);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle multiple profiles with same wallet address edge case', async () => {
      const duplicateError = {
        code: 'P2002',
        clientVersion: '2.24.1',
        meta: { target: ['address'] },
        message: 'Multiple profiles found for wallet address',
      };

      mockResolverService.resolveWallet.mockRejectedValue(duplicateError);

      await expect(controller.reverse({ walletAddress: mockWalletAddress } as WalletAddressParamDto)).rejects.toMatchObject({
        code: 'P2002',
        message: 'Multiple profiles found for wallet address',
      });
    });
  });
});