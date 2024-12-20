"use client";

import { useUserCampaigns } from '@/hooks/use-factory-operations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { BellRing } from 'lucide-react';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import React from 'react';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { addTier } from '@/hooks/use-campaign-operations';
import { Address } from 'viem';
import { string } from 'zod';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@radix-ui/react-menubar';
import { MenubarSeparator } from '../ui/menubar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const MyCampaigns = () => {
  const { address, isConnected } = useAccount(); // Use inside the component
  const { userCampaigns, error, isLoading } = useUserCampaigns(address!);


  const [progress, setProgress] = React.useState(0);

  const [tierName, setTierName] = React.useState("");
  const [tierAmount, setTierAmount] = React.useState(BigInt(""));

  const router = useRouter()


  React.useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 30;
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full justify-center items-center ">

        <div className="flex flex-col h-full justify-center items-center ">
          <p className='text-nowrap'>Loading your campaigns...</p>
          <Progress value={progress} className="w-[100%]" />
        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full w-full justify-center items-center ">
        <p>Error loading campaigns: {error.message}</p>
      </div>
    );
  }

  if (!userCampaigns || userCampaigns.length === 0) {
    return (
      <div className="flex flex-col h-full w-full justify-center items-center ">
        <p>No campaigns found.</p>
      </div>
    );
  }

  const handleSubmit = (campaignAddress: Address) => {
    try {
      const result = addTier(campaignAddress, { tierName, tierAmount })
    } catch {

    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className=" flex flex-col gap-4 w-full items-center">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        <div className="w-3/4 h-1 bg-gradient-to-r via-white/100 from-white/0 to-white/0" />
      </div>

      <ScrollArea className="  flex  h-full">
        <div className={cn("grid grid-cols-1 gap-4")}>
          {userCampaigns.slice().reverse().map((campaign, index) => (
            <Card key={index} className="w-full">
              <CardHeader>
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>Campaign Address: {campaign.campaignAddress}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium leading-none">Notifications</p>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center space-x-2">
                      <BellRing />
                      <span className="text-sm text-muted-foreground">Owner: {campaign.owner}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <BellRing />
                      <span className="text-sm text-muted-foreground">
                        Created At:{" "}
                        {new Date(
                          typeof campaign.creationTime === "string"
                            ? Number.parseInt(campaign.creationTime) * 1000
                            : Number(campaign.creationTime) * 1000
                        ).toLocaleString()}
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>

                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger>Edit Campaign</MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={(e) => e.stopPropagation()}>Add Tier</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit campaign</DialogTitle>
                              <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>


                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Tier
                                </Label>
                                <Input
                                  id="name"
                                  value={tierName}
                                  onChange={(e) => setTierName(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                  Amount (WEI)
                                </Label>
                                <Input
                                  id="amount"
                                  value={tierAmount.toString()}
                                  onChange={(e) => {
                                    try {
                                      setTierAmount(BigInt(e.target.value));
                                    } catch {
                                      setTierAmount(BigInt(0));
                                    }
                                  }}
                                  className="col-span-3"
                                />

                              </div>
                            </div>


                            <DialogFooter>
                              <Button type="submit" onClick={() => handleSubmit(campaign.campaignAddress)}>Save changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                      </MenubarItem>
                      <MenubarSeparator />

                      <MenubarItem>
                        <Button>
                          see tiers

                        </Button>
                      </MenubarItem>

                    </MenubarContent>

                  </MenubarMenu>
                </Menubar>

                {/* <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Add Tier</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit campaign</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>


                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Tier
                        </Label>
                        <Input
                          id="name"
                          value={tierName}
                          onChange={(e) => setTierName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Amount (WEI)
                        </Label>
                        <Input
                          id="amount"
                          value={tierAmount.toString()}
                          onChange={(e) => {
                            try {
                              setTierAmount(BigInt(e.target.value));
                            } catch {
                              setTierAmount(BigInt(0));
                            }
                          }}
                          className="col-span-3"
                        />

                      </div>
                    </div>


                    <DialogFooter>
                      <Button type="submit" onClick={() => handleSubmit(campaign.campaignAddress)}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog> */}

              </CardFooter>
            </Card>
          ))}

        </div>
      </ScrollArea>
    </div>
  );
};
