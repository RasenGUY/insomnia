import { Asset } from "@/types/assets";

interface NFTDetailsProps {
  asset: Asset;
}

export function NFTDetails({ asset }: NFTDetailsProps) {
  return (
    <div className="space-y-2">
      <p className="font-semibold">NFT Details</p>
      <div className="bg-accent p-4 rounded-lg">
        <div className="flex items-start space-x-4">
          <img 
            src={asset.imageUrl} 
            alt={asset.name} 
            className="w-16 h-16 rounded-md object-cover"
          />
          <div>
            <p className="font-medium">{asset.name}</p>
            <p className="text-xs text-muted-foreground">Token ID: {asset.tokenId}</p>
            {asset.contractAddress && (
              <p className="text-xs text-muted-foreground truncate max-w-xs">
                Contract: {asset.contractAddress.slice(0, 6)}...{asset.contractAddress.slice(-4)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}