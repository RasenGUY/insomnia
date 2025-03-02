import { NFTAsset } from "@/types/assets";
import { MoreHorizontal } from "lucide-react";
import { AvatarImage, AvatarFallback, Avatar } from "@workspace/ui/components/avatar";
import Image from "next/image";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem 
} from "@workspace/ui/components/dropdown-menu";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@workspace/ui/components/hover-card";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@workspace/ui/components/tooltip";
import { Card } from "@workspace/ui/components/card";

interface NFTCardProps {
  nft: NFTAsset;
  index: number;
  handleSend: (nft: NFTAsset) => void;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft, index, handleSend }) => {
  
  return (
    <Card
      tabIndex={0}
      className="relative translate-y-0 hover:z-10 hover:shadow-2xl hover:-translate-y-0.5 bg-inherit rounded-lg shadow-xl transition-all cursor-pointer group border border-muted w-full text-left"
    >
      {/* NFT Image */}
      <div className="flex shrink-0 aspect-square rounded-t-md bg-muted overflow-hidden items-center">
        <Image
          src={nft.meta?.image || nft.image.thumbnailUrl || '/api/placeholder/512/512'}
          alt={nft.meta?.name || 'NFT'}
          className="w-full h-full object-cover block"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Chain and Contract Badges */}
      <div className="-mt-3 flex justify-end mr-3">
        <div className="-space-x-1 items-center flex">
          {/* Contract Badge */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="ring-4 ring-muted hover:-translate-y-2 transition-transform h-6 w-6">
                  <AvatarImage src={`https://cdn.stamp.fyi/avatar/${nft.address}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {nft.address.slice(2, 4)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>Contract: {nft.address}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Chain Badge */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="ring-4 ring-muted hover:-translate-y-2 transition-transform h-6 w-6">
                  <AvatarImage 
                    src={`https://static.cx.metamask.io/api/v1/tokenIcons/${nft.chainId}/0x0000000000000000000000000000000000000000.png`} 
                  />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    {nft.chainId}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chain ID: {nft.chainId}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* NFT Details */}
      <div className="px-3 pt-4 pb-4 space-y-3">
        <div className="flex text-xs text-muted-foreground items-center justify-between">
          <HoverCard>
            <HoverCardTrigger>
              <span className="truncate cursor-help">
                {nft.collection?.name || 'Unknown Collection'}
              </span>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">{nft.collection?.name}</h4>
                {nft.collection?.externalUrl && (
                  <p className="text-xs text-muted-foreground">
                    <a href={nft.collection.externalUrl} target="_blank" rel="noopener noreferrer">
                      View Collection
                    </a>
                  </p>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <span  
                className="hidden group-hover:flex h-auto p-0 hover:bg-transparent"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem
                onClick={() => handleSend(nft)}
                >
                Send
              </DropdownMenuItem>
              <DropdownMenuItem>View on Explorer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="block text-sm font-medium truncate whitespace-pre">
                {nft.meta?.name || `#${nft.tokenId}`}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{nft.meta?.name || `Token ID: ${nft.tokenId}`}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};