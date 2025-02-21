import { ChevronDown } from "lucide-react";

interface FromAddressSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function FromAddressSelector({ value, onChange, error }: FromAddressSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="font-semibold">Send from</p>
      <div className="relative">
        <button
          type="button"
          className={`w-full h-12 px-4 py-3 flex items-center justify-between rounded-lg border transition-colors
            ${error ? 'border-destructive' : 'border-input hover:border-primary hover:bg-accent'}`}
          onClick={() => {
            console.log("Open wallet selector");
          }}
        >
          <div className="flex items-center truncate">
            <span className="text-sm">{value}</span>
          </div>
          <ChevronDown className="h-4 w-4 ml-2" />
        </button>
        {error && (
          <div className="absolute -bottom-5 text-destructive text-xs">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}