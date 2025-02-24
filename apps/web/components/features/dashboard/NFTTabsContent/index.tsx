import { NFTAsset } from "@/types/assets"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@workspace/ui/components/card"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { TabsContent } from "@workspace/ui/components/tabs"
import { ExternalLink, AlertCircle } from "lucide-react"

const nfts = [
  {
    name: 'Bored Ape #1234',
    collection: 'Bored Ape Yacht Club',
    lastPrice: '50 ETH',
    image: '/api/placeholder/200/200'
  },
  {
    name: 'Doodle #5678',
    collection: 'Doodles',
    lastPrice: '8 ETH',
    image: '/api/placeholder/200/200'
  }
];

interface NFTTabsContentProps {
  assets: NFTAsset[];
}

export const NFTTabsContent: React.FC<NFTTabsContentProps> = () => {
  return ( 
    <TabsContent value="nfts">
    <Card>
      <CardHeader>
        <CardTitle>NFT Collection</CardTitle>
        <CardDescription>View your NFT holdings</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {nfts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nfts.map((nft, index) => (
                <div 
                  key={index} 
                  className="rounded-lg border overflow-hidden hover:bg-accent cursor-pointer transition-colors"
                >
                  <img 
                    src={nft.image} 
                    alt={nft.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium">{nft.name}</h3>
                    <p className="text-sm text-muted-foreground">{nft.collection}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm">{nft.lastPrice}</span>
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No NFTs found in this wallet.
              </AlertDescription>
            </Alert>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  </TabsContent>
   )
}
 