import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { trpc } from '@/server/client';
import { TokenAsset, NFTAsset, AssetType } from '@/types/assets';
import { WalletLabel } from '@/lib/constants/supported-chains';
import { getAddress } from 'viem';

export function useAssetLoader(address: string | undefined) {
  const [selectedTokenAsset, setSelectedTokenAsset] = useState<TokenAsset | null>(null);
  const [selectedNFTAsset, setSelectedNFTAsset] = useState<NFTAsset | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null); 
  const searchParams = useSearchParams();
  
  const { data: tokenAssets, isLoading: isTokenAssetsLoading } = trpc.assets.getTokenAssets.useQuery(
    { address: address ?? '', walletlabel: WalletLabel.POLYGON },
    { enabled: !!address }
  );

  const { data: nftAssets, isLoading: isNFTAssetsLoading } = trpc.assets.getNFTAssets.useQuery(
    { address: address ?? '', walletlabel: WalletLabel.POLYGON },
    { enabled: !!address }
  );

  useEffect(() => {
    if (!searchParams || !address) {
      return;
    }
    const assetAddress = searchParams.get('address');
    const assetType = searchParams.get('type');
    const tokenId = searchParams.get('tokenId');
    const chainId = searchParams.get('chainId');
    setSelectedAssetType(assetType);
    if (!assetAddress || !assetType || !chainId) { 
      return;
    };
    
    if (assetType === AssetType.ERC721 || assetType === AssetType.ERC1155) {
      const nftAsset = nftAssets?.find(asset => 
        getAddress(asset.address) === getAddress(assetAddress) &&  
        asset.tokenId === tokenId &&
        asset.chainId === Number(chainId)
      );
      if (nftAsset) { 
        setSelectedNFTAsset(nftAsset);
        setSelectedTokenAsset(null);
      }
    } else {
      const tokenAsset = tokenAssets?.find(
        asset => getAddress(asset.contractAddress) === getAddress(assetAddress) &&
        asset.chainId === Number(chainId)
      );
      if (tokenAsset) {
        setSelectedTokenAsset(tokenAsset);
        setSelectedNFTAsset(null);
      }
    }

    return () => {
      setSelectedNFTAsset(null);
      setSelectedTokenAsset(null);
      setSelectedAssetType(null);
    };
    
  }, [searchParams, address, tokenAssets, nftAssets]);

  return {
    selectedTokenAsset,
    setSelectedTokenAsset,
    selectedNFTAsset,
    setSelectedNFTAsset,
    selectedAssetType,
    setSelectedAssetType,
    isLoading: isTokenAssetsLoading || isNFTAssetsLoading,
    tokenAssets,
    nftAssets
  };
}