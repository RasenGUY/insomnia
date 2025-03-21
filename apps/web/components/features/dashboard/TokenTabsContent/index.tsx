import React from 'react';

import { TokenAsset } from "@/types/assets";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { TabsContent } from "@workspace/ui/components/tabs";
import { 
  AlertCircle, 
  HelpCircle, 
  MoreVertical
} from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { useRouter } from "next/navigation";
import { writeStateToQueryString } from '@/utils/router';

interface TokenTabsContentProps {
  assets: TokenAsset[];
}

export const TokenTabsContent: React.FC<Readonly<TokenTabsContentProps>> = ({ assets }) => {
  const router = useRouter();
  const goToSendPage = (asset: TokenAsset) => {
    const assetData = {
      address: encodeURIComponent(asset.contractAddress),
      type: encodeURIComponent(asset.type),
      chainId: encodeURIComponent(asset.chainId),
    }
    router.push(`/send?${writeStateToQueryString(assetData)}`); 
  }
  return (
    <TabsContent value="tokens">
      <Card className="border-0 rounded-[unset] bg-inherit">
        <CardHeader>
          <CardTitle>Token Holdings</CardTitle>
          <CardDescription>View and manage your token portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {assets.length > 0 && !noZeroBalances(assets) ? (
              <table className="w-full">
                <thead className="border-b border-muted">
                  <tr>
                    <th className="text-left font-normal py-2">
                      <div className="flex items-center gap-1">
                        Token
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
                      </div>
                    </th>
                    <th className="hidden xl:table-cell text-left font-normal">
                      <div className="flex items-center gap-1 cursor-pointer font-semibold">
                        Portfolio %
                        {/* <ChevronDown className="w-5 h-5" /> */}
                      </div>
                    </th>
                    <th className="hidden lg:table-cell text-left font-normal">
                      Price (24hr)
                    </th>
                    <th className="text-right lg:text-left font-normal">
                      Balance
                    </th>
                    <th className="w-6" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {assets.map((token, index) => (
                    <tr 
                      key={`${token.contractAddress}-${index}`}
                      className="hover:bg-accent/50 cursor-pointer group"
                    >
                      {/* Token Info */}
                      <td className="py-4"> 
                        <div className="flex items-center">
                          <div className="relative mr-4">
                            <img 
                              src={token.meta?.logo || "/api/placeholder/32/32"}
                              alt={token.meta?.symbol || "Token"} 
                              className="w-8 h-8 rounded-full object-cover min-w-[2rem]"
                            />
                            {token.chainId && (
                              <div className="absolute -top-1 -right-1">
                                <div className="w-4 h-4 rounded-full ring-1 ring-border overflow-hidden">
                                  <img
                                    src={`https://static.cx.metamask.io/api/v1/tokenIcons/${token.chainId}/0x0000000000000000000000000000000000000000.png`}
                                    alt="Chain"
                                    className="rounded-full"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <div className="font-semibold flex">
                              <div className="mr-1.5 uppercase">
                                {token.meta?.symbol}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {token.meta?.name || "Unknown Token"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Portfolio % */}
                      <td className="hidden xl:table-cell font-semibold">
                        {(Number(token.balance) * 100 / assets.reduce((acc, curr) => acc + Number(curr.balance), 0)).toFixed(2)}%
                      </td>

                      {/* Price */}
                      <td className="hidden lg:table-cell">
                        <div className="text-default font-semibold">
                          {token.price ? `$${Number(token.price).toFixed(4)}` : '$0.00'}
                        </div>
                        {/* <p className="text-sm text-emerald-500">
                          +0.05%
                        </p> */}
                      </td>

                      {/* Balance */}
                      <td className="text-right lg:text-left">
                        <div className="flex flex-col">
                          <p className="text-sm sm:text-base font-semibold">
                            ${(Number(token.balance) * Number(token.price)).toFixed(2)}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground uppercase">
                            {token.balance} {token.meta?.symbol}
                          </p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="w-6">
                        <div className="flex items-center justify-center h-full">
                            <DropdownMenu>
                            <DropdownMenuTrigger>
                              <span 
                                className="hidden group-hover:flex h-auto p-0 hover:bg-transparent"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => goToSendPage(token)}
                                >
                                Send
                              </DropdownMenuItem>
                              <DropdownMenuItem>View on Explorer</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Alert className="flex items-baseline"> 
                <AlertCircle style={{
                  position: 'unset',
                }} className="h-5 w-5" /> 
                <AlertDescription style={{ paddingLeft: '0.5rem' }}>
                  No tokens found in this wallet.
                </AlertDescription>
              </Alert>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

function noZeroBalances(assets: TokenAsset[]) {
  return !assets.every(asset => Number(asset.balance) !== 0)
}