'use client'
// components/features/send/RecipientInput/index.tsx
import { useState, useEffect, useRef } from 'react';
import { Input } from "@workspace/ui/components/input";
import { UserRound, Loader2, Wallet, CheckCircle2 } from "lucide-react";
import { trpc } from '@/server/client';
import { useDebounce } from 'use-debounce';
import { Profile } from '@/types/profle';
import { isAddress } from 'viem';

interface RecipientInputProps {
  value: string;
  isDirty: boolean;
  setValue: (value: string) => void;
  onChange: (value: string) => void;
  error?: string;
  triggerValidation?: () => void;
}

export function RecipientInput({
  value,
  onChange,
  isDirty,
  error,
  setValue,
  triggerValidation
}: Readonly<RecipientInputProps>) {
  const [resolvedProfile, setResolvedProfile] = useState<Profile | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [walletSelected, setWalletSelected] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [debouncedValue] = useDebounce(value, 1000);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { data: profile, isLoading, isFetching, refetch } = trpc.resolver.resolve.useQuery(
    { username: debouncedValue },
    { 
      enabled: false,
    }
  );

  // Check if current value is a valid address
  useEffect(() => {
    setIsValidAddress(isAddress(value));
  }, [value]);

  // Handle profile resolution
  useEffect(() => {
    if (profile && profile.wallets.length > 0) {
      setResolvedProfile(profile);
      setShowDropdown(true);
    } else {
      setResolvedProfile(null);
    }
  }, [profile]);

  // Reset resolved profile when input changes
  useEffect(() => {
    if (debouncedValue?.length === 0) {
      setResolvedProfile(null);
      setShowDropdown(false);
      setWalletSelected(false);
    } else if (!debouncedValue?.startsWith('0x')) {
      refetch();
      setWalletSelected(false);
    }
  }, [debouncedValue, refetch]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle wallet selection
  const handleWalletSelect = (address: string) => {
    setValue(address);
    setWalletSelected(true);
    setIsValidAddress(isAddress(address));
    setShowDropdown(false);
    
    // Trigger validation if available
    if (triggerValidation) {
      setTimeout(() => {
        triggerValidation();
      }, 0);
    }
  };

  // Determine input border style
  const getBorderStyle = () => {
    if (error) {
      return 'border-destructive focus-visible:ring-destructive';
    }
    return '';
  };

  return (
    <div className="space-y-2">
      <p className="font-semibold">Send to</p>
      <div className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              if (walletSelected) {
                setWalletSelected(false);
              }
              onChange(e.target.value);
            }}
            placeholder="Enter address (0x), or username"
            className={`h-12 pl-10 ${getBorderStyle()}`}
            onFocus={() => resolvedProfile && setShowDropdown(true)}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <UserRound className="h-5 w-5 text-muted-foreground" />
          </div>
          
          {/* Show loading state */}
          {(isLoading || isFetching) && isDirty && !walletSelected && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {/* Show success check when address is valid and no error */}
          {isValidAddress && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          )}
        </div>

        {/* Dropdown for profile wallet selection */}
        {resolvedProfile && showDropdown && (
          <div 
            ref={dropdownRef}
            className="absolute mt-1 w-full rounded-md border bg-popover p-2 text-sm shadow-md z-10"
          >
            <div className="mb-2 border-b pb-1">
              <p className="font-medium">{resolvedProfile.username}</p>
            </div>
            <div className="space-y-2">
              {resolvedProfile.wallets.map((wallet) => (
                <button 
                  key={wallet.address} 
                  className="w-full flex items-center gap-2 p-1.5 rounded-md hover:bg-muted transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleWalletSelect(wallet.address);
                  }}
                >
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground break-all">
                      {wallet.address}
                    </p>
                    {wallet.label && (
                      <p className="text-xs font-medium">{wallet.label}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="absolute text-sm text-destructive mt-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}