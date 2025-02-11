import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { ProfileService } from '../profile.service';
import { ModelTransformer } from 'common/transformers/model.transferformer';
import { Profile, Wallet } from '@prisma/client';

// Mock the ModelTransformer
jest.mock('common/transformers/model.transferformer', () => ({
  ModelTransformer: {
    toDto: jest.fn(),
    toProfileDto: jest.fn(),
  },
}));

describe('ProfileService', () => {
  let service: ProfileService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    profile: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findFirst: jest.fn(),
      findFirstOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProfile', () => {
    const mockUsername = 'testuser123';
    const mockProfile: Profile = {
      id: 'profile-123',
      username: mockUsername,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully create a profile', async () => {
      mockPrismaService.profile.create.mockResolvedValue(mockProfile);
      (ModelTransformer.toDto as jest.Mock).mockReturnValue(mockProfile);

      const result = await service.createProfile(mockUsername);

      expect(mockPrismaService.profile.create).toHaveBeenCalledWith({
        data: { username: mockUsername },
      });
      expect(result).toEqual(mockProfile);
    });

    it('should handle duplicate username error', async () => {
      const duplicateError = {
        code: 'P2002',
        clientVersion: '2.24.1',
        meta: { target: ['username'] },
        message: 'Unique constraint failed on the fields: (`username`)',
      };

      mockPrismaService.profile.create.mockRejectedValue(duplicateError);

      await expect(service.createProfile(mockUsername)).rejects.toMatchObject({
        code: 'P2002',
        meta: { target: ['username'] },
      });
    });

    it('should handle invalid username format', async () => {
      const invalidUsername = '@invalid!';
      const validationError = new Error('Invalid username format');
      
      mockPrismaService.profile.create.mockRejectedValue(validationError);

      await expect(service.createProfile(invalidUsername)).rejects.toThrow('Invalid username format');
    });
  });

  describe('findProfileByUsername', () => {
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

    it('should successfully find a profile by username with wallets', async () => {
      mockPrismaService.profile.findUniqueOrThrow.mockResolvedValue(mockProfile);
      (ModelTransformer.toProfileDto as jest.Mock).mockReturnValue({
        ...mockProfile,
        wallets: mockProfile.wallets,
      });

      const result = await service.findProfileByUsername(mockUsername);

      expect(mockPrismaService.profile.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { username: mockUsername },
        include: { wallets: true },
      });
      expect(result).toEqual({
        ...mockProfile,
        wallets: mockProfile.wallets,
      });
    });

    it('should handle profile not found error', async () => {
      const notFoundError = {
        code: 'P2025',
        clientVersion: '2.24.1',
        meta: undefined,
        message: 'Record not found',
      };

      mockPrismaService.profile.findUniqueOrThrow.mockRejectedValue(notFoundError);

      await expect(service.findProfileByUsername('nonexistent')).rejects.toMatchObject({
        code: 'P2025',
        message: 'Record not found',
      });
    });

    it('should handle database connection errors', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.profile.findUniqueOrThrow.mockRejectedValue(dbError);

      await expect(service.findProfileByUsername(mockUsername)).rejects.toThrow('Database connection failed');
    });
  });

  describe('findProfileByWalletAddress', () => {
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

    it('should successfully find a profile by wallet address', async () => {
      mockPrismaService.profile.findFirstOrThrow.mockResolvedValue(mockProfile);
      (ModelTransformer.toDto as jest.Mock).mockReturnValue({
        ...mockProfile,
        wallets: mockProfile.wallets,
      });

      const result = await service.findProfileByWalletAddress(mockWalletAddress);

      expect(mockPrismaService.profile.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          wallets: {
            some: {
              address: mockWalletAddress,
            },
          },
        },
        include: { wallets: true },
      });
      expect(result).toEqual({
        ...mockProfile,
        wallets: mockProfile.wallets,
      });
    });

    it('should handle wallet address not found error', async () => {
      const notFoundError = {
        code: 'P2025',
        clientVersion: '2.24.1',
        meta: undefined,
        message: 'Record not found',
      };

      mockPrismaService.profile.findFirstOrThrow.mockRejectedValue(notFoundError);

      await expect(service.findProfileByWalletAddress('0x1234')).rejects.toMatchObject({
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

      mockPrismaService.profile.findFirstOrThrow.mockRejectedValue(invalidFormatError);

      await expect(service.findProfileByWalletAddress(invalidAddress)).rejects.toMatchObject({
        code: 'P2006',
        meta: { target: ['address'] },
      });
    });

    it('should handle multiple wallets associated with profile', async () => {
      const mockMultipleWallets: Wallet[] = [
        mockWallet,
        {
          ...mockWallet,
          id: 'wallet-456',
          address: '0x987654321',
          isDefault: false,
        },
      ];
      const mockProfileMultiWallets = {
        ...mockProfile,
        wallets: mockMultipleWallets,
      };

      mockPrismaService.profile.findFirstOrThrow.mockResolvedValue(mockProfileMultiWallets);
      (ModelTransformer.toDto as jest.Mock).mockReturnValue(mockProfileMultiWallets);

      const result = await service.findProfileByWalletAddress(mockWalletAddress);

      expect(result.wallets).toHaveLength(2);
      expect(result.wallets).toEqual(expect.arrayContaining(mockMultipleWallets));
    });

    it('should handle database timeout errors', async () => {
      const timeoutError = new Error('Database operation timeout');
      mockPrismaService.profile.findFirstOrThrow.mockRejectedValue(timeoutError);

      await expect(service.findProfileByWalletAddress(mockWalletAddress)).rejects.toThrow('Database operation timeout');
    });
  });
});