import { Input } from "@workspace/ui/components/input";
import { Asset } from "@/types/assets";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  asset: Asset;
  error?: string;
  disabled?: boolean;
}

export function AmountInput({ value, onChange, asset, error, disabled }: AmountInputProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and a single decimal point
    const newValue = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(newValue) || newValue === "") {
      onChange(newValue);
    }
  };

  // Handle max button click
  const handleMaxClick = () => {
    if (asset) {
      onChange(asset.balance);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Amount</p>
        {asset && (
          <button 
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={handleMaxClick}
          >
            Max: {asset.balance} {asset.symbol}
          </button>
        )}
      </div>
      
      <div className="relative">
        <div className="relative h-12 flex items-center border border-input rounded-md focus-within:border-primary hover:border-primary">
          <Input
            type="text"
            value={value}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="border-none h-full focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
          />
          {asset && (
            <span className="mr-4 text-muted-foreground">
              {asset.symbol}
            </span>
          )}
        </div>
        
        {error && (
          <div className="absolute -bottom-5 text-destructive text-xs">
            {error}
          </div>
        )}
      </div>
      
      {asset && asset.balanceUsd && (
        <div className="text-xs text-muted-foreground">
          ${asset.balanceUsd}
        </div>
      )}
    </div>
  );
}