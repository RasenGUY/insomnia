import { TokenAsset, NFTAsset, AssetType } from "@/types/assets";

interface AssetDisplayProps {
  asset: TokenAsset | NFTAsset;
}

export function AssetDisplay({ asset }: Readonly<AssetDisplayProps>) {
  const isNFT = asset.type === AssetType.ERC721 || asset.type === AssetType.ERC1155;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {isNFT ? (
          <img
            src={
              (asset as NFTAsset).meta?.image ||
              (asset as NFTAsset).image.thumbnailUrl ||
              "/api/placeholder/32/32"
            }
            alt={(asset as NFTAsset).meta?.name || "NFT"}
            className="w-8 h-8 rounded-lg"
          />
        ) : (
          <img
            src={(asset as TokenAsset).meta?.logo || "/api/placeholder/32/32"}
            alt={(asset as TokenAsset).meta?.symbol || "Token"}
            className="w-8 h-8 rounded-full"
          />
        )}
        <img
          src={`https://static.cx.metamask.io/api/v1/tokenIcons/${asset.chainId}/0x0000000000000000000000000000000000000000.png`}
          alt="Network"
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full ring-1 ring-border"
        />
      </div>
      <div className="text-left">
        <p className="font-medium">
          {isNFT
            ? (asset as NFTAsset).meta?.name || `#${(asset as NFTAsset).tokenId}`
            : (asset as TokenAsset).meta?.symbol}
        </p>
        <p className="text-sm text-muted-foreground">
          {isNFT
            ? (asset as NFTAsset).collection?.name || "Unknown Collection"
            : (asset as TokenAsset).meta?.name}
        </p>
      </div>
    </div>
  );
}