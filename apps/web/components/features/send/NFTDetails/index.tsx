import Image from "next/image";

import { NFTAsset } from "@/types/assets";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { Info } from "lucide-react";

interface NFTDetailsProps {
  asset: NFTAsset;
}

export function NFTDetails({ asset }: Readonly<NFTDetailsProps>) {
  return (
    <div className="space-y-2 w-[27.5rem]">
      <div className="flex items-center gap-2">
        <p className="font-semibold">NFT Details</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button type="button" className="text-muted-foreground hover:text-foreground">
              <Info className="h-4 w-4" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <p className="text-sm font-medium">NFT Information</p>
              <div className="text-sm text-muted-foreground">
                <p>Contract: {asset.address}</p>
                <p>Token ID: {asset.tokenId}</p>
                <p>Chain ID: {asset.chainId}</p>
                {asset.collection && (
                  <p>Collection: {asset.collection.name}</p>
                )}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="aspect-square relative">
          <Image
            src={asset.meta?.image || asset.image.thumbnailUrl || "/api/placeholder/512/512"}
            alt={asset.meta?.name || `NFT #${asset.tokenId}`}
            className="object-cover w-full h-full"
          />
          
          {/* Network Badge */}
          <div className="absolute top-2 right-2">
            <div className="bg-background/80 backdrop-blur-sm rounded-full p-1">
              <Image
                src={`https://static.cx.metamask.io/api/v1/tokenIcons/${asset.chainId}/0x0000000000000000000000000000000000000000.png`}
                alt={`Chain ${asset.chainId}`}
                className="w-6 h-6 rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {asset.collection?.name || "Unknown Collection"}
            </p>
            {asset.balance !== "1" && (
              <p className="text-sm font-medium">
                Balance: {asset.balance}
              </p>
            )}
          </div>
          <p className="font-medium">
            {asset.meta?.name || `#${asset.tokenId}`}
          </p>
          {asset.meta?.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {asset.meta.description}
            </p>
          )}
        </div>
      </div>

      {/* NFT Attributes */}
      {asset.meta?.attributes && asset.meta.attributes.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {asset.meta.attributes.map((attr, index) => (
            <div
              key={`${attr.traitType}-${index}`}
              className="rounded-lg border bg-card p-2"
            >
              <p className="text-xs text-muted-foreground capitalize">
                {attr.traitType}
              </p>
              <p className="text-sm font-medium truncate">
                {attr.value.toString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}