import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { trpc } from '@/server/client';
import { TokenAsset, NFTAsset, AssetType } from '@/types/assets';
import { WalletLabel } from '@/lib/constants/supported-chains';

export function useAssetLoader(address: string | undefined) {
  const [selectedAsset, setSelectedAsset] = useState<TokenAsset | NFTAsset | null>(null);
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

    const assetAddress = searchParams.get('address');
    const assetType = searchParams.get('type');
    const tokenId = searchParams.get('tokenId');
    const chainId = searchParams.get('chainId');

    if (!assetAddress || !assetType || !chainId) return;

    // Find the correct asset based on URL parameters
    if (assetType === AssetType.ERC721 || assetType === AssetType.ERC1155) {
      const nftAsset = nftAssets?.find(asset => 
        asset.address === assetAddress && 
        asset.tokenId === tokenId &&
        asset.chainId === Number(chainId)
      );
      if (nftAsset) setSelectedAsset(nftAsset);
    } else {
      const tokenAsset = tokenAssets?.find(asset =>
        asset.contractAddress === assetAddress &&
        asset.chainId === Number(chainId)
      );
      if (tokenAsset) setSelectedAsset(tokenAsset);
    }
  }, [searchParams, address, tokenAssets, nftAssets]);

  return {
    selectedAsset,
    setSelectedAsset,
    tokenAssets,
    nftAssets
  };
}