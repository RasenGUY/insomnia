import React from 'react';
import { TabsContent } from "@workspace/ui/components/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

export const NFTTabsContentPlaceholder = () => {
  return (
    <TabsContent value="nfts" className="focus:outline-none">
      <Card className="border-0 rounded-none bg-inherit">
        <CardHeader>
          <CardTitle>NFT Holdings</CardTitle>
          <CardDescription>View and manage your NFTs</CardDescription> 
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="w-full animate-pulse">
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 xl:gap-x-8">
                  {Array(5).fill(0).map((_, index) => (
                    <div key={index} className="relative bg-muted rounded-lg shadow-xl border border-muted w-full">
                      {/* NFT Image Placeholder */}
                      <div className="flex shrink-0 aspect-square rounded-t-md bg-muted overflow-hidden" />

                      {/* Chain and Contract Badges */}
                      <div className="-mt-3 flex justify-end mr-3">
                        <div className="-space-x-1 items-center flex">
                          {/* Contract Badge */}
                          <div className="ring-4 ring-muted h-6 w-6 rounded-full" />
                          
                          {/* Chain Badge */}
                          <div className="ring-4 ring-muted h-6 w-6 rounded-full" />
                        </div>
                      </div>

                      {/* NFT Details */}
                      <div className="px-3 pt-4 pb-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="h-3 w-24 bg-muted rounded" />
                        </div>
                        <div className="h-4 w-32 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </TabsContent>
  );
};