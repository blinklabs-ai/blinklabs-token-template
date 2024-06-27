import { Button } from "@/components/ui/buttons/button";
import React from "react";

const ButtonTray = () => {
  return (
    <div className="flex gap-2">
      <Button className="bg-orange-600">Mint</Button>
      <Button className="bg-orange-600">Buy on Uniswap</Button>
    </div>
  );
};

export default ButtonTray;
