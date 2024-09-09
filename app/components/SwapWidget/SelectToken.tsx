import React from "react";
import { Token } from "@/types";

import { SelectProps } from "@radix-ui/react-select";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props extends SelectProps {
  tokenList: Token[];
}

export default function SelectToken({ tokenList, onValueChange, value }: Props) {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="rounded-full bg-neutral-700 p-2 h-7">
        <div className="flex items-center gap-2 pr-2">
          <span className="w-3 h-3 rounded-full bg-white"></span>
          <SelectValue placeholder={tokenList[0].name} className="font-bold text-white block" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {tokenList.map((token: Token) => (
            <SelectItem
              key={token.address}
              value={JSON.stringify(token)}
              className="font-bold cursor-pointer"
              disabled={token.disabled}
            >
              {token.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
