import { Asset } from "@/types/assets"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@workspace/ui/components/card"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { TabsContent } from "@workspace/ui/components/tabs"
import { AlertCircle } from "lucide-react"
// Mock data - replace with real data from your API/state
const tokens = [
  { 
    symbol: 'ETH', 
    name: 'Ethereum',
    balance: '1.234',
    icon: '🌐'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: '1,000.00',
    icon: '💵'
  }
];

interface TokenTabsContentProps {
  assets: Asset[];
}

export const TokenTabsContent: React.FC<Readonly<TokenTabsContentProps>> = ({ assets }) => {
  return (
    <TabsContent value="tokens">
    <Card>
      <CardHeader>
        <CardTitle>Token Holdings</CardTitle>
        <CardDescription>View and manage your token portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {assets.length > 0 ? (
            <div className="space-y-4">
              {assets.map((token, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{assets.icon}</div>
                    <div>
                      <div className="font-medium">{assets.name}</div>
                      <div className="text-sm text-muted-foreground">{token.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{assets.balance}</div>
                    <div className="text-sm text-muted-foreground">{assets.value}</div>
                    <div className="text-sm text-green-500">{assets.change}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No tokens found in this wallet.
              </AlertDescription>
            </Alert>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  </TabsContent>
  )
}