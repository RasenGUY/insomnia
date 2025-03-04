
import { TokenAsset } from "@/types/assets";
import { formatBalance } from "@/utils/format";

interface TokenListProps {
  assets: TokenAsset[];
  onSelect: (asset: TokenAsset) => void;
}

export function TokenList({ assets, onSelect }: Readonly<TokenListProps>) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tokens found
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {assets.map((asset) => (
        <button
          key={`${asset.contractAddress}-${asset.chainId}`}
          type="button"
          onClick={() => onSelect(asset)}
          className="w-full p-3 hover:bg-accent rounded-lg transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={asset.meta?.logo || "/api/placeholder/32/32"}
                alt={asset.meta?.symbol || "Token"}
                className="w-8 h-8 rounded-full"
              />
              <img
                src={`https://static.cx.metamask.io/api/v1/tokenIcons/${asset.chainId}/0x0000000000000000000000000000000000000000.png`}
                alt="Network"
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full ring-1 ring-border"
              />
            </div>
            <div className="text-left">
              <p className="font-medium">{asset.meta?.symbol}</p>
              <p className="text-sm text-muted-foreground">{asset.meta?.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatBalance(asset.balance, asset.meta?.decimals)} {asset.meta?.symbol}</p>
            {asset.price && (
              <p className="text-sm text-muted-foreground">
                ${(Number(asset.balance) * Number(asset.price)).toFixed(2)}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}