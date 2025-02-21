import { useState } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Asset, tokens, nfts } from "@/types/assets";

interface AssetSelectorProps {
  value: Asset;
  onChange: (asset: Asset) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  error?: string;
}

export function AssetSelector({ 
  value, 
  onChange, 
  isModalOpen, 
  setIsModalOpen, 
  error 
}: AssetSelectorProps) {
  const [assetSearchQuery, setAssetSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tokens" | "nfts">("tokens");
  
  // Filtered assets based on search query and active tab
  const filteredAssets = () => {
    const assets = activeTab === "tokens" ? tokens : nfts;
    if (!assetSearchQuery) return assets;
    
    return assets.filter(asset => 
      asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) || 
      asset.symbol.toLowerCase().includes(assetSearchQuery.toLowerCase())
    );
  };

  return (
    <>
      <div className="space-y-2">
        <p className="font-semibold">Asset</p>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`w-full h-12 px-4 py-3 flex items-center justify-between rounded-lg border transition-colors
            ${error ? 'border-destructive' : 'border-input hover:border-primary hover:bg-accent'}`}
        >
          {value ? (
            <div className="flex items-center">
              <div className="relative mr-2">
                <img 
                  src={value.imageUrl} 
                  alt={value.symbol} 
                  className="w-6 h-6 rounded-full object-cover"
                />
                {value.networkImageUrl && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full overflow-hidden ring-1 ring-border">
                    <img 
                      src={value.networkImageUrl} 
                      alt="Network" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <span className="font-medium">{value.symbol}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select Asset</span>
          )}
          <ChevronDown className="h-4 w-4 ml-2" />
        </button>
        {error && (
          <div className="text-destructive text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Asset Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[644px] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Select asset to send
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </DialogHeader>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
            <Tabs
              defaultValue="tokens"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "tokens" | "nfts")}
              className="w-full sm:w-auto"
            >
              <TabsList className="w-full sm:w-[170px] h-[46px] rounded-full">
                <TabsTrigger 
                  value="tokens"
                  className="rounded-full w-full text-sm"
                >
                  Tokens
                </TabsTrigger>
                <TabsTrigger 
                  value="nfts"
                  className="rounded-full w-full text-sm"
                >
                  NFTs
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="w-full rounded-lg border border-input focus-within:border-primary">
              <div className="flex relative">
                <div className="relative w-full">
                  <div className="absolute ml-4 flex items-center h-full">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    value={assetSearchQuery}
                    onChange={(e) => setAssetSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="pl-10 bg-accent border-none"
                  />
                </div>
                <div className="absolute right-0">
                  <button 
                    type="button"
                    className="flex items-center bg-accent hover:bg-muted rounded-r-md py-2.5 px-4 h-full border-l border-input"
                  >
                    <div className="font-bold">All networks</div>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 h-[380px] overflow-y-auto">
            {filteredAssets().map((asset) => (
              <button
                type="button"
                key={asset.id}
                className="group flex rounded-md items-center justify-between w-full space-x-4 px-4 py-3 text-sm hover:bg-accent"
                onClick={() => onChange(asset)}
              >
                <div className="flex text-left items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    {asset.networkImageUrl && (
                      <div className="flex items-center justify-center w-4 h-4 rounded-full overflow-hidden absolute ring-1 ring-border -top-1 -right-1">
                        <img 
                          src={asset.networkImageUrl} 
                          alt="Network" 
                          className="rounded-full"
                        />
                      </div>
                    )}
                    <img 
                      src={asset.imageUrl} 
                      alt={asset.symbol} 
                      className="w-8 h-8 rounded-full object-cover min-w-[2rem]"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-5 font-semibold">{asset.symbol}</p>
                    <p className="text-xs font-normal text-muted-foreground">{asset.name}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end sm:max-w-[200px]">
                  <p className="text-sm font-normal">{asset.balance} {asset.symbol}</p>
                  {asset.balanceUsd && (
                    <p className="text-xs font-normal text-muted-foreground">${asset.balanceUsd}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}