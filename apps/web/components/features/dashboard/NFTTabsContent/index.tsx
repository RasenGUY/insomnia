'use client'
import React from 'react';
import { TabsContent } from '@workspace/ui/components/tabs';
import { NFTAsset } from '@/types/assets';
import { useRouter } from 'next/navigation';
import { NFTCard } from '../NFTCard';
import { writeStateToQueryString } from '@/utils/router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';

interface NFTTabsContentProps {
  assets: NFTAsset[];
}

export const NFTTabsContent: React.FC<NFTTabsContentProps> = ({ assets }) => {
  const router = useRouter() 
  
  const goToSendPage = (nft: NFTAsset) => {
    const nftData = {
      address: encodeURIComponent(nft.address),
      tokenId: encodeURIComponent(nft.tokenId as string),
      chainId: encodeURIComponent(nft.chainId),
      assetType: encodeURIComponent(nft.type),
      balance: encodeURIComponent(nft.balance),
    }
    router.push(`/send?${writeStateToQueryString(nftData)}`);
  };

  return (
    <TabsContent value="nfts" className="focus:outline-none">
      <Card className="border-0 rounded-[unset] bg-inherit">
        <CardHeader>
          <CardTitle>NFT Holdings</CardTitle>
          <CardDescription>View and manage your nft</CardDescription> 
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {
              assets.length > 0 ? (
              <div id="nfts-tab" className="w-full">
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 xl:gap-x-8">
                      {assets.map((nft, index) => (
                        <NFTCard 
                          key={`${nft.address}-${nft.tokenId}-${nft.chainId}-${index}`}
                          nft={nft}
                          index={index}
                          handleSend={() => goToSendPage(nft)}
                        />
                      ))}
                  </div>
                </div>
              </div> ) : (
                <Alert className="flex items-baseline"> 
                  <AlertCircle style={{ position: 'unset'}} className="h-5 w-5" /> 
                  <AlertDescription style={{paddingLeft: '0.5rem'}}>
                    No NFTs found in this wallet.
                  </AlertDescription>
                </Alert>
              )
            }
          </ScrollArea>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
export default NFTTabsContent;