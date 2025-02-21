import { Input } from "@workspace/ui/components/input";

interface RecipientInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function RecipientInput({ value, onChange, error }: Readonly<RecipientInputProps>) {
  return (
    <div className="space-y-2">
      <p className="font-semibold">Send to</p>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter public address (0x) or ENS name"
          className={`h-12 bg-transparent ${
            error ? 'border-destructive ring-destructive focus:border-destructive focus:ring-destructive' : ''
          }`}
        />
        {error && (
          <div className="absolute -bottom-5 text-destructive text-xs">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}