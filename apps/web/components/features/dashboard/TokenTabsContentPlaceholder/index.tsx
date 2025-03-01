import React from 'react';
import { TabsContent } from "@workspace/ui/components/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

export const TokenTabsContentPlaceholder = () => {
  return (
    <TabsContent value="tokens">
      <Card className="border-0 rounded-none bg-inherit">
        <CardHeader>
          <CardTitle>Token Holdings</CardTitle>
          <CardDescription>View and manage your token portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="w-full animate-pulse">
              <table className="w-full">
                <thead className="border-b border-muted">
                  <tr>
                    <th className="text-left font-normal py-2">
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-16 bg-muted rounded" />
                      </div>
                    </th>
                    <th className="hidden xl:table-cell text-left font-normal">
                      <div className="h-4 w-24 bg-muted rounded" />
                    </th>
                    <th className="hidden lg:table-cell text-left font-normal">
                      <div className="h-4 w-24 bg-muted rounded" />
                    </th>
                    <th className="text-right lg:text-left font-normal">
                      <div className="h-4 w-16 bg-muted rounded ml-auto lg:ml-0" />
                    </th>
                    <th className="w-6" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {Array(5).fill(0).map((_, index) => (
                    <tr key={index} className="hover:bg-accent/50">
                      {/* Token Info */}
                      <td className="py-4"> 
                        <div className="flex items-center">
                          <div className="relative mr-4">
                            <div className="w-8 h-8 rounded-full bg-muted" />
                            <div className="absolute -top-1 -right-1">
                              <div className="w-4 h-4 rounded-full ring-1 ring-border bg-muted" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="h-4 w-16 bg-muted rounded" />
                            <div className="h-3 w-24 bg-muted rounded" />
                          </div>
                        </div>
                      </td>

                      {/* Portfolio % */}
                      <td className="hidden xl:table-cell">
                        <div className="h-4 w-12 bg-muted rounded" />
                      </td>

                      {/* Price */}
                      <td className="hidden lg:table-cell">
                        <div className="h-4 w-16 bg-muted rounded" />
                      </td>

                      {/* Balance */}
                      <td className="text-right lg:text-left">
                        <div className="flex flex-col gap-2">
                          <div className="h-4 w-16 bg-muted rounded ml-auto lg:ml-0" />
                          <div className="h-3 w-24 bg-muted rounded ml-auto lg:ml-0" />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="w-6">
                        <div className="h-4 w-4 bg-muted rounded mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </TabsContent>
  );
};  