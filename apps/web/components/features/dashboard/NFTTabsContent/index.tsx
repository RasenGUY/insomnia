'use client'
import React from 'react';
import { TabsContent } from '@workspace/ui/components/tabs';
import { NFTAsset } from '@/types/assets';
import { useRouter } from 'next/navigation';
import { NFTCard } from '../NFCard';
import { writeStateToQueryString } from '@/utils/router';

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
      <div id="nfts-tab">
        <div className="p-4 sm:p-6">
          <div>
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
        </div>
      </div>
    </TabsContent>
  );
};
export default NFTTabsContent;