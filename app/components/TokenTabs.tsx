import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import HolderDistribution from "../(tabs)/HolderDistribution";
import Price from "../(tabs)/Price";
import SupplyDynamics from "../(tabs)/SupplyDynamics";
import TokenDetails from "../(tabs)/TokenDetails";
import Volume from "../(tabs)/Volume";

const TokenTabs = () => {
  const tabs = [
    {
      value: "details",
      label: "Token Details",
      component: <TokenDetails />,
      disabled: false,
    },
    { value: "price", label: "Price", component: <Price />, disabled: true },
    { value: "volume", label: "Volume", component: <Volume />, disabled: true },
    {
      value: "holder",
      label: "Holder Distribution",
      component: <HolderDistribution />,
      disabled: true,
    },
    {
      value: "supply",
      label: "Supply Dynamics",
      component: <SupplyDynamics />,
      disabled: true,
    },
  ];
  return (
    <Tabs
      defaultValue="details"
      className="w-full flex flex-col gap-2 items-center justify-center"
    >
      <TabsList className="flex flex-row gap-x-4 text-neutral-400">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="font-bold"
            disabled={tab.disabled}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TokenTabs;
