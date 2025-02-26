// components/features/send/AmountInput/index.tsx
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { TokenAsset, NFTAsset, AssetType } from "@/types/assets";
import { formatBalance, parseInputAmount } from "@/utils/format";
import { formatUnits } from "viem";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  asset: TokenAsset | NFTAsset | null;
  error?: string;
  disabled?: boolean;
}

export function AmountInput({
  value,
  onChange,
  asset,
  error,
  disabled
}: Readonly<AmountInputProps>) {
  if (!asset) return null;

  const isNFT = asset.type === AssetType.ERC721 || asset.type === AssetType.ERC1155;
  const maxAmount = asset.balance;
  const symbol = isNFT ? '' : (asset as TokenAsset).meta?.symbol;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^[0-9]*\.?[0-9]*$/.test(newValue) || newValue === "") {
      onChange(newValue);
    }
  };

  const handleMaxClick = () => {
    if (!asset) return;
    onChange(maxAmount);
  };

  // Calculate USD value for tokens if price is available
  const getUSDValue = () => {
    if (isNFT || !(asset as TokenAsset).price || !value) return null;
    const tokenAsset = asset as TokenAsset;
    return (Number(value) * Number(tokenAsset.price)).toFixed(2);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Amount</p>
        {!isNFT && (
          <Button
            type="button"
            variant="ghost"
            className="h-auto p-0 text-xs text-primary hover:text-primary/80"
            onClick={handleMaxClick}
          >
            Max: {formatBalance(maxAmount)} {symbol}
          </Button>
        )}
      </div>

      <div className="relative">
        <div className="relative flex items-center border border-input rounded-md focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
          <Input
            type="text"
            value={value}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="border-0 focus-visible:ring-0 pr-16"
            disabled={disabled || asset.type === AssetType.ERC721}
          />
          {symbol && (
            <div className="absolute right-3 text-muted-foreground">
              {symbol}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive mt-1">
            {error}
          </p>
        )}
      </div>

      {/* USD Value */}
      {!isNFT && (
        <div className="text-sm text-muted-foreground">
          {getUSDValue() ? `≈ $${getUSDValue()}` : ''}
        </div>
      )}
    </div>
  );
}