import { Test, TestingModule } from '@nestjs/testing';
import { ResolverService } from '../resolver.service';
import { ProfileService } from 'modules/profile/profile.service';
import { Profile, Wallet } from '@prisma/client';

describe('ResolverService', () => {
  let service: ResolverService;
  let profileService: ProfileService;

  // Mock ProfileService
  const mockProfileService = {
    findProfileByUsername: jest.fn(),
    findProfileByWalletAddress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResolverService,
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    service = module.get<ResolverService>(ResolverService);
    profileService = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('resolveUsername', () => {
    const mockUsername = 'testuser123';
    const mockWallet: Wallet = {
      id: 'wallet-123',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      profileId: 'profile-123',
      isDefault: true,
      label: 'POLYGON',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockProfile: Profile & { wallets: Wallet[] } = {
      id: 'profile-123',
      username: mockUsername,
      createdAt: new Date(),
      updatedAt: new Date(),
      wallets: [mockWallet],
    };

    it('should successfully resolve a username to a profile', async () => {
      mockProfileService.findProfileByUsername.mockResolvedValue(mockProfile);

      const result = await service.resolveUsername(mockUsername);

      expect(mockProfileService.findProfileByUsername).toHaveBeenCalledWith(mockUsername);
      expect(result).toEqual(mockProfile);
    });

    it('should handle non-existent username', async () => {
      const notFoundError = {
        code: 'P2025',
        clientVersion: '2.24.1',
        meta: undefined,
        message: 'Record not found',
      };

      mockProfileService.findProfileByUsername.mockRejectedValue(notFoundError);

      await expect(service.resolveUsername('nonexistent')).rejects.toMatchObject({
        code: 'P2025',
        message: 'Record not found',
      });
    });

    it('should handle empty username', async () => {
      const notFoundError = {
        code: 'P2025',
        clientVersion: '2.24.1',
        meta: undefined,
        message: 'Record not found',
      };
      
      mockProfileService.findProfileByUsername.mockRejectedValue(notFoundError);

      await expect(service.resolveUsername('')).rejects.toMatchObject({
        code: 'P2025',
        message: 'Record not found'
      });
      expect(mockProfileService.findProfileByUsername).toHaveBeenCalledWith('');
    });

    it('should handle special characters in username', async () => {
      const usernameWithSpecialChars = 'test@user#123';
      mockProfileService.findProfileByUsername.mockRejectedValue(new Error('Invalid username format'));

      await expect(service.resolveUsername(usernameWithSpecialChars)).rejects.toThrow('Invalid username format');
    });

    it('should handle database connection errors', async () => {
      mockProfileService.findProfileByUsername.mockRejectedValue(new Error('Database connection failed'));

      await expect(service.resolveUsername(mockUsername)).rejects.toThrow('Database connection failed');
    });

    it('should handle timeout errors', async () => {
      mockProfileService.findProfileByUsername.mockRejectedValue(new Error('Request timeout'));

      await expect(service.resolveUsername(mockUsername)).rejects.toThrow('Request timeout');
    });
  });

  describe('resolveWallet', () => {
    const mockWalletAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const mockWallet: Wallet = {
      id: 'wallet-123',
      address: mockWalletAddress,
      profileId: 'profile-123',
      isDefault: true,
      label: 'POLYGON',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockProfile: Profile & { wallets: Wallet[] } = {
      id: 'profile-123',
      username: 'testuser123',
      createdAt: new Date(),
      updatedAt: new Date(),
      wallets: [mockWallet],
    };

    it('should successfully resolve a wallet address to a profile', async () => {
      mockProfileService.findProfileByWalletAddress.mockResolvedValue(mockProfile);

      const result = await service.resolveWallet(mockWalletAddress);

      expect(mockProfileService.findProfileByWalletAddress).toHaveBeenCalledWith(mockWalletAddress);
      expect(result).toEqual(mockProfile);
    });

    it('should handle non-existent wallet address', async () => {
      const notFoundError = {
        code: 'P2025',
        clientVersion: '2.24.1',
        meta: undefined,
        message: 'Record not found',
      };

      mockProfileService.findProfileByWalletAddress.mockRejectedValue(notFoundError);

      await expect(service.resolveWallet('0x1234567890')).rejects.toMatchObject({
        code: 'P2025',
        message: 'Record not found',
      });
    });

    it('should handle invalid wallet address format', async () => {
      const invalidAddress = 'invalid-address';
      const invalidFormatError = {
        code: 'P2006',
        clientVersion: '2.24.1',
        meta: { target: ['address'] },
        message: 'Invalid data provided',
      };

      mockProfileService.findProfileByWalletAddress.mockRejectedValue(invalidFormatError);

      await expect(service.resolveWallet(invalidAddress)).rejects.toMatchObject({
        code: 'P2006',
        meta: { target: ['address'] },
      });
    });

    it('should handle case-sensitive wallet addresses', async () => {
      const lowerCaseAddress = mockWalletAddress.toLowerCase();
      mockProfileService.findProfileByWalletAddress.mockResolvedValue(mockProfile);

      const result = await service.resolveWallet(lowerCaseAddress);

      expect(mockProfileService.findProfileByWalletAddress).toHaveBeenCalledWith(lowerCaseAddress);
      expect(result).toEqual(mockProfile);
    });

    it('should handle multiple profiles with same wallet address edge case', async () => {
      const duplicateError = {
        code: 'P2002',
        clientVersion: '2.24.1',
        meta: { target: ['address'] },
        message: 'Multiple profiles found for wallet address',
      };

      mockProfileService.findProfileByWalletAddress.mockRejectedValue(duplicateError);

      await expect(service.resolveWallet(mockWalletAddress)).rejects.toMatchObject({
        code: 'P2002',
        message: 'Multiple profiles found for wallet address',
      });
    });

    it('should handle database connection errors', async () => {
      mockProfileService.findProfileByWalletAddress.mockRejectedValue(new Error('Database connection failed'));

      await expect(service.resolveWallet(mockWalletAddress)).rejects.toThrow('Database connection failed');
    });

    it('should handle empty wallet address', async () => {
      await expect(service.resolveWallet('')).rejects.toThrow();
      expect(mockProfileService.findProfileByWalletAddress).toHaveBeenCalledWith('');
    });

    it('should handle database timeout errors', async () => {
      const timeoutError = new Error('Database operation timeout');
      mockProfileService.findProfileByWalletAddress.mockRejectedValue(timeoutError);

      await expect(service.resolveWallet(mockWalletAddress)).rejects.toThrow('Database operation timeout');
    });
  });
});