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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  
  const { data: tokenAssets } = trpc.assets.getTokenAssets.useQuery(
    { address: address ?? '', walletlabel: WalletLabel.POLYGON },
    { enabled: !!address }
  );

  const { data: nftAssets } = trpc.assets.getNFTAssets.useQuery(
    { address: address ?? '', walletlabel: WalletLabel.POLYGON },
    { enabled: !!address }
  );

  useEffect(() => {
    if (!searchParams || !address) return;
    setIsLoading(true);
    const assetAddress = searchParams.get('address');
    const assetType = searchParams.get('type');
    const tokenId = searchParams.get('tokenId');
    const chainId = searchParams.get('chainId');

    if (!assetAddress || !assetType || !chainId) { 
      setIsLoading(false);
      return
    };
    
    if (assetType === AssetType.ERC721 || assetType === AssetType.ERC1155) {
      const nftAsset = nftAssets?.find(asset => 
        getAddress(asset.address) === getAddress(assetAddress) &&  
        asset.tokenId === tokenId &&
        asset.chainId === Number(chainId)
      );
      if (nftAsset) setSelectedNFTAsset(nftAsset);
      setIsLoading(false);
    } else {
      const tokenAsset = tokenAssets?.find(asset => getAddress(asset.contractAddress) === getAddress(assetAddress) &&
        asset.chainId === Number(chainId));
      if (tokenAsset) 
        setSelectedTokenAsset(tokenAsset);
      setIsLoading(false);
    }
    if(selectedTokenAsset || selectedNFTAsset) setSelectedAssetType(assetType);
    return () => {
      setSelectedNFTAsset(null);
      setSelectedTokenAsset(null);
      setSelectedAssetType(null);
      setIsLoading(false);
    };
  }, [searchParams, address, tokenAssets, nftAssets, selectedTokenAsset, selectedNFTAsset]);

  return {
    selectedTokenAsset,
    setSelectedTokenAsset,
    selectedNFTAsset,
    setSelectedNFTAsset,
    selectedAssetType,
    setSelectedAssetType,
    tokenAssets,
    isLoading,
    nftAssets
  };
}