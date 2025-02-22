import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { 
  Coins, 
  ImageDown, 
} from "lucide-react";

import { TokenTabsContent } from "./TokenTabsContent";
import { NFTTabsContent } from "./NFTTabsContent";
import { Asset } from '@/types/assets';

interface PortfolioViewProps {
  tokenAssets: Asset[];
}

const PortfolioView: React.FC<Readonly<PortfolioViewProps>> = ({ tokenAssets }) => {
  return (
    <div className="w-full p-6"> 
      <Tabs defaultValue="tokens">
        <TabsList className="grid grid-cols-2 mb-8 w-[fit-content] max-w-4xl" >
          <TabsTrigger value="tokens" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Tokens
          </TabsTrigger>
          <TabsTrigger value="nfts" className="flex items-center gap-2">
            <ImageDown className="h-4 w-4" />
            NFTs
          </TabsTrigger>
        </TabsList>
        <TokenTabsContent assets={tokenAssets} />
        <NFTTabsContent />
      </Tabs>
    </div>
  );
};

export default PortfolioView;