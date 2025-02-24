// components/features/send/RecipientInput/index.tsx
import { useState, useEffect } from 'react';
import { Input } from "@workspace/ui/components/input";
import { UserRound, Loader2 } from "lucide-react";
import { trpc } from '@/server/client';
import { useDebounce } from 'use-debounce';
import { Profile } from '@/types/profle';

interface RecipientInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function RecipientInput({
  value,
  onChange,
  error
}: Readonly<RecipientInputProps>) {
  const [resolvedProfile, setResolvedProfile] = useState<Profile | null>(null);
  const debouncedValue = useDebounce(value, 500);

  const { data: profile, isLoading } = trpc.resolver.resolve.useQuery(
    { username: debouncedValue[0] },
    { 
      enabled: debouncedValue[0]?.endsWith('.eth') || (debouncedValue[0]?.length > 0 && !debouncedValue[0]?.startsWith('0x'))
    }
  );

  useEffect(() => {
    if (profile) {
      setResolvedProfile(profile);
    }
  }, [profile]);

  // Reset resolved profile when input changes
  useEffect(() => {
    if (!debouncedValue) {
      setResolvedProfile(null);
    }
  }, [debouncedValue]);

  return (
    <div className="space-y-2">
      <p className="font-semibold">Send to</p>
      <div className="relative">
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter address (0x), ENS, or username"
            className={`h-12 pl-10 ${
              error ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <UserRound className="h-5 w-5 text-muted-foreground" />
          </div>
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Resolved Profile Display */}
        {resolvedProfile && !error && (
          <div className="absolute mt-1 w-full rounded-md border bg-popover p-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="font-medium">{resolvedProfile.username}</p>
                <p className="text-xs text-muted-foreground">
                  {resolvedProfile.wallets[0]?.address}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="absolute text-sm text-destructive mt-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}