import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Nft } from "@/types";

interface NftTableProps {
  data: Nft[];
}

const NftTable = ({ data }: NftTableProps) => {
  const cols = [
    { key: "tokenId", label: "TokenId", className: "" },
    { key: "name", label: "Name", className: "" },
    { key: "owner", label: "Owner", className: "" },
  ];
  return (
    <Table className="w-full rounded-md border">
      <TableHeader>
        <TableRow>
          {cols.map((col) => (
            <TableHead key={col.label} className={col.className}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {!data || data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={cols.length}
              className="text-xl text-center font-semibold"
            >
              No data
            </TableCell>
          </TableRow>
        ) : (
          data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.tokenId}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.owner}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default NftTable;
