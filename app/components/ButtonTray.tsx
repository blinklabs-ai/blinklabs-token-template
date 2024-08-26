import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/buttons/button";
import { LINKS } from "@/constants/common";

import config from "@/uiconfig.json";

const ButtonTray = () => {

  const { project } = config;

  return (
    <div className="flex items-center gap-2 mt-6">
      <Button className="font-bold" variant={"default"}>
        <Link href={project?.swapLink} target="_blank_">
          Buy on PancakeSwap
        </Link>
      </Button>
      {/* <p className="font-bold text-inactive">(Coming soon!)</p> */}
    </div>
  );
};

export default ButtonTray;
