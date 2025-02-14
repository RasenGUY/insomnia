import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { WalletService } from '../wallet.service';
import { WalletLabel } from '@prisma/client';
import { ModelTransformer } from 'common/transformers/model.transferformer';

// Mock the ModelTransformer
jest.mock( 'common/transformers/model.transferformer', () => ({
  ModelTransformer: {
    toDto: jest.fn(),
  },
}));

describe('WalletService', () => {
  let service: WalletService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    wallet: {
      create: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWallet', () => {
    const mockWalletData = {
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      profileId: '123e4567-e89b-12d3-a456-426614174000',
      label: WalletLabel.POLYGON,
    };

    const mockCreatedWallet = {
      id: 'wallet-123',
      ...mockWalletData,
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a wallet and set it as default if it is the first wallet', async () => {
      mockPrismaService.wallet.count.mockResolvedValue(0);
      mockPrismaService.wallet.create.mockResolvedValue(mockCreatedWallet);
      (ModelTransformer.toDto as jest.Mock).mockReturnValue(mockCreatedWallet);

      const result = await service.createWallet(mockWalletData);

      expect(mockPrismaService.wallet.count).toHaveBeenCalledWith({
        where: { profileId: mockWalletData.profileId },
      });
      expect(mockPrismaService.wallet.create).toHaveBeenCalledWith({
        data: {
          ...mockWalletData,
          isDefault: true,
        },
      });
      expect(result).toEqual(mockCreatedWallet);
    });

    it('should create a non-default wallet if other wallets exist', async () => {
      mockPrismaService.wallet.count.mockResolvedValue(1);
      const nonDefaultWallet = { ...mockCreatedWallet, isDefault: false };
      mockPrismaService.wallet.create.mockResolvedValue(nonDefaultWallet);
      (ModelTransformer.toDto as jest.Mock).mockReturnValue(nonDefaultWallet);

      const result = await service.createWallet(mockWalletData);

      expect(mockPrismaService.wallet.create).toHaveBeenCalledWith({
        data: {
          ...mockWalletData,
          isDefault: false,
        },
      });
      expect(result).toEqual(nonDefaultWallet);
    });

    it('should use POLYGON as default label if none provided', async () => {
      const dataWithoutLabel = {
        address: mockWalletData.address,
        profileId: mockWalletData.profileId,
      };

      mockPrismaService.wallet.count.mockResolvedValue(0);
      mockPrismaService.wallet.create.mockResolvedValue(mockCreatedWallet);
      (ModelTransformer.toDto as jest.Mock).mockReturnValue(mockCreatedWallet);

      await service.createWallet(dataWithoutLabel);

      expect(mockPrismaService.wallet.create).toHaveBeenCalledWith({
        data: {
          ...dataWithoutLabel,
          label: WalletLabel.POLYGON,
          isDefault: true,
        },
      });
    });

    // Edge Cases
    it('should handle duplicate wallet address error', async () => {
      mockPrismaService.wallet.count.mockResolvedValue(0);
      
      const duplicateError = {
        code: 'P2002',
        clientVersion: '2.24.1',
        meta: { target: ['address'] },
        message: 'Unique constraint failed on the fields: (`address`)',
        name: 'PrismaClientKnownRequestError'
      };
      
      mockPrismaService.wallet.create.mockImplementation(() => {
        throw duplicateError;
      });

      let error: any;
      try {
        await service.createWallet(mockWalletData);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe('P2002');
      expect(error.meta.target).toEqual(['address']);
    });

    it('should handle invalid profile ID error', async () => {
      mockPrismaService.wallet.count.mockResolvedValue(0);
      
      const profileError = {
        code: 'P2003',
        clientVersion: '2.24.1',
        meta: { field_name: 'profileId' },
        message: 'Foreign key constraint failed on the field: `profileId`',
        name: 'PrismaClientKnownRequestError'
      };
      
      mockPrismaService.wallet.create.mockImplementation(() => {
        throw profileError;
      });

      let error: any;
      try {
        await service.createWallet(mockWalletData);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe('P2003');
      expect(error.meta.field_name).toBe('profileId');
    });

    it('should handle invalid ethereum address format', async () => {
      const invalidData = {
        ...mockWalletData,
        address: 'invalid-address',
      };

      mockPrismaService.wallet.count.mockResolvedValue(0);
      
      const addressError = {
        code: 'P2006',
        clientVersion: '2.24.1',
        meta: { target: ['address'] },
        message: 'Invalid data provided',
        name: 'PrismaClientKnownRequestError'
      };
      
      mockPrismaService.wallet.create.mockImplementation(() => {
        throw addressError;
      });

      let error: any;
      try {
        await service.createWallet(invalidData);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe('P2006');
      expect(error.meta.target).toEqual(['address']);
    });

    it('should handle database connection errors', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.wallet.count.mockImplementation(() => {
        throw dbError;
      });

      let error: any;
      try {
        await service.createWallet(mockWalletData);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message).toBe('Database connection failed');
    });
  });
});