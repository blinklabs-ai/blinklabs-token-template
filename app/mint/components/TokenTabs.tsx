import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenDetails from "../(tabs)/TokenDetails";
import Price from "../(tabs)/Price";
import SupplyDynamics from "../(tabs)/SupplyDynamics";
import Volume from "../(tabs)/Volume";
import HolderDistribution from "../(tabs)/HolderDistribution";

const TokenTabs = () => {
  const tabs = [
    { value: "details", label: "Token Details" },
    { value: "price", label: "Price" },
    { value: "volume", label: "Volume" },
    { value: "holder", label: "Holder Distribution" },
    { value: "supply", label: "Supply Dynamics" },
  ];
  return (
    <Tabs
      defaultValue="details"
      className="w-full flex flex-col gap-2 items-center justify-center"
    >
      <TabsList className="grid w-fit grid-cols-5 bg-black text-gray-700">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-black data-[state=active]:text-white font-bold"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="details">
        <TokenDetails />
      </TabsContent>
      <TabsContent value="price">
        <Price />
      </TabsContent>
      <TabsContent value="volume">
        <Volume />
      </TabsContent>
      <TabsContent value="holder">
        <HolderDistribution />
      </TabsContent>
      <TabsContent value="supply">
        <SupplyDynamics />
      </TabsContent>
    </Tabs>
  );
};

export default TokenTabs;
