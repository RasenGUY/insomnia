import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { RegistrationService } from '../services/registration.service';
import { ProfileService } from 'modules/profile/profile.service';
import { WalletService } from 'modules/wallet/wallet.service';
import { WalletLabel } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RegistrationDto } from '../dto/registration.dto';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let prismaService: PrismaService;
  let profileService: ProfileService;
  let walletService: WalletService;

  // Mock date for consistent testing
  const mockDate = new Date('2024-02-10T12:00:00Z');
  
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // Explicitly type the mock profile to match ProfileDto
  const mockProfile = {
    id: 'profile-123',
    username: 'testuser',
    createdAt: mockDate,
    updatedAt: mockDate,
    wallets: [] as typeof mockWallet[]
  };

  const mockWallet = {
    id: 'wallet-123',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    profileId: 'profile-123',
    isDefault: true,
    label: WalletLabel.POLYGON,
    createdAt: mockDate,
    updatedAt: mockDate
  };

  const createMockServices = () => {
    return {
      $transaction: jest.fn((callback) => callback()),
      createProfile: jest.fn(),
      createWallet: jest.fn()
    };
  };

  beforeEach(async () => {
    const mocks = createMockServices();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
        {
          provide: PrismaService,
          useValue: { $transaction: mocks.$transaction }
        },
        {
          provide: ProfileService,
          useValue: { createProfile: mocks.createProfile }
        },
        {
          provide: WalletService,
          useValue: { createWallet: mocks.createWallet }
        }
      ],
    }).compile();

    service = module.get<RegistrationService>(RegistrationService);
    prismaService = module.get<PrismaService>(PrismaService);
    profileService = module.get<ProfileService>(ProfileService);
    walletService = module.get<WalletService>(WalletService);

    // Setup default successful behavior
    mocks.createProfile.mockResolvedValue(mockProfile);
    mocks.createWallet.mockResolvedValue(mockWallet);
    mocks.$transaction.mockImplementation(callback => callback());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    const mockRegistrationDto: RegistrationDto = {
      username: 'testuser',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' as const
    };

    it('should successfully register a new user with wallet', async () => {
      const result = await service.registerWallet(mockRegistrationDto);

      expect(profileService.createProfile).toHaveBeenCalledWith(mockRegistrationDto.username);
      expect(walletService.createWallet).toHaveBeenCalledWith({
        address: mockRegistrationDto.address,
        profileId: mockProfile.id,
        label: WalletLabel.POLYGON
      });
      
      // Type guard to ensure wallets array exists and has elements
      expect(result.wallets).toBeDefined();
      expect(result.wallets!.length).toBeGreaterThan(0);
      expect(result.wallets![0]?.isDefault).toBe(true);
    });

    it('should handle unique constraint violation for username', async () => {
      const duplicateError = new PrismaClientKnownRequestError('Unique constraint violation', {
        code: 'P2002',
        clientVersion: '2.24.1',
        meta: { target: ['username'] }
      });

      jest.spyOn(profileService, 'createProfile').mockRejectedValueOnce(duplicateError);

      await expect(service.registerWallet(mockRegistrationDto))
        .rejects
        .toThrow(PrismaClientKnownRequestError);
      
      expect(walletService.createWallet).not.toHaveBeenCalled();
    });

    it('should handle unique constraint violation for wallet address', async () => {
      const duplicateWalletError = new PrismaClientKnownRequestError('Unique constraint violation', {
        code: 'P2002',
        clientVersion: '2.24.1',
        meta: { target: ['address'] }
      });

      jest.spyOn(walletService, 'createWallet').mockRejectedValueOnce(duplicateWalletError);

      await expect(service.registerWallet(mockRegistrationDto))
        .rejects
        .toThrow(PrismaClientKnownRequestError);
    });

    it('should handle transaction rollback on wallet creation failure', async () => {
      const walletError = new Error('Failed to create wallet');
      jest.spyOn(walletService, 'createWallet').mockRejectedValueOnce(walletError);
      jest.spyOn(prismaService, '$transaction').mockRejectedValueOnce(walletError);

      await expect(service.registerWallet(mockRegistrationDto))
        .rejects
        .toThrow('Failed to create wallet');
    });

    // Testing validation and edge cases
    it('should handle usernames at minimum length requirement', async () => {
      const minLengthDto = {
        username: 'sixchr', // 6 characters
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' as const
      };

      const modifiedProfile = {
        ...mockProfile,
        username: minLengthDto.username
      };

      jest.spyOn(profileService, 'createProfile').mockResolvedValueOnce(modifiedProfile);

      const result = await service.registerWallet(minLengthDto);
      expect(result.username).toBe(minLengthDto.username);
    });

    it('should handle usernames at maximum length requirement', async () => {
      const maxLengthDto = {
        username: 'a'.repeat(30), // 30 characters
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' as const
      };

      const modifiedProfile = {
        ...mockProfile,
        username: maxLengthDto.username
      };

      jest.spyOn(profileService, 'createProfile').mockResolvedValueOnce(modifiedProfile);

      const result = await service.registerWallet(maxLengthDto);
      expect(result.username).toBe(maxLengthDto.username);
    });

    it('should handle usernames with allowed special characters', async () => {
      const specialCharsDto = {
        username: 'test_user-123', // Valid special characters as per regex
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' as const
      };

      const modifiedProfile = {
        ...mockProfile,
        username: specialCharsDto.username
      };

      jest.spyOn(profileService, 'createProfile').mockResolvedValueOnce(modifiedProfile);

      const result = await service.registerWallet(specialCharsDto);
      expect(result.username).toBe(specialCharsDto.username);
    });

    it('should handle database connection errors', async () => {
      const dbError = new Error('Database connection failed');
      jest.spyOn(prismaService, '$transaction').mockRejectedValueOnce(dbError);

      await expect(service.registerWallet(mockRegistrationDto))
        .rejects
        .toThrow('Database connection failed');
    });

    it('should handle race conditions in concurrent registrations', async () => {
      // First attempt setup
      const firstResult = await service.registerWallet(mockRegistrationDto);
      expect(firstResult).toBeDefined();

      // Second attempt setup - simulate concurrent registration
      const concurrentError = new PrismaClientKnownRequestError('Unique constraint violation', {
        code: 'P2002',
        clientVersion: '2.24.1',
        meta: { target: ['username'] }
      });

      jest.spyOn(profileService, 'createProfile').mockRejectedValueOnce(concurrentError);

      // Concurrent registration should fail
      await expect(service.registerWallet(mockRegistrationDto))
        .rejects
        .toThrow(PrismaClientKnownRequestError);
    });

    it('should maintain default wallet status through transaction', async () => {
      const defaultWallet = { ...mockWallet, isDefault: true };
      jest.spyOn(walletService, 'createWallet').mockResolvedValueOnce(defaultWallet);

      const result = await service.registerWallet(mockRegistrationDto);
      
      expect(result.wallets).toBeDefined();
      expect(result.wallets!.length).toBeGreaterThan(0);
      expect(result.wallets![0]?.isDefault).toBe(true);
    });
  });
});