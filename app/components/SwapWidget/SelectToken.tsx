import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  tokenList: string[];
};

export default function SelectToken({ tokenList }: Props) {
  return (
    <Select>
      <SelectTrigger className="rounded-full bg-neutral-700 p-2 h-7">
        <div className="flex items-center gap-2 pr-2">
          <span className="w-3 h-3 rounded-full bg-white"></span>
          <SelectValue
            placeholder="ETH"
            className="font-bold text-white block"
          />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {tokenList.map((token: string) => (
            <SelectItem
              key={token}
              value={token}
              className="font-bold cursor-pointer"
            >
              {token}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
