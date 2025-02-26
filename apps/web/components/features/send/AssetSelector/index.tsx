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
import { TokenAsset, NFTAsset } from "@/types/assets";
import { TokenList } from "./subcomponents/TokenList";
import { NFTGrid } from "./subcomponents/NFTGrid";
import { NetworkSelector } from "./subcomponents/NetworkSelector";
import { AssetDisplay } from "./subcomponents/AssetDisplay";

interface AssetSelectorProps {
  value: TokenAsset | NFTAsset | null;
  onChange: (asset: TokenAsset | NFTAsset) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  tokenAssets: TokenAsset[];
  nftAssets: NFTAsset[];
  error?: string;
}

export function AssetSelector({
  value,
  onChange,
  isModalOpen,
  setIsModalOpen,
  tokenAssets,
  nftAssets,
  error
}: Readonly<AssetSelectorProps>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tokens" | "nfts">("tokens");
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null);

  const filteredAssets = {
    tokens: tokenAssets.filter(asset => {
      const matchesSearch = !searchQuery || 
        asset.meta?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.meta?.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNetwork = !selectedNetwork || asset.chainId === selectedNetwork;
      return matchesSearch && matchesNetwork;
    }),
    nfts: nftAssets.filter(asset => {
      const matchesSearch = !searchQuery ||
        asset.meta?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.collection?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNetwork = !selectedNetwork || asset.chainId === selectedNetwork;
      return matchesSearch && matchesNetwork;
    })
  };


  const networks = Array.from(new Set([
    ...tokenAssets.map(asset => asset.chainId),
    ...nftAssets.map(asset => asset.chainId)
  ]));

  return (
    <>
      {/* Asset Selection Button */}
      <div className="space-y-2">
        <p className="font-semibold">Asset</p>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`w-full h-12 px-4 py-3 flex items-center justify-between rounded-lg border transition-colors
            ${error ? 'border-destructive' : 'border-input hover:border-primary hover:bg-accent'}`}
        >
          {value ? (
            <AssetDisplay asset={value} />
          ) : (
            <span className="text-muted-foreground">Select Asset</span>
          )}
          <ChevronDown className="h-4 w-4 ml-2" />
        </button>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>

      {/* Asset Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[644px] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Select asset to send
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
            {/* Tabs */}
            <Tabs
              defaultValue="tokens"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "tokens" | "nfts")}
              className="w-full"
            >
              <TabsList className="w-full sm:w-[170px] h-[46px] bg-inherit mb-3">
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

              {/* Search and Network Selection */}
              <div className="flex w-full gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search assets"
                      className="pl-9"
                    />
                  </div>
                </div>
                <NetworkSelector
                  networks={networks}
                  selectedNetwork={selectedNetwork}
                  onSelect={setSelectedNetwork}
                />
              </div>


              {/* Asset Lists */}
              <div className="mt-4 h-[380px] overflow-y-auto">
                <TabsContent value="tokens">
                  <TokenList
                    assets={filteredAssets.tokens}
                    onSelect={(asset) => {
                      onChange(asset);
                      setIsModalOpen(false);
                    }}
                  />
                </TabsContent>
                <TabsContent value="nfts">
                  <NFTGrid
                    assets={filteredAssets.nfts}
                    onSelect={(asset) => {
                      onChange(asset);
                      setIsModalOpen(false);
                    }}
                  />
                </TabsContent>
              </div>
              
              </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}