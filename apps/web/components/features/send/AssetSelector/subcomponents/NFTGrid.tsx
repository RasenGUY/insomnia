
import { NFTAsset } from "@/types/assets";

interface NFTGridProps {
  assets: NFTAsset[];
  onSelect: (asset: NFTAsset) => void;
}

export function NFTGrid({ assets, onSelect }: Readonly<NFTGridProps>) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No NFTs found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {assets.map((asset) => (
        <button
          key={`${asset.address}-${asset.tokenId}-${asset.chainId}`}
          type="button"
          onClick={() => onSelect(asset)}
          className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
        >
          <img
            src={asset.meta?.image || asset.image.thumbnailUrl || "/api/placeholder/512/512"}
            alt={asset.meta?.name || `NFT #${asset.tokenId}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-white text-sm font-medium truncate">
              {asset.meta?.name || `#${asset.tokenId}`}
            </p>
            <p className="text-white/80 text-xs truncate">
              {asset.collection?.name || 'Unknown Collection'}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

