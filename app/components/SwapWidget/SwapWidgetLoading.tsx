import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const SwapWidgetLoading = () => {
  return (
    <div className="bg-neutral-700 rounded-lg p-3">
      <div className="flex flex-col gap-3">
        <Skeleton className="bg-neutral-800 p-3 pb-6 rounded-lg h-[140px]" />
        <Skeleton className="bg-neutral-800 p-3 pb-6 rounded-lg h-[140px]" />
      </div>
    </div>
  );
};

export default SwapWidgetLoading;
